import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";


const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, [ref]);

  return size;
}

function CarouselItem({ item, index, itemWidth, round, trackItemOffset, x, transition }) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  const kind = item?.kind ?? "text";

  return (
    <motion.div
      className={[
        "shrink-0 h-full",
        "bg-black border-2 border-white",
        round ? "rounded-full" : "rounded-2xl",
        "p-4 flex items-center justify-center",
        "shadow-[-10px_10px_0px_rgba(255,255,255,1)]",
      ].join(" ")}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && { borderRadius: "50%" }),
      }}
      transition={transition}
    >
      {kind === "image" ? (
        <div className={`relative w-full h-full overflow-hidden ${round ? "rounded-full" : "rounded-2xl"}`}>
          <img
            src={item?.src}
            alt={item?.alt ?? "logo"}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-2">
          {item?.title ? (
            <p className="text-white font-semibold text-xl leading-tight">{item.title}</p>
          ) : null}
          <p className="text-white/75 text-sm leading-relaxed mt-2">{item?.text ?? ""}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function Carousel({
  items = [],
  fill = false,              
  baseWidth = 340,           
  autoplay = true,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  round = false,
  showArrows = true,
  className = "",
}) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const containerRef = useRef(null);
  const { width: measuredWidth, height: measuredHeight } = useElementSize(containerRef);

  const containerWidth = fill ? Math.max(0, measuredWidth) : baseWidth;

  const containerPadding = 16;
  const itemWidth = Math.max(0, containerWidth - containerPadding * 2);
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) return safeItems;
    if (safeItems.length === 0) return [];
    return [safeItems[safeItems.length - 1], ...safeItems, safeItems[0]];
  }, [safeItems, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [safeItems.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return undefined;
    if (pauseOnHover && isHovered) return undefined;

    const timer = window.setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);

    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelay, pauseOnHover, isHovered, itemsForRender.length]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }

    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = safeItems.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_, info) => {
    const { offset, velocity } = info;

    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
        ? -1
        : 0;

    if (direction === 0) return;

    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const activeIndex =
    safeItems.length === 0
      ? 0
      : loop
      ? (position - 1 + safeItems.length) % safeItems.length
      : Math.min(position, safeItems.length - 1);

  const canControl = itemsForRender.length > 1 && !isAnimating;

  const goPrev = useCallback(() => {
    if (!canControl) return;
    setPosition((p) => Math.max(0, p - 1));
  }, [canControl]);

  const goNext = useCallback(() => {
    if (!canControl) return;
    setPosition((p) => Math.min(itemsForRender.length - 1, p + 1));
  }, [canControl, itemsForRender.length]);


  const containerStyle = fill
    ? { width: "100%", height: "100%" }
    : { width: `${baseWidth}px`, ...(round ? { height: `${baseWidth}px`, borderRadius: "50%" } : {}) };

  return (
    <div
      ref={containerRef}
      className={[
        "relative overflow-hidden select-none",
        round ? "rounded-full" : "rounded-2xl",
        "w-full h-full",
        className,
      ].join(" ")}
      style={containerStyle}
      onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
      role="region"
      aria-label="Carousel"
    >
      {/* Track */}
      <motion.div
        className="flex items-stretch h-full"
        drag={canControl ? "x" : false}
        {...dragProps}
        style={{
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
          padding: containerPadding,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item?.id ?? index}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* Arrows */}
      {showArrows && safeItems.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white grid place-items-center"
            aria-label="Previous slide"
            disabled={!canControl}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white grid place-items-center"
            aria-label="Next slide"
            disabled={!canControl}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {safeItems.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {safeItems.map((_, index) => (
            <motion.button
              key={index}
              type="button"
              className={`h-2 w-2 rounded-full ${
                activeIndex === index ? "bg-white" : "bg-white/30"
              }`}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
              aria-label={`Go to slide ${index + 1}`}
              disabled={!canControl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
