import { FlipWords } from "./FlipWords";
import { motion } from "motion/react";

const HeroText = ({ start = false }) => {
  const words = ["MODERNE", "DURABLE", "FIABLE"];

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="z-10  text-center md:mt-25 md:text-left rounded-3xl bg-clip-text">
      {/* Desktop View */}
      <div className="flex-col hidden md:flex c-space gap-2">
        <motion.h1
          className="text-4xl font-medium text-black"
          variants={variants}
          initial="hidden"
          animate={start ? "visible" : "hidden"}
          transition={{ delay: 0.8 }}
        >
          Salut, je suis Tanjona
        </motion.h1>

        <div className="flex flex-col items-start gap-2">
          <motion.p
            className="text-5xl font-medium text-black"
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1 }}
          >
            Technicien/Desinateur <br /> pour des projets
          </motion.p>

          <motion.div
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1.2 }}
          >
            <FlipWords words={words} className="font-sans font-black text-black text-8xl [transform:translateZ(0)] [-webkit-font-smoothing:antialiased]" />
          </motion.div>

          <motion.p
            className="text-4xl font-medium text-black"
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1.5 }}
          >
            Domaine du génie civil
          </motion.p>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col space-y-6 md:hidden">
        <motion.p
          className="text-4xl font-medium text-black"
          variants={variants}
          initial="hidden"
          animate={start ? "visible" : "hidden"}
          transition={{ delay: 0.8 }}
        >
          Salut, je suis Tanjona
        </motion.p>

        <div>
          <motion.p
            className="text-3xl font-black text-black"
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1 }}
          >
            Technicien/Desinateur <br /> pour des projets
          </motion.p>

          <motion.div
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1.2 }}
          >
            <FlipWords words={words} className="font-bold text-black text-6xl" />
          </motion.div>

          <motion.p
            className="text-3xl font-black text-black"
            variants={variants}
            initial="hidden"
            animate={start ? "visible" : "hidden"}
            transition={{ delay: 1.5 }}
          >
            Domaine du génie civil
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default HeroText;
