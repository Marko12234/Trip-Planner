# Trip Planner
 
Interactive trip planner built with Leaflet.js librarby. Click on preselected cities and airports across Europe to see information about them, and measure the straight-line distance between any two locations.

## Features
 
- Interactive map (OpenStreetMap tiles via Leaflet.js), centered on Europe
- Preselected cities (blue markers) with country and region info
- Airports (red markers) to tell them apart from cities at a glance
- Distance measurement: click one location, then a second one, and the sidebar shows the straight-line distance in km (calculated with the Haversine formula, which accounts for the curvature of the Earth)
- Guard against selecting the same location twice
- Reset button to cancel a selection
- Responsive layout: map and sidebar side by side on desktop, stacked on small screens

## Tech Stack
 
- HTML, CSS, vanilla JavaScript (no framework, no build step)
- [Leaflet.js](https://leafletjs.com/) loaded via CDN
- OpenStreetMap tiles

## Design Decisions
 
**MVP first, no backend.** I wanted to build a working MVP first and extend it step by step, so I deliberately started without a backend. That is why the project is frontend-only. The distance is a straight-line distance instead of a real travel time, and the sidebar labels it as "Luftlinie" so it is not mistaken for a driving distance. Real route times would need a routing API and a backend, which is a planned next step (see below).
 
**Leaflet instead of Google Maps.** Leaflet needs no billing account and no API key. In a frontend-only project any key would be visible in the source code, which would risk abuse.
 

## Challenges & Learnings

### Keyboard Event Conflict with System Audio Controls

**Problem:** While testing the app, I noticed that pressing the mute/unmute 
button on my system would unexpectedly trigger the map to zoom out, 
but only when the map had focus. This didn't happen with volume 
up/down, only with mute toggling.

**Investigation:** Leaflet listens for keyboard events (arrow keys, +/-) 
on the map element to support keyboard-based navigation and zooming. I 
suspected that certain system-level key events (possibly interpreted 
differently depending on keyboard layout or OS media key mapping) were 
being picked up by Leaflet's internal keyboard handler, even though they 
had nothing to do with map navigation. I tried using Firefox instead of Chrome like I regularly do, and the problem persisted. Because of that I suspected that it's not the broswer's fault.

**Solution:** I added a custom `keydown` event listener directly on the 
map container that filters which keys are allowed to reach Leaflet's 
internal handler:

```javascript
document.getElementById('map').addEventListener('keydown', (e) => {
  const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-'];
  if (!allowedKeys.includes(e.key)) {
    e.stopPropagation();
  }
});
```

This uses `stopPropagation()` to prevent any key that isn't explicitly 
needed for map navigation from "bubbling up" to Leaflet's event handler, 
while still preserving intended keyboard accessibility (arrow keys and 
zoom keys still work as expected).

**What I learned:** This was my first real encounter with JavaScript's 
event propagation (bubbling) model, and how third-party libraries like 
Leaflet can have event listeners that interact with OS-level 
events in unexpected ways. It taught me to debug by isolating which 
specific condition triggers a bug (in this case: mute only, map focus 
required) rather than assuming the whole feature is broken.


## Possible Next Steps
 
- Real travel times via a routing API (would need a backend to keep the key private)
- More destinations and additional info per location