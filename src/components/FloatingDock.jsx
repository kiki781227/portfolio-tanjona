import { useMemo, useRef, useState, useEffect } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { twMerge } from "tailwind-merge";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";


function useActiveSection(hrefs, options = {}) {
  const {
    defaultHash = "#home",
    line = 0.35, 
    headerOffset = 0, 
    syncHash = true,
  } = options;

  const ids = useMemo(() => {
    const uniq = Array.from(new Set((hrefs || []).filter(Boolean)));
    return uniq
      .map((h) => (h.startsWith("#") ? h.slice(1) : h))
      .filter(Boolean);
  }, [hrefs]);

  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return defaultHash;
    return window.location.hash || defaultHash;
  });

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const topsRef = useRef([]);
  const rafRef = useRef(0);

  const computeTops = () => {
    topsRef.current = ids
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const top = window.scrollY + el.getBoundingClientRect().top;
        return { id, top };
      })
      .filter(Boolean)
      .sort((a, b) => a.top - b.top);
  };

  const pickActive = () => {
    const tops = topsRef.current;
    if (!tops.length) return defaultHash;

    const y = window.scrollY + window.innerHeight * line + headerOffset;

    let current = tops[0].id;
    for (let i = 0; i < tops.length; i++) {
      if (y >= tops[i].top) current = tops[i].id;
      else break;
    }

    return `#${current}`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!ids.length) return;

    const update = () => {
      const next = pickActive();
      if (next !== activeRef.current) {
        setActive(next);
        if (syncHash) window.history.replaceState(null, "", next);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = 0;
        update();
      });
    };

    const onResize = () => {
      computeTops();
      update();
    };

    // init
    computeTops();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const t = window.setTimeout(() => {
      computeTops();
      update();
    }, 300);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ids, defaultHash, line, headerOffset, syncHash]);

  return active;
}

export const FloatingDock = ({ items, desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({ items, className }) => {
  const [open, setOpen] = useState(false);

  const activeHref = useActiveSection(
    items?.map((i) => i.href),
    {
      defaultHash: "#home",
      line: 0.35,
      headerOffset: 0,
      syncHash: true,
    }
  );

  return (
    <div className={twMerge("relative block sm:hidden", className)}>
      <AnimatePresence>
        {open && (
          <LayoutGroup id="dock-mobile">
            <motion.div
              layoutId="nav"
              className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2 items-end"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {items.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: { delay: idx * 0.05 },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                >
                <a
                  href={item.href}
                  aria-label={item.title}
                  title={item.title}
                  onClick={() => setOpen(false)}
                  className={twMerge(
                    "relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-900 shadow-md",
                    "transition-all duration-300 ease-out", 
                    activeHref === item.href && "memphis-active" 
                  )}
                >
                  <div className="h-5 w-5">{item.icon}</div>
                </a>

                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800 shadow-lg"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }) => {
  const mouseX = useMotionValue(Infinity);
  const activeHref = useActiveSection(items?.map((i) => i.href), {
    defaultHash: "#home",
    line: 0.35,
    headerOffset: 0,
    syncHash: true,
  });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={twMerge(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 sm:flex dark:bg-neutral-900 shadow-lg",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer
          key={item.title}
          mouseX={mouseX}
          title={item.title}
          icon={item.icon}
          href={item.href}
          isActive={activeHref === item.href} 
        />
      ))}
    </motion.div>
  );
};


function IconContainer({ mouseX, title, icon, href, isActive }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <a href={href} aria-label={title} title={title}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={twMerge(
          "relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden"
        )}
      >
        {isActive && (
          <motion.span
            layoutId="dock-active-desktop"
            className="absolute inset-0 rounded-full memphis-active"
            transition={{ type: "spring", stiffness: 550, damping: 40 }}
          />
        )}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-9 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white z-20"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={twMerge(
            "relative z-10 flex items-center justify-center transition-colors duration-200",
            isActive ? "text-white" : "text-neutral-600 dark:text-neutral-300"
          )}
        >
          {icon}
        </motion.div>

      </motion.div>
    </a>
  );
}
