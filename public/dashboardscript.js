
document.getElementById("myButton").onclick = function() {
  const stationName = document.getElementById("sname").value;
  const breitengrad = document.getElementById("breitengrad").value;
  const laengengrad = document.getElementById("laengengrad").value;

    fetch('/button-click')
     .then(response => response.json())
     .then(data => {

        const newStationBorder = document.createElement('div');
        newStationBorder.className = 'station-border';
        newStationBorder.id = 'station-border';


        const stationLayout = document.getElementById("station-layout");
        stationLayout.id = "station-layout";

        stationLayout.appendChild(newStationBorder);

        const newFlexStationRow = document.createElement('div');
        newFlexStationRow.className = 'flex-station-row';

        const newFlexInfoBox1 = document.createElement('div');
        newFlexInfoBox1.className = 'flex-info-box';
        newFlexStationRow.appendChild(newFlexInfoBox1);
        const box1h3 = document.createElement('h3');
        box1h3.innerText = `${stationName}`;
        newFlexInfoBox1.appendChild(box1h3);
        const box1p1 = document.createElement('p');
        box1p1.innerText = `Lat: ${breitengrad}`;
        newFlexInfoBox1.appendChild(box1p1);
        const box1p2 = document.createElement('p');
        box1p2.innerText = `Lon: ${laengengrad}`;
        newFlexInfoBox1.appendChild(box1p2);

        const newFlexInfoBox2 = document.createElement('div');
        newFlexInfoBox2.className = 'flex-info-box';
        newFlexStationRow.appendChild(newFlexInfoBox2);
        const box2h3 = document.createElement('h3');
        box2h3.innerText = 'Wetter';
        newFlexInfoBox2.appendChild(box2h3);
        const box2p1 = document.createElement('p');
        box2p1.innerText = '500';
        newFlexInfoBox2.appendChild(box2p1);

        const newFlexInfoBox3 = document.createElement('div');
        newFlexInfoBox3.className = 'flex-info-box';
        newFlexStationRow.appendChild(newFlexInfoBox3);
        const box3h3 = document.createElement('h3');
        box3h3.innerText = 'Temperatur';
        newFlexInfoBox3.appendChild(box3h3);
        const box3p1 = document.createElement('p');
        box3p1.innerText = '17.67 Grad';
        newFlexInfoBox3.appendChild(box3p1);

        const newFlexInfoBox4 = document.createElement('div');
        newFlexInfoBox4.className = 'flex-info-box';
        newFlexStationRow.appendChild(newFlexInfoBox4);
        const box4h3 = document.createElement('h3');
        box4h3.innerText = 'Wind';
        newFlexInfoBox4.appendChild(box4h3);
        const box4p1 = document.createElement('p');
        box4p1.innerText = '0.89 bft';
        newFlexInfoBox4.appendChild(box4p1);

        const newFlexInfoBox5 = document.createElement('div');
        newFlexInfoBox5.className = 'flex-info-box';
        newFlexStationRow.appendChild(newFlexInfoBox5);
        const box5h3 = document.createElement('h3');
        box5h3.innerText = 'Luftdruck';
        newFlexInfoBox5.appendChild(box5h3);
        const box5p1 = document.createElement('p');
        box5p1.innerText = '1017 hpa';
        newFlexInfoBox5.appendChild(box5p1);

        newStationBorder.appendChild(newFlexStationRow);

        const newButtonDiv = document.createElement('div');
        newButtonDiv.className  = 'details';
        newStationBorder.appendChild(newButtonDiv);

        const newDetailsLink = document.createElement('a');
        newDetailsLink.href = `/${stationName}?lat=${breitengrad}&lon=${laengengrad}`;
        ;
        newButtonDiv.appendChild(newDetailsLink);

        const fileIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
  <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
  <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
</svg>`
        newDetailsLink.innerHTML = fileIconSVG;

        const newTrashDiv = document.createElement('div');
        newTrashDiv.className = 'trash-button';
        newButtonDiv.appendChild(newTrashDiv);
        const trashIconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>`;
        newTrashDiv.innerHTML = trashIconSVG;



      newTrashDiv.querySelector('.bi-trash3').addEventListener('click', () => {
        newStationBorder.remove();
      });

      })
     .catch(error=> console.error('Error:', error));
};


