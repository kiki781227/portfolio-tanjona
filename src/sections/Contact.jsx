import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Alert from "../components/Alert";
import { twMerge } from "tailwind-merge";

import PaperCard from "../components/PaperCard";
import ArrowLottie from "../components/ArrowLottie";
import { paperContacts, github } from "../constants";



import arrowAnim from "../assets/arrow.json";

const MEMPHIS_DELAY_MS = 200;

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const [memphisOn, setMemphisOn] = useState(false);
  const timerRef = useRef(null);
  const cardRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await emailjs.send(
        "service_pi8pvl8",
        "template_ogt2kxc",
        {
          from_name: formData.name,
          to_name: "Tanjona",
          from_email: formData.email,
          to_email: "tanjonarabenarivo10@gmail.com",
          message: formData.message,
        },
        "hOQ6Y1ZEjZNk6tBVV"
      );

      setIsLoading(false);
      setFormData({ name: "", email: "", message: "" });
      showAlertMessage("Succès", "Votre message a été envoyé !");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      showAlertMessage("Echec", "Un problème est survenu !");
    }
  };

  const startMemphisTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => {
      setMemphisOn(true);
      timerRef.current = null;
    }, MEMPHIS_DELAY_MS);
  };

  const stopMemphisTimerAndReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMemphisOn(false);
  };

  const handleSectionLeave = () => {
    if (cardRef.current?.contains(document.activeElement)) return;
    stopMemphisTimerAndReset();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);


  return (
    <section
      id="contact"
      className="relative flex items-center w-full overflow-x-hidden"
      onPointerEnter={startMemphisTimer}
      onPointerLeave={handleSectionLeave}
      onFocusCapture={startMemphisTimer}
      onTouchStart={startMemphisTimer}
    >
      <div className="mx-auto w-full max-w-7xl px-6 section-spacing lg:pl-20">

        {showAlert && <Alert type={alertType} text={alertMessage} />}

        <div className="grid items-center gap-10 lg:grid-cols-[260px_minmax(0,1fr)_340px] lg:gap-12">
          {/* ================= LEFT CONTACTS (desktop) ================= */}
          <div className="hidden lg:flex flex-col items-start gap-4">
            {paperContacts.map((c, i) => (
              <PaperCard
                key={c.label}
                href={c.href}
                paper={c.paper}
                icon={c.icon}
                title={c.label}
                appear={memphisOn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
                delayMs={i * 140}
                tweak={c.tweak}
              />
            ))}
          </div>

          {/* ================= FORM (center) ================= */}
          <div
            ref={cardRef}
            className={twMerge(
              "relative mx-auto w-full max-w-md p-6 rounded-2xl overflow-visible",
              "bg-[#000001]"
            )}
          >
            <div
              className={twMerge(
                "memphis-overlay opacity-0 blur-[0.6px] transition-all ease-out",
                memphisOn ? "opacity-100 blur-0 duration-500" : "duration-200"
              )}
            />

            <div className="relative z-10">
              <div className="flex flex-col items-start w-full gap-3 mb-8">
                <h2 className={twMerge("text-2xl font-black", memphisOn ? "text-[#000001]" : "text-white")}>
                  Discutons de votre projet
                </h2>
                <p className={twMerge("text-sm font-medium", memphisOn ? "text-[#000001]/70" : "text-neutral-400")}>
                  Je suis ouvert aux missions indépendantes ainsi qu’aux opportunités professionnelles en entreprise.
                  Contactez-moi pour échanger sur un projet, un poste ou une collaboration.
                </p>
              </div>

              <form className="w-full space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className={twMerge(memphisOn ? "memphis-label" : "feild-label")}>
                    Nom Complet
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={twMerge(memphisOn ? "memphis-input mt-2" : "field-input field-input-focus")}
                    placeholder="Rabenarivo Tanjona"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={twMerge(memphisOn ? "memphis-label" : "feild-label")}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={twMerge(memphisOn ? "memphis-input mt-2" : "field-input field-input-focus")}
                    placeholder="tanjonarabenarivo10@gmail.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className={twMerge(memphisOn ? "memphis-label" : "feild-label")}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className={twMerge(memphisOn ? "memphis-input mt-2 resize-none" : "field-input field-input-focus")}
                    placeholder="Votre message..."
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={twMerge(
                    "w-full px-4 py-3 text-lg",
                    memphisOn ? "memphis-btn" : "rounded-md bg-[#D9A67B]"
                  )}
                >
                  {!isLoading ? "Send" : "Sending..."}
                </button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT GITHUB (desktop) ================= */}
          <div className="hidden lg:flex flex-col items-end gap-4">
            {/* Text + Lottie */}
            <div
              style={{ transitionDelay: memphisOn ? "420ms" : "0ms" }}
              className={twMerge(
                "flex items-center gap-3 transition-all duration-500 ease-out",
                memphisOn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              )}
            >
              <div className="text-right translate-y-60">
                <p className={twMerge("text-25 font-extrabold", memphisOn ? "text-[#ffffff]" : "text-black")}>
                  Voir tous mes projets
                </p>
                <p className={twMerge("text-xs font-semibold", memphisOn ? "text-white" : "text-white/40")}>
                  Sur GitHub
                </p>
              </div>

              <div className="relative scale-y-[-1]  rotate-170 top-40 right-10 h-17.5 w-37.5 -mr-3">
                <ArrowLottie animationData={arrowAnim} loop autoplay />
              </div>
            </div>

            {/* Card GitHub*/}
            <PaperCard
              href={github.href}
              paper={github.paper}
              icon={github.icon}
              title="GitHub"
              appear={memphisOn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
              delayMs={620}
              tweak={github.tweak}
            />
          </div>

          {/* ================= MOBILE (under form) ================= */}
          <div className="lg:hidden">
            <div className="mt-6 flex flex-wrap justify-center gap-3 pb-2">
              {paperContacts.map((c, i) => (
                <PaperCard
                  key={c.label}
                  href={c.href}
                  paper={c.paper}
                  icon={c.icon}
                  title={c.label}
                  appear={"opacity-100 translate-x-0" }
                  delayMs={i * 120}
                  tweak={twMerge(c.tweak, 
                    "shrink-0",
                  "w-[min(20rem,92vw)] max-w-full translate-x-0 translate-y-0 rotate-0 scale-90")}
                />
              ))}
            </div>

            <div className="mt-3">
              <PaperCard
                href={github.href}
                paper={github.paper}
                icon={github.icon}
                title="GitHub"
                appear={"opacity-100 translate-x-0" }
                delayMs={560}
                tweak={twMerge(github.tweak, "w-[min(20rem,92vw)] max-w-full translate-x-0 translate-y-0 rotate-0 scale-60")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
