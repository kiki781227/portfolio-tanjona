import { useEffect } from "react";
import { motion } from "motion/react";

const ProjectDetails = ({
  title,
  description,
  subDescription,
  image,
  tags,
  href,
  closeModal,
}) => {
  // bloque le scroll derrière, mais on garde le scroll dans le modal
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 w-full h-full
                 overflow-y-auto overscroll-contain
                 p-4 md:p-8
                 backdrop-blur-sm bg-black/40
                 flex justify-center items-start md:items-center"
      role="dialog"
      aria-modal="true"
      onClick={closeModal}
    >
      <motion.div
        className="relative w-full max-w-2xl
                   max-h-[calc(100svh-2rem)] md:max-h-[calc(100svh-4rem)]
                   rounded-2xl bg-[#111111] shadow-lg
                   overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 p-2 rounded-md bg-midnight/80 hover:bg-gray-500"
          aria-label="Fermer"
        >
          <img src="assets/close.svg" className="w-6 h-6" alt="" />
        </button>

        {/* Image (limit height so content can scroll) */}
        <img
          src={image}
          alt={title}
          className="w-full shrink-0 rounded-t-2xl
                     max-h-[42svh] md:max-h-[46svh]
                     object-cover"
          loading="lazy"
        />

        {/* ✅ IMPORTANT : flex-1 + min-h-0 = scroll works */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <h5 className="mb-2 text-2xl font-bold text-neutral-300">{title}</h5>

          <p className="mb-3 font-normal text-neutral-300">{description}</p>

          {subDescription?.map((subDesc, index) => (
            <p key={index} className="mb-3 font-normal text-neutral-200">
              {subDesc}
            </p>
          ))}

          <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              {tags?.map((tag) => (
                <img
                  key={tag.id}
                  src={tag.path}
                  alt={tag.name}
                  className="rounded-lg size-10 hover-animation"
                  loading="lazy"
                />
              ))}
            </div>

            <a
              className="inline-flex items-center gap-1 font-medium cursor-pointer hover-animation text-neutral-200"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir Projet Complet
              <img src="assets/arrow-up.svg" className="size-4" alt="" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
