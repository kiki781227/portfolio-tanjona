import { useMemo } from "react";
import { FloatingDock } from "../components/FloatingDock"; // <-- (voir fichier juste en dessous)

const Navbar = () => {
  const IconImg = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-full w-full object-contain invert" />
 )
  const items = useMemo(
    () => [
      { title: "Acceuil", href: "#home", icon: <IconImg  src={"/assets/logos/home.svg"} alt={"Acceuil"}/> },
      { title: "À propos", href: "#about", icon: <IconImg  src={"/assets/logos/about.svg"} alt={"À propos"}/> },
      { title: "Projets", href: "#project", icon: <IconImg src={"/assets/logos/projects.svg"} alt={"Projets"}/> },
      { title: "Expériences", href: "#experience", icon: <IconImg src={"/assets/logos/work.svg"} alt={"Expériences"}/> },
      { title: "Contact", href: "#contact", icon: <IconImg src={"/assets/logos/contact.svg"} alt={"Contact"}/> },
    ],
    []
  );

  return (
    <>
      <FloatingDock
        items={items}
        desktopClassName="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-12 right-6 z-50"
      />
    </>
  );
};

export default Navbar;
