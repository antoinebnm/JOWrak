import { useEffect, useRef } from "react";

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

import "../styles/AuthPopup.css";

export default function AuthPopup({ type, onClose }) {
  const popupRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      <div id="authPopup" className="popup">
        <span id="close-btn">&times;</span>
        <div className="popup-content" ref={popupRef}>
          <Title text={type.toUpperCase()} size="h2" />
          <form id="authForm">
            <Input
              type="text"
              id="username"
              placeholder="Login"
              autoComplete="username"
              required
            />
            <Input
              type="text"
              id="displayname"
              placeholder="Username"
              autoComplete="username"
              hidden
            />
            <Input
              type="password"
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            <Button
              label="Ø"
              id="pwdEye"
              className="pwdEye"
              callback={() => {
                //TODO: show pwd
              }}
            />
            <Input
              type="password"
              id="confirmpwd"
              placeholder="Confirm Password"
              autoComplete="new-password"
              hidden
            />
            <Input type="submit" className="btn" value="Submit" />
            <span id="switchAuth"></span>
          </form>
        </div>
      </div>
    </>
  );
}
