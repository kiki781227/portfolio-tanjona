import { twMerge } from "tailwind-merge";

const PaperCard = ({
  href,
  paper,
  icon,
  title,
  subtitle,
  appear,
  delayMs = 0,
  tweak = "",
  memphisOn = false,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    style={{ transitionDelay: memphisOn ? `${delayMs}ms` : "0ms" }}
    className={twMerge(
      "group relative h-65 w-80 select-none scale-12",
      "transition-all duration-500 ease-out will-change-transform",
      appear,
      tweak
    )}
  >
    {/* Paper bg */}
    <img
      src={paper}
      alt=""
      className={twMerge(
        "absolute inset-0 h-full w-full object-cover pointer-events-none",
        "transition-transform duration-500 ease-out",
        "group-hover:scale-[1.05]"
      )}
      draggable={false}
    />

    {/* Content + hover 3D */}
    <div
      className={twMerge(
        "relative z-10 flex h-full w-full items-center justify-center gap-3 px-5",
        "perspective-[900px",
        "transition-transform duration-300 ease-out",
        "group-hover:transform-[translateY(-4px)_rotateX(10deg)_rotateY(-12deg)]"
      )}
    >
      <img
        src={icon}
        alt={title}
        className={twMerge(
          "h-17 w-17 pointer-events-none bold",
          "transition-transform duration-300 group-hover:scale-110",
          "filter-[drop-shadow(0_8px_12px_rgba(0,0,0,0.22))]"
        )}
        draggable={false}
      />

      <div className="flex flex-col leading-none">
        <span className="text-2 font-extrabold text-[#000001]">{title}</span>
      </div>
    </div>

    {/* Hover shadow */}
    <div
      className={twMerge(
        "pointer-events-none absolute inset-0 rounded-xl",
        "transition-shadow duration-300",
        "group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
      )}
    />
  </a>
);

export default PaperCard;
