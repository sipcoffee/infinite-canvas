import { create } from "zustand";

export const useViewportStore = create((set, get) => ({
  viewport: {
    x: 0,
    y: 0,
    zoom: 1,
    width: window.innerWidth,
    height: window.innerHeight,
  },

  // direct setter
  setViewport: (vp) =>
    set({
      viewport: {
        ...get().viewport,
        ...vp,
      },
    }),

  // translate screen by dx/dy * current_zoom
  panBy: (dx, dy) => {
    const { viewport } = get();
    set({
      viewport: {
        ...viewport,
        x: viewport.x + dx / viewport.zoom,
        y: viewport.y + dy / viewport.zoom,
      },
    });
  },

  // zoom at center or at given point later
  zoomAt: (deltaZoom) => {
    const { viewport } = get();
    const newZoom = Math.max(0.1, viewport.zoom + deltaZoom);
    set({
      viewport: { ...viewport, zoom: newZoom },
    });
  },

  // store width + height on resize
  updateDimensions: () =>
    set({
      viewport: {
        ...get().viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    }),
}));
