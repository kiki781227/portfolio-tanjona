import { useEffect, useState } from "react";
import { OrbitingCircles } from "./OrbitingCircles";

export function Techno() {
  const skills = ["autocad", "archicad", "sketchup", "python", "excel", "word", "powerpoint"];

  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)"); 
    const update = () => setIsMd(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const outerIcon = isMd ? 40 : 34;
  const innerIcon = isMd ? 28 : 24;
  const radius = isMd ? 100 : 84;

  return (
    <div className="relative flex h-60 w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={outerIcon}>
        {skills.map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} sizeClass={isMd ? "w-10 h-10" : "w-9 h-9"} />
        ))}
      </OrbitingCircles>

      <OrbitingCircles iconSize={innerIcon} radius={radius} reverse speed={2}>
        {[...skills].reverse().map((skill, index) => (
          <Icon key={index} src={`assets/logos/${skill}.png`} sizeClass={isMd ? "w-7 h-7" : "w-6 h-6"} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src, sizeClass }) => (
  <img
    src={src}
    className={`rounded-sm transition-transform duration-200 hover:scale-110 ${sizeClass}`}
    alt=""
    draggable={false}
  />
);
