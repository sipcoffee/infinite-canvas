// Simple procedural starfield generator
export function generateStars(count = 8000, seed = 1) {
  const stars = new Array(count).fill(0).map((_, i) => {
    const angle = (i * 137.5) % 360; // cheap pseudo-distribution
    const r = Math.random() * 20000 - 10000;
    return {
      id: i,
      x: (Math.random() - 0.5) * 20000,
      y: (Math.random() - 0.5) * 20000,
      size: Math.random() * 2.2 + 0.3,
      brightness: 0.6 + Math.random() * 0.4,
    };
  });
  return stars;
}
