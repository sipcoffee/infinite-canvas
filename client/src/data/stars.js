// Simple procedural starfield generator
export function generateStars(count = 1000000, seed = 1) {
  const stars = new Array(count).fill(0).map((_, i) => {
    const angle = (i * 137.5) % 360; // cheap pseudo-distribution
    const r = Math.random() * 20000 - 10000;
      // // check if mouse is near this star

    return {
      id: i,
      x: (Math.random() - 0.5) * 20000,
      y: (Math.random() - 0.5) * 20000,
      size: Math.random() * 2.2 + 0.2,
      brightness: 0.6 + Math.random() * 0.4,
      pulsePhase: Math.random() * Math.PI * 2,  // random offset
      pulseSpeed: 0.02 + Math.random() * 0.03, // speed of pulsing
      pulseAmp: 0.25,                           // size +-25%
      color: randomStarColor(),           // <—— ⭐ ADD THIS
    };
  });
  return stars;
}


function randomStarColor() {
  const r = Math.random();
  if (r < 0.25) return "#7ec8ff";     // blue-white
  if (r < 0.40) return "#ffe48c";     // yellow / gold
  return "#ffffff";                   // white (majority)
}