var map = L.map('map').setView([47.47, 8.30], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const destinations = [
    { name: "Luzern", country: "Schweiz", region: "Kanton Luzern", coords: [47.05, 8.30] },
    { name: "Rom", country: "Italien", region: "Lazio", coords: [41.89, 12.49] },
    { name: "München", country: "Deutschland", region: "Bayern", coords: [48.13, 11.57] },
    { name: "Paris", country: "Frankreich", region: "Île-de-France", coords: [48.85, 2.35] },
    { name: "Wien", country: "Österreich", region: "Bundesland Wien", coords: [48.20, 16.37] },
    { name: "Thun", country: "Schweiz", region: "Kanton Bern", coords: [46.75, 7.63] },
    { name: "London", country: "England", region: "City of London", coords: [51.51, -0.13] },
    { name: "Bristol", country: "England", region: "South West England", coords: [51.45, -2.58] },
    { name: "Neapel", country: "Italien", region: "Kampanien", coords: [40.84, 14.24] },
    { name: "Palermo", country: "Italien", region: "Sizilien", coords: [38.12, 13.36] },

];

var markers = destinations.map(dest => L.marker(dest.coords).addTo(map));

var markers = destinations.map(dest => 
  L.marker(dest.coords)
    .addTo(map)
    .bindPopup(`${dest.name}<br>${dest.country}<br>${dest.region}`)
);

function getDistance(coord1, coord2) {
  const R = 6371; // Erdradius in km
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Distanz in km
}