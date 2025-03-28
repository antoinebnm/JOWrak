import AuthUserSection from "./AuthUserSection";
import Title from "./Title";
import Image from "./Image";

import "../styles/Header.css";

import homeLogo from "../assets/house_icon.png";

export default function Header() {
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
      <AuthUserSection />
    </header>
  );
}
