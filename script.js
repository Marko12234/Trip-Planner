var map = L.map('map').setView([47.47, 8.30], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const destinations = [
    { name: "Luzern", country: "Schweiz", region: "Kanton Luzern", coords: [47.05, 8.30], type: "stadt" },
    { name: "Rom", country: "Italien", region: "Lazio", coords: [41.89, 12.49], type: "stadt" },
    { name: "München", country: "Deutschland", region: "Bayern", coords: [48.13, 11.57], type: "stadt" },
    { name: "Paris", country: "Frankreich", region: "Île-de-France", coords: [48.85, 2.35], type: "stadt" },
    { name: "Wien", country: "Österreich", region: "Bundesland Wien", coords: [48.20, 16.37], type: "stadt" },
    { name: "Thun", country: "Schweiz", region: "Kanton Bern", coords: [46.75, 7.63], type: "stadt" },
    { name: "London", country: "England", region: "City of London", coords: [51.51, -0.13], type: "stadt" },
    { name: "Bristol", country: "England", region: "South West England", coords: [51.45, -2.58], type: "stadt" },
    { name: "Neapel", country: "Italien", region: "Kampanien", coords: [40.84, 14.24], type: "stadt" },
    { name: "Palermo", country: "Italien", region: "Sizilien", coords: [38.12, 13.36], type: "stadt" },

];

const airports = [
    { name: "Flughafen Zürich", coords: [47.46, 8.55], type: "flughafen" },
    { name: "EuroAirport Basel-Mulhouse", coords: [47.59, 7.53], type: "flughafen" },
    { name: "Flughafen Rom-Fiumicino", coords: [41.80, 12.25], type: "flughafen" },
]; 


var flughafenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const alleOrte = [...destinations, ...airports];

var markers = alleOrte.map(ort => {
  const optionen = ort.type === "flughafen" ? { icon: flughafenIcon } : {};
  return L.marker(ort.coords, optionen)
    .addTo(map)
    .bindPopup(`${ort.name}`);
});
  // Harvesine-Formel aus dem Internet
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

let ersteAuswahl = null;

markers.forEach((marker, i) => {
  marker.on('click', () => {
    const aO = alleOrte[i];
    
    if (ersteAuswahl === null) {
      // Erster Klick: als Startpunkt merken
      ersteAuswahl = aO;
      document.getElementById('info_message').innerHTML = 
        `<h2>${aO.name}</h2><p>Wähle ein zweites Ziel für die Distanz.</p>`;
    } else {
      // Zweiter Klick: Distanz berechnen
      const distanz = getDistance(ersteAuswahl.coords, aO.coords);
      if (distanz === 0) {
        document.getElementById('info_message').innerHTML = 
          `<h2>${ersteAuswahl.name} → ${aO.name}</h2><p>Bitte wähle einen anderen Ort als Ziel aus.</p>`;
      } else {

      document.getElementById('info_message').innerHTML = 
        `<h2>${ersteAuswahl.name} → ${aO.name}</h2><p>Luftlinie: ${distanz.toFixed(0)} km</p>`;
        }
      ersteAuswahl = null; // Reset für nächste Messung
      
    }
  });
});