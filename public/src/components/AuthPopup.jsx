import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

import "../styles/AuthPopup.css";

export default function AuthPopup({ type, onClose }) {
  const popupRef = useRef(null);
  const [isRegisterPopup, setIsRegisterPopup] = useState(
    type.toUpperCase() == "REGISTER"
  );
  const [pwdView, setPwdView] = useState(false);

  function togglePwdSwitchView() {
    setPwdView(!pwdView);
  }

  function togglePopupType() {
    setIsRegisterPopup(!isRegisterPopup);
  }

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
          <Title text={(isRegisterPopup && "REGISTER") || "LOGIN"} size="h2" />
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
              required={isRegisterPopup}
              hidden={!isRegisterPopup}
            />
            <Input
              type={(pwdView && "text") || "password"}
              id="password"
              placeholder="Password"
              autoComplete="current-password"
              required
            />
            <Button
              label={(pwdView && "O") || "Ø"}
              id="pwdEye"
              className="pwdEye"
              callback={() => {
                window.addEventListener("click", (event) => {
                  event.preventDefault();
                });
                togglePwdSwitchView();
              }}
            />
            <Input
              type={(pwdView && "text") || "password"}
              id="confirmpwd"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required={isRegisterPopup}
              hidden={!isRegisterPopup}
            />
            <Input type="submit" className="btn" value="Submit" />
            <span id="switchAuth" onClick={() => togglePopupType()}>
              {(isRegisterPopup && "Click here to log in") ||
                "Click here to register"}
            </span>
          </form>
        </div>
      </div>
    </>
  );
}
