import { Timeline } from "../components/Timeline";
import { experiences } from "../constants";
import { Particles } from "../components/Particles";

const Experiences = () => {
  return (
    <section
      id="experience"
      className="relative isolate w-full overflow-hidden"
    >
      <Particles
        className="absolute inset-0 z-0"
        quantity={200}
        ease={80}
        color="#ffffff"
        refresh
      />

      <div className="relative z-20 mx-auto max-w-7xl px-6 section-spacing">
        <Timeline data={experiences} />
      </div>
    </section>
  );
};

export default Experiences;
