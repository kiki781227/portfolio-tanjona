import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CopyDoneUrl from "/assets/copy-done.svg";


const CopyEmailButton = () => {
  const [copied, setCopied] = useState(false);
  const email = "tanjonarabenarivo10@gmail.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const variants = {
    normal: {
      y: 0,
      scale: 1,
    },
    memphis: {
      y: -2,
      scale: 1.02,
    },
  };

  return (
    <motion.button
      onClick={copyToClipboard}
      variants={variants}
      animate={copied ? "memphis" : "normal"}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 1.05 }}
      className={[
        "relative px-1 py-4 text-sm text-center rounded-full font-extralight w-48 overflow-hidden",
        !copied && "bg-primary text-white",
        copied &&
          "  text-black memphis-outline border-[3px] border-black shadow-[8px_8px_0_0_#000] rounded-2xl bg-white",
      ].join(" ")}
    >


      <AnimatePresence mode="wait">
        {copied ? (
          <motion.p
            className="flex items-center justify-center gap-2 font-semibold"
            key="copied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.12, ease: "easeInOut" }}
          >
            <img
              src={CopyDoneUrl}
              className="w-5 filter-[brightness(0)_saturate(100%)]"
              alt="copy Icon"
            />
            Email copié
          </motion.p>
        ) : (
          <motion.p
            className="flex items-center justify-center gap-2"
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src="assets/copy.svg" className="w-5" alt="copy icon" />
            Copier Adresse Email
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyEmailButton;
