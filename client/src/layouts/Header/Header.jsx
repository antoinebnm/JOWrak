import AuthUserSection from "../AuthSection";
import Title from "../../components/Title";
import Image from "../../components/Image";

import "./Header.css";

import homeLogo from "../../assets/house_icon.png";

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
