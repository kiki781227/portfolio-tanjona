import React, { useState, lazy, Suspense, useCallback } from "react";
import HeroText from "../components/HeroText";
import ParallaxBackground from "../components/ParallaxBackground";

const Avatar1 = lazy(() => import("../components/Avatar1"));

export const Hero = () => {
  const [bgReady, setBgReady] = useState(false);

  const handleBgReady = useCallback(() => {
    setBgReady(true);
  }, []);

  return (
    <section
      id="home"
      className="flex items-start justify-center min-h-screen overflow-hidden md:items-start md:justify-start w-full  "
    >
      <div className="mx-auto max-w-7xl px-6 section-spacing">
        <ParallaxBackground onReady={handleBgReady} />

        <figure
          className={`absolute inset-0 z-1 transition-opacity duration-600 ${
            bgReady ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Suspense fallback={null}>
            <Avatar1 />
          </Suspense>
        </figure>

        <div className="relative z-10 h-full w-full flex items-start   lg:mr-100">

          <div className="w-full ">
            <HeroText start={bgReady} />
          </div>
        </div>  
      </div>

    </section>
  );
};

export default Hero;
