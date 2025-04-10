import { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useTheme } from "../../contexts/ThemeContext";
import themeButton from "../../assets/icons8-themeIcon.json"; // your downloaded file

import AuthSection from "../AuthSection";
import Title from "../../components/Title";
import Image from "../../components/Image";

import "./Header.css";

import homeLogo from "../../assets/house_icon.png";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [dotLottie, setDotLottie] = useState(null);

  const dotLottieRefCallback = (dotLottie) => {
    setDotLottie(dotLottie);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    dotLottie.play();
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
      <section>
        <div
          onClick={handleThemeToggle}
          style={{
            width: 50,
            height: 50,
            filter: "invert(100%)",
            cursor: "pointer",
          }}
        >
          <DotLottieReact
            dotLottieRefCallback={dotLottieRefCallback}
            data={themeButton}
            segment={theme == "dark" ? [0, 14] : [14, 28]}
          />
        </div>
        <p>Current theme: {theme}</p>
      </section>
      <AuthSection />
    </header>
  );
}
