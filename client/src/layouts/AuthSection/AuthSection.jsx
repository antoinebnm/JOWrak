import { useState } from "react";
import { createPortal } from "react-dom";

import AuthPopup from "../../components/AuthPopup";
import Button from "../../components/Button";

import {
  getCookie,
  setCookie,
  deleteCookie,
} from "../../components/utils/cookieAgent";
import fetchData from "../../components/utils/fetchData";

import "./AuthSection.css";

function myAccount(element) {
  if (element.id == "accProfile") window.location.href = "/account?profile";
  if (element.id == "accSettings") window.location.href = "/account?settings";
}

function userProfil(user, handleLogout) {
  return (
    <div id="accountMenu">
      <span id="userProfil">{user.displayName}</span>
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
          callback={handleLogout}
        />
      </div>
    </div>
  );
}

export default function AuthSection() {
  const savedUser = getCookie("user");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [popupType, setPopupType] = useState(null);

  function handleButtonClick(type) {
    setPopupType(type);
  }

  function handleLogin(userData) {
    setUser(userData);
    setCookie("user", JSON.stringify(userData), [1, 0, 0, 0]);
    setPopupType(null);
  }

  function handleLogout() {
    fetchData("/api/auth/logout").then(() => {
      alert(
        "You are now disconnected.\nYou will be redirected to the home page."
      );
      deleteCookie("user");
      setUser(null);
      window.location.href = "/";
    });
  }

  return (
    <>
      {user ? (
        userProfil(user, handleLogout)
      ) : (
        <div className="auth-buttons">
          <Button
            id="loginButton"
            label="Log in"
            className="btn"
            callback={() => handleButtonClick("login")}
          />
          <Button
            id="registerButton"
            label="Register"
            className="btn"
            callback={() => handleButtonClick("register")}
          />
        </div>
      )}

      {popupType &&
        createPortal(
          <AuthPopup
            type={popupType}
            onClose={() => setPopupType(null)}
            onLogin={handleLogin}
          />,
          document.getElementById("root")
        )}
    </>
  );
}
