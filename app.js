const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");

const pg = require("pg");

/* Reading global variables from config file */
dotenv.config();
const PORT = process.env.PORT;

const DB_CON_STRING = process.env.DB_CON_STRING;

/*
 *
 * Express setup
 *
*/

if(DB_CON_STRING == undefined){
  console.log("ERROR");
  process.exit(1);
};

app = express();

app.use(express.urlencoded({ extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

//turn on serving static files (required for delivering css to client)
app.use(express.static("public"))

app.use(session({
  secret: "This is a secret!",
  cookie: { maxAge: 3600000 },
  resave: true,
  saveUninitialized: true
}));

//configure template engine
app.set("views", "views");
app.set("view engine", "pug");

app.get('/', (req, res) => {
  res.render("index", { session: req.session });
});

pg.defaults.ssl=false;
var dbClient = new pg.Client(DB_CON_STRING);
dbClient.connect()

app.get("/dashboard",  function (req, res) {
  //is user logged in?
  if(!req.session.username) {
    return res.redirect('/');
  }
// get stations for dashboard
  const query = "SELECT * FROM stations WHERE username = $1"
  dbClient.query(query, [req.session.username], function (dbError, dbResponse) {
    stations = dbResponse.rows;
    res.render('dashboard', {stations, session: req.session});
  });
});

app.post('/add-station', async (req, res) => {
  const { stationname, latitude, longitude } = req.body;

  const selectQuery = 'SELECT * FROM stations WHERE username = $1';
  const selectCheckQuery = 'SELECT stationname FROM stations WHERE stationname = $1 AND username = $2';
  const insertQuery = 'INSERT INTO stations (stationname, latitude, longitude, username) VALUES ($1, $2, $3, $4)';

  try {
    // Check if the station already exists
    const selectResult = await dbClient.query(selectCheckQuery, [stationname, req.session.username]);

    if (selectResult.rows.length > 0) {
      console.log('Station already exists!');
      const stationsResult = await dbClient.query(selectQuery, [req.session.username]);
      const stations = stationsResult.rows;
      return res.render('dashboard', { stations, session: req.session, response: 'Station already exists!' });
    }else {
      // Insert the new station
      await dbClient.query(insertQuery, [stationname, latitude, longitude, req.session.username]);
      res.redirect('/dashboard');
    }
  } catch (dbError) {
    console.error('Error querying or inserting data:', dbError);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete-station', (req, res) => {
  const query = 'DELETE FROM stations WHERE stationname = $1 AND username = $2';
  const stationName = req.body.stationname;
//delete station
  dbClient.query(query, [stationName, req.session.username], function(dbError, dbResponse) {
    if(dbError){
      console.error('Error deleting station:', dbError);
    } else {
      res.redirect('/dashboard');
    }
  })
});

app.get("/register", function(req, res) {
  res.render("register", {session: req.session});
});

app.get("/station-details/:stationName", async (req, res) => {
  //is user logged in?
  if (!req.session.username) {
    return res.redirect('/');
  }

  const stationName = req.params.stationName; 
  const selectStationLatQuery = `select latitude from stations where stationname = $1 AND username = $2`;
  const selectStationLonQuery = `select longitude from stations where stationname = $1 AND username = $2`;
  const selectAllQuery = `SELECT * FROM weather WHERE weather.stationname = $1 AND weather.username = $2`;

  try {

    const latResponse = await dbClient.query(selectStationLatQuery, [stationName, req.session.username]);
    const lonResponse = await dbClient.query(selectStationLonQuery, [stationName, req.session.username]);
    
    //get lat and lon values from db response
    const lat = latResponse.rows[0].latitude;
    const lon = lonResponse.rows[0].longitude;

    //get weather data
    dbClient.query(selectAllQuery, [stationName, req.session.username], (dbError, dbResponse) => {
      if (dbError) {
        console.error('Error fetching station details:', dbError);
        return res.status(500).send('Error fetching station details');
      }

      const weathers = dbResponse.rows;
      res.render('station-details', { stationName, lat, lon, weathers, session: req.session });
    });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Database error');
  }
});
app.post('/add-messung', (req, res) => {
  const query = 'INSERT INTO weather (stationname, zeitpunkt, wetter, temperatur, windgeschwindigkeit, windrichtung, luftdruck, username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
  const { stationname, code, temperatur, windgeschwindigkeit, windrichtung, luftdruck, lat, lon } = req.body;
  const zeitpunkt = new Date();
  const values = [stationname, zeitpunkt, code, temperatur, windgeschwindigkeit, windrichtung, luftdruck, req.session.username];
 
  //insert messung into db
  dbClient.query(query, values, function(dbError, dbResponse) {
    if(dbError){
      console.error('Error adding station:', dbError);
    } else {
      const redirectUrl = `/station-details/${stationname}`;
        res.redirect(redirectUrl);
    }
  })
});

app.post('/delete-messung', (req, res) => {
  const query = 'DELETE FROM weather WHERE zeitpunkt = $1 and username = $2';
  const { stationname, zeitpunkt, lat, lon } = req.body;
  const value = [zeitpunkt, req.session.username];

  //delete messung from db
  dbClient.query(query, value, function(dbError, dbResponse) {
    if(dbError){
      console.error('Error deleting station:', dbError);
    } else {
      const redirectUrl = `/station-details/${stationname}`;
        res.redirect(redirectUrl);
    }
  })
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const queryCheckUser = 'SELECT username FROM users WHERE username = $1';
  const queryInsertUser = 'INSERT INTO users (username, password) VALUES ($1, $2)';

  //check if user is already in db
  dbClient.query(queryCheckUser, [username], function(dbError, dbResponse) {
    if (dbError) {
      console.error('Error querying the database:', dbError);
    }

    if (dbResponse.rows.length > 0) {
      console.log('Username already exists');
      return res.render('register', { session: req.session, response: "Registration failed, username already exists!"});
      res.redirect('/register');
    } else {
      //if not insert user into db
      dbClient.query(queryInsertUser, [username, password], function(dbInsertError, dbInsertResponse) {
        if (dbInsertError) {
          console.error('Error inserting into the database:', dbInsertError);
        }
        res.redirect('/');
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT username, password FROM users WHERE username = $1 and password = $2';

  //get user and password from db
  dbClient.query(query, [username, password], function(dbError, dbResponse) {
    if(dbError) {
      console.error('Error querying the database:', dbError);
    }
    //if something was returned, user and password are correct
    if (dbResponse.rows.length > 0) {
      req.session.username = username;
      res.redirect('/dashboard');
    //if not, user or password were incorrectly entered
    } else {
      console.log("Login failed, password incorrectly entered or username doesn't exist");
      return res.render('index', { session: req.session, response: "Login failed, password incorrectly entered or username doesn't exist"});
      };
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

app.listen(PORT, function() {
  console.log(`Weathertop running and listening on port ${PORT}`);
});

