import { useRef } from "react";
import Lottie from "lottie-react";
import { useTheme } from "../../contexts/ThemeContext";
import themeButton from "../../assets/icons8-themeIcon.json"; // your downloaded file

import AuthSection from "../AuthSection";
import Title from "../../components/Title";
import Image from "../../components/Image";

import "./Header.css";

import homeLogo from "../../assets/house_icon.png";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const lottieRef = useRef();

  const handleThemeToggle = () => {
    toggleTheme();
    if (lottieRef.current) {
      lottieRef.current.setDirection(theme === "light" ? -1 : -1); // Reverse if light → dark, else play forward
      lottieRef.current.play();
    }
  };

  return (
    <header className="banner">
      <Image
        id="homeButton"
        src={homeLogo}
        height="64"
        alt="Home logo"
        callback={() => {
          window.location.href = "/";
        }}
      />
      <Title text="JOW Games - JOWrak" size="h2" />
      <section id="themeSection" onClick={handleThemeToggle}>
        <Lottie
          lottieRef={lottieRef}
          animationData={themeButton}
          autoplay={false}
          loop={false}
          initialSegment={theme === "light" ? [0, 14] : [14, 28]}
          style={{ filter: "invert(100%)", width: "50px", height: "50px" }}
        />
        {/*<p>Current theme: {theme}</p>*/}
      </section>
      <AuthSection />
    </header>
  );
}
