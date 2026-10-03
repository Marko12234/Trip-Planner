Work in Progress

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