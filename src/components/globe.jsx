"use client";

import { useEffect, useMemo, useRef } from "react";
import createGlobe from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { twMerge } from "tailwind-merge";

const MOVEMENT_DAMPING = 1400;

const MADAGASCAR = { lat: -18.8792, lon: 47.5079 };
const toRad = (deg) => (deg * Math.PI) / 180;

const DEFAULT_CONFIG = {
  phi: -toRad(MADAGASCAR.lon),
  theta: -13.2,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 8000,       
  mapBrightness: 1.2,
  baseColor: [0.5, 0.5, 0.5],
  markerColor: [0, 1, 1],
  glowColor: [1, 1, 1],
  markers: [{ location: [MADAGASCAR.lat, MADAGASCAR.lon], size: 0.08 }],
};

export function Globe({ className, config = DEFAULT_CONFIG }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const globeRef = useRef(null);

  const sizeRef = useRef(0);
  const phiRef = useRef(config?.phi ?? 0);

  const pointerInteracting = useRef(null);

  const r = useMotionValue(0);
  const rs = useSpring(r, { mass: 1, damping: 30, stiffness: 100 });

  const stableConfig = useMemo(() => config, []); 

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5); 

    const ensureInit = (w) => {
      if (globeRef.current) return;
      if (!w || w < 10) return;

      globeRef.current = createGlobe(canvas, {
        ...stableConfig,
        devicePixelRatio: DPR,
        width: Math.floor(w * DPR),
        height: Math.floor(w * DPR),
        onRender: (state) => {
  
          if (pointerInteracting.current === null) phiRef.current += 0.005;

          const size = sizeRef.current || w;
          state.phi = phiRef.current + rs.get();
          state.width = Math.floor(size * DPR);
          state.height = Math.floor(size * DPR);
        },
      });

      requestAnimationFrame(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = "1";
      });
    };

    const ro = new ResizeObserver(() => {
      const w = Math.floor(wrapper.getBoundingClientRect().width);
      if (w > 0) sizeRef.current = w;
      ensureInit(w);
    });

    ro.observe(wrapper);

    const w0 = Math.floor(wrapper.getBoundingClientRect().width);
    if (w0 > 0) {
      sizeRef.current = w0;
      ensureInit(w0);
    }

    return () => {
      ro.disconnect();
      globeRef.current?.destroy();
      globeRef.current = null;
    };
  }, [rs, stableConfig]);

  const setInteracting = (value) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const move = (clientX) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={twMerge(
        "w-full h-full aspect-square",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size] bg-transparent"
        onPointerDown={(e) => setInteracting(e.clientX)}
        onPointerUp={() => setInteracting(null)}
        onPointerCancel={() => setInteracting(null)}
        onPointerOut={() => setInteracting(null)}
        onPointerMove={(e) => move(e.clientX)}
        onTouchMove={(e) => e.touches[0] && move(e.touches[0].clientX)}
      />
    </div>
  );
}
