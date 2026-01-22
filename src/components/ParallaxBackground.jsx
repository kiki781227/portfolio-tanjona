import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const DESIGN = { w: 1440, h: 900 };
const MOBILE_BP = 850;

const PHASE = {
  LOADING: "loading",
  BG1_IN: "bg1_in",
  RULE_IN: "rule_in",
  DRAW: "draw",
  OUT: "out",
  BG2_IN: "bg2_in",
  LAYERS: "layers",
};

function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return vp;
}

function preloadImages(urls) {
  return Promise.all(
    urls.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = async () => {
          try {
            if (img.decode) await img.decode();
          } catch (_) {}
          resolve();
        };
        img.onerror = resolve;
        img.src = src;
      });
    })
  );
}

export default function ParallaxBackground({ onReady }) {
  const { w, h } = useViewport();
  const isMobile = w <= MOBILE_BP;
  const isPortrait = h > w;

  const scale = Math.max(w / DESIGN.w, h / DESIGN.h);

  const POS = useMemo(() => {
    const desktop = {
      bg1Scale: 0.85,
      bg2Scale: 0.85,

      regle: { x: 320, y: 10, width: 800 },

      crayon: { x: 180, y:250, width: 280 },

      haut: { x: 30, y: 70, width: 1280 },
      bas: { x: 100, y: 100, width: 1200 },
    };

    const mobile = {
      bg1Scale: 0.8,
      bg2Scale: 0.8,

      regle: { x: 60, y: 520, width: 1320 },
      crayon: { x: 100, y: 520, width: 300 },

      haut: { x: -40, y: 40, width: 1500 },
      bas: { x: 40, y: 160, width: 1360 },
    };

    const mobilePortrait = {
      bg1Scale: 1,
      bg2Scale: 1,

      regle: { x:475, y: 100, width: 500 },
      crayon: { x: -150, y: 240, width: 180 },

      haut: { x: 250, y: 230, width: 900 },
      bas: { x: 290, y: 230, width: 850 },
    };

    if (!isMobile) return desktop;
    return isPortrait ? mobilePortrait : mobile;
  }, [isMobile, isPortrait]);

  const urls = useMemo(
    () => [
      "/assets/background.png",
      "/assets/regle.png",
      "/assets/crayon.png",
      "/assets/background2.png",
      "/assets/haut.png",
      "/assets/bas.png",
    ],
    []
  );

  const [assetsReady, setAssetsReady] = useState(false);
  const [phase, setPhase] = useState(PHASE.LOADING);


  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const doneRef = useRef({
    bg1: false,
    rule: false,
    draw: false,
    out: false,
    bg2: false,
    final: false,
  });

  const fireFinalReady = () => {
    if (doneRef.current.final) return;
    doneRef.current.final = true;
    onReadyRef.current?.();
  };

  useEffect(() => {
    let cancelled = false;

    preloadImages(urls).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        setAssetsReady(true);
        setPhase(PHASE.BG1_IN);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [urls]);

  const bgFade = 0.7;
  const ruleInDur = 0.001;
  const pencilDrawDur = 1;
  const outDur = 0.5;
  const bg2Dur = 1;

  const PENCIL_PADDING_LEFT = 40;
  const PENCIL_PADDING_RIGHT = -100;
  const pencilTravel = Math.max(
    0,
    POS.regle.width - POS.crayon.width - (PENCIL_PADDING_LEFT + PENCIL_PADDING_RIGHT)
  );

  const hautInitialY = isMobile ? -650 : -1000;
  const basInitialX = isMobile ? -220 : -400;

  return (
    <section className="absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 bg-neutral-800 transition-opacity duration-500 ${
          assetsReady ? "opacity-0" : "opacity-100"
        }`}
      />

      <motion.img
        src="/assets/background.png"
        alt=""
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{
          opacity: assetsReady ? (phase === PHASE.BG2_IN || phase === PHASE.LAYERS ? 0 : 1) : 0,
          scale: POS.bg1Scale,
        }}
        transition={{
          opacity: { duration: bgFade, ease: "easeOut" },
          scale: { duration: 0.001 },
        }}
        onAnimationComplete={() => {
          if (phase === PHASE.BG1_IN && !doneRef.current.bg1) {
            doneRef.current.bg1 = true;
            setPhase(PHASE.RULE_IN);
          }
        }}
        style={{ transformOrigin: "center" }}
      />

      <motion.img
        src="/assets/background2.png"
        alt=""
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === PHASE.BG2_IN || phase === PHASE.LAYERS ? 1 : 0,
          scale: POS.bg2Scale,
        }}
        transition={{
          opacity: { duration: bg2Dur, ease: "easeOut" },
          scale: { duration: 0.001 },
        }}
        onAnimationComplete={() => {
          if (phase === PHASE.BG2_IN && !doneRef.current.bg2) {
            doneRef.current.bg2 = true;
            setPhase(PHASE.LAYERS);
          }
        }}
        style={{ transformOrigin: "center" }}
      />

      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN.w,
          height: DESIGN.h,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        <motion.img
          src="/assets/regle.png"
          alt=""
          className="absolute select-none pointer-events-none"
          draggable={false}
          style={{
            left: POS.regle.x,
            top: POS.regle.y,
            width: POS.regle.width,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{
            opacity: phase === PHASE.RULE_IN || phase === PHASE.DRAW || phase === PHASE.OUT ? 1 : 0,
            y: phase === PHASE.RULE_IN ? 0 : 0,
            scale: 1,
          }}
          transition={{
            opacity: { duration: ruleInDur, ease: "easeOut" },
            y: { duration: ruleInDur, ease: "easeOut" },
            scale: { duration: ruleInDur, ease: "easeOut" },
          }}
          onAnimationComplete={() => {
            if (phase === PHASE.RULE_IN && !doneRef.current.rule) {
              doneRef.current.rule = true;
              setPhase(PHASE.DRAW);
            }
          }}
        />

     
        <motion.img
          src="/assets/crayon.png"
          alt=""
          className="absolute select-none pointer-events-none"
          draggable={false}
          style={{
            left: POS.regle.x + PENCIL_PADDING_LEFT,
            top: POS.crayon.y,
            width: POS.crayon.width,
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={
            phase === PHASE.DRAW
              ? {
                 
                  opacity: [0, 1, 1],
                  x: [0, 0, pencilTravel],
                }
              : phase === PHASE.OUT
              ? { opacity: 0 }
              : { opacity: 0 }
          }
          transition={
            phase === PHASE.DRAW
              ? {
                  opacity: { times: [0, 0.15, 1], duration: pencilDrawDur, ease: "easeOut" },
                  x: { times: [0, 0.15, 1], duration: pencilDrawDur, ease: "linear" },
                }
              : { opacity: { duration: outDur, ease: "easeInOut" } }
          }
          onAnimationComplete={() => {
            if (phase === PHASE.DRAW && !doneRef.current.draw) {
              doneRef.current.draw = true;
              setPhase(PHASE.OUT);
            }
          }}
        />

   
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === PHASE.OUT ? 0 : 1 }}
          transition={{ duration: outDur, ease: "easeInOut" }}
          onAnimationComplete={() => {
            if (phase === PHASE.OUT && !doneRef.current.out) {
              doneRef.current.out = true;
              setPhase(PHASE.BG2_IN);
            }
          }}
          style={{ pointerEvents: "none" }}
        />

        {phase === PHASE.LAYERS && (
          <>
            <motion.img
              src="/assets/haut.png"
              alt=""
              className="absolute select-none pointer-events-none"
              draggable={false}
              style={{
                left: POS.haut.x,
                top: POS.haut.y,
                width: POS.haut.width,
                height: "auto",
                willChange: "transform, opacity",
              }}
              initial={{ y: hautInitialY, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "anticipate", delay: 0.2 }}
              onAnimationComplete={fireFinalReady}
            />

            <motion.img
              src="/assets/bas.png"
              alt=""
              className="absolute select-none pointer-events-none"
              draggable={false}
              style={{
                left: POS.bas.x,
                top: POS.bas.y,
                width: POS.bas.width,
                willChange: "transform, opacity",
              }}
              initial={{ x: basInitialX, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "anticipate", delay: 0.0001 }}
              
            />
          </>
        )}
      </div>
    </section>
  );
}
