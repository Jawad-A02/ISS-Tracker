let latitudeText = document.querySelector('.latitude');
let longitudeText = document.querySelector('.longitude');
let timeText = document.querySelector('.time');
let speedText = document.querySelector('.speed');
let altitudeText = document.querySelector('.altitude');
let visibilityText = document.querySelector('.visibility');

let lat = 51.505;
let long = -0.09;
let zoomlevel = 8;
// drawing the map interface on #map-div
const map = L.map('map-div').setView([lat, long], zoomlevel);


// add map tiles from Mapbox' Static tiles API
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiamF3YWQtMjAwMi0iLCJhIjoiY2xldWJkbGtjMWlpdDN6cTZmYWdoaTFubyJ9.stNtIDev_CWr5Sb8rK6V-A'
}).addTo(map);

//sett Satellite.png as icon to track on map
const icon = L.icon({
    iconUrl: './img/Satellite.png',
    iconSize: [90, 45],
    iconAnchor: [25, 94],
    popupAnchor: [20, -86]
  });

// adding the marker to the map
const marker = L.marker([lat, long], {icon: icon}).addTo(map);

// find the satellite
function findSatallite() {
    fetch("https://api.wheretheiss.at/v1/satellites/25544")
        .then(response => response.json())
        .then(data => {
            lat = data.latitude.toFixed(2);
            long = data.longitude.toFixed(2);
            // converting data to seconds then to UTC Format
            const timestamp = new Date(data.timestamp * 1000).toUTCString();
            const speed = data.velocity.toFixed(2);
            const altitude = data.altitude.toFixed(2);
            const visibility = data.visibility;
            // call updateSatellite function to update everything
            updateSatellite(lat, long, timestamp, speed, altitude, visibility);
        })
        .catch(e => console.log(e));
}

// update the Satallite's location
function updateSatellite(lat, long, timestamp, speed, altitude, visibility)
{
    marker.setLatLng([lat, long]);
    //updates the map
    map.setView([lat, long]);
    //updates the elements
    latitudeText.innerText = lat;
    longitudeText.innerText = long;
    timeText.innerText = timestamp;
    speedText.innerText = `${speed} km/hr`;
    altitudeText.innerText = `${altitude} km`
    visibilityText.innerText = visibility;
}

findSatallite();

//move the Satallite every 2 seconds
setInterval(findSatallite, 2000);

