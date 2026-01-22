import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";
import { Globe } from "../components/globe";
import CopyEmailButton from "../components/CopyEmailButton";
import { Techno } from "../components/Techno";
import Carousel from "../components/Carousel";



function useScrollReveal(scrollYProgress, index, step = 5, span = 0.12) {
  
  const start = index * step;
  const end = start + span;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [26, 0]);
  const blur = useTransform(scrollYProgress, [start, end], [8, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return { opacity, y, filter };
}

const About = () => {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.2"],
  });

  const r0 = useScrollReveal(scrollYProgress, 0, 0.15, 0.12);
  const r1 = useScrollReveal(scrollYProgress, 1, 0.15, 0.12);
  const r2 = useScrollReveal(scrollYProgress, 2, 0.15, 0.12);
  const r3 = useScrollReveal(scrollYProgress, 3, 0.15, 0.12);
  const r4 = useScrollReveal(scrollYProgress, 4, 0.15, 0.08);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full min-h-[140vh] " 
    >                         
    <div className="mx-auto max-w-7xl px-6 section-spacing">
      <h2 className="text-heading">À propos de moi</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[18rem] mt-12">
        {/* 1 */}
        <motion.div
          style={r0}
          className="relative flex items-end overflow-hidden grid-default-color grid-1"
        >
          <img
            src="/assets/tanjona.png"
            alt="Tanjona"
            className="absolute inset-0 w-full h-full object-cover object-[70%_20%] scale-[1.2] md:scale-[1.35] lg:scale-[1.25]"
          />
          <div className="absolute inset-0 bg-black/15 max-sm:bg-black/45" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-black/80 via-black/50 to-transparent" />

          <div className="z-10">
            <p className="subtext ">Etudiant en génie civil et architecture, 
              je m’intéresse particulièrement à la conception architecturale ainsi qu’au bâtiment et aux travaux publics. 
              Mon parcours m’a permis de développer des compétences techniques et pratiques, de la conception à la modélisation numérique de projets, 
              notamment avec ArchiCAD et AutoCAD.
            </p>
          </div>
        </motion.div>

        {/* 2 */}
        <motion.div style={r1} className="grid-default-color  grid-2 p-0! overflow-hidden">
          <Carousel
            fill
            className="w-full h-full"
            autoplay
            autoplayDelay={3000}
            pauseOnHover
            loop
            items={[
              { id: 1, kind: "image", src: "/assets/logos/logo_tanjona.png", alt: "Logo de la startup" },
              { id: 2, kind: "text", title: "Vision & approche", text: 
                "TRUBUILD représente mon activité de technicien du bâtiment, orientée vers la conception architecturale, la modélisation 3D et l’optimisation de projets. Je transforme des idées en projets clairs, réalistes et durables, adaptés aux contraintes techniques, budgétaires et au contexte local." },
              { id: 3, kind: "text", title: "Services proposés", text: "L’accompagnement des projets de construction inclut la conception architecturale, l’élaboration de plans et la modélisation 3D, facilitant la compréhension et la prise de décision. J’interviens aussi sur les études techniques, l’adaptation des solutions constructives et l’optimisation des coûts, pour des projets de particuliers, d’ONG ou de collectivités." },
            ]}
          />
        </motion.div>

        {/* 3 */}
        <motion.div style={r2} className="relative grid-default-color grid-3 overflow-hidden">
          <div className="z-10 w-[50%]">
            <p className="headtext">Localisation</p>
            <p className="subtext">
              Basée à Madagascar, je suis ouvert aux opportunités en télétravail.
            </p>
          </div>

          <figure className="absolute left-[50%] top-[20%] w-60 md:w-90 aspect-square">
            <Globe className="w-full h-full" />
          </figure>

        </motion.div>

        {/* 4 */}
        <motion.div style={r3} className="grid-black-color grid-4">
          <div className="flex flex-col items-center justify-center gap-4 size-full">
            <p className="text-center headtext">Vous souhaitez démarrer un projet ensemble ?</p>
            <CopyEmailButton />
          </div>
        </motion.div>

        {/* 5 */}
        <motion.div style={r4} className="relative grid-black-color grid-5">
          <div className="z-10 w-[60%]">
            <p className="headtext">Mes Compétences Techniques</p>
            <p className="subtext">Génie civil & 3D : modélisation sur SketchUp, Autocad, ArchiCAD. <br /><br /></p>
            <p className="subtext">Bureautique : maîtrise du Pack MS Office (Excel, Word, PowerPoint) pour analyser et présenter efficacement.<br /><br /></p>
            <p className="subtext">Bonus : automatisations en Python + création de visuels sur Canva.</p>
          </div>
          <div className="absolute inset-y-0 md:inset-y-9 w-full h-full start-[50%] md:sclae-125">
            <Techno />
          </div>
        </motion.div>
      </div>  
    </div>
    </section>
  );
};

export default About;
