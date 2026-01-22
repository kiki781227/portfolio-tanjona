import { useState } from "react";
import Project from "../components/Project";
import { myProjects } from "../constants";
import { Particles } from "../components/Particles";
import { motion, useMotionValue, useSpring } from "motion/react";

const Projects = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 10, stiffness: 50 });
  const springY = useSpring(y, { damping: 10, stiffness: 50 });

  const [preview, setPreview] = useState(null);

  const handlePointerMove = (e) => {
    x.set(e.clientX + 20);
    y.set(e.clientY + 20);
  };

  return (
    <section
      id="project"
      className="relative w-full"
      onPointerMove={handlePointerMove}
    >
      <Particles className="absolute inset-0 -z-50" quantity={100} ease={80} color="#ffffff" refresh />

      <div className="mx-auto max-w-7xl px-6 section-spacing bg">
        <h2 className="text-heading">Mes Meilleurs Projets</h2>
        <div className="bg-linear-to-r from-transparent via-white to-black mt-12 h-px w-full" />

        {myProjects.map((project) => (
          <Project key={project.id} {...project} setPreview={setPreview} />
        ))}

        {preview && (
          <motion.img
            className="fixed top-0 left-0 z-50 hidden md:block object-cover h-56 w-80 rounded-lg shadow-lg pointer-events-none"
            src={preview}
            style={{ x: springX, y: springY }}
          />
        )}

      </div>
    </section>
  );
};

export default Projects;
