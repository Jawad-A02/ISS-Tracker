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

//asks user for their location 
const userLoc = prompt('Please enter your location (e.g. city, country):')

//get the user's location by API
function getUserLocation() {
  fetch(`https://nominatim.openstreetmap.org/search?q=${userLoc}&format=json`)
    .then(response => response.json())
    .then(data => {
      const userLat = data[0].lat;
      const userLong = data[0].lat;
      const diff = calculateDistance(userLat, userLong, lat, long);
      userLocation(diff);
    })
    .catch(e => console.log(e))
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = degRad(lat2 - lat1);
  const dLon = degRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degRad(lat1)) * Math.cos(degRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d.toFixed(2);
}

function degRad(deg) {
  return deg * (Math.PI / 180)
}

function userLocation(diff) {
  const body = document.getElementById('data');
  const p = document.createElement('p');
  const date = Date();
  p.innerText = `At ${date}, ISS Satallite was approximately ${diff} away from you`;
  body.appendChild(p);
}

getUserLocation();


