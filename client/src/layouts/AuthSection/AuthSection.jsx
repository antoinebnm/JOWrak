import { useState } from "react";
import { createPortal } from "react-dom";

import AuthPopup from "../../components/AuthPopup";
import Button from "../../components/Button";
import { useUser } from "../../contexts/UserContext";

import "./AuthSection.css";

function myAccount(element) {
  if (element.id == "accProfile") window.location.href = "/account/profile";
  if (element.id == "accSettings") window.location.href = "/account/settings";
}

function userProfil(user, logout) {
  return (
    <div id="accountMenu">
      <span id="userProfil">{JSON.parse(user).displayName}</span>
      <div className="dropdown-menu">
        <Button
          id="accProfile"
          label="Profile"
          className="btn"
          callback={(e) => myAccount(e.current)}
        />
        <Button
          id="accSettings"
          label="Settings"
          className="btn"
          callback={(e) => myAccount(e.current)}
        />
        <Button
          id="accLogout"
          label="Log out"
          className="btn"
          callback={logout}
        />
      </div>
    </div>
  );
}

export default function AuthSection() {
  const { user, login, logout } = useUser();
  const [popupType, setPopupType] = useState(null);

  return (
    <>
      {user ? (
        userProfil(user, logout)
      ) : (
        <div className="auth-buttons">
          <Button
            id="loginButton"
            label="Log in"
            className="btn"
            callback={() => setPopupType("login")}
          />
          <Button
            id="registerButton"
            label="Register"
            className="btn"
            callback={() => setPopupType("register")}
          />
        </div>
      )}

      {popupType &&
        createPortal(
          <AuthPopup
            type={popupType}
            onClose={() => setPopupType(null)}
            onLogin={(userData) => {
              login(userData);
              setPopupType(null);
            }}
          />,
          document.getElementById("root")
        )}
    </>
  );
}
