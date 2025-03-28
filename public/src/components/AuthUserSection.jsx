import { useState } from "react";
import { createPortal } from "react-dom";

import AuthPopup from "./AuthPopup";
import Button from "./Button";

import { getCookie, deleteCookie } from "./utils/cookieAgent";
import fetchData from "./utils/fetchData";

import "../styles/AuthUserSection.css";

function isLoggedIn(user) {
  return !!user;
}

function myAccount(element) {
  if (element.id == "accProfile") window.location.href = "/account?profile";
  if (element.id == "accSettings") window.location.href = "/account?settings";
}

function userProfil(user) {
  return (
    <div id="accountMenu">
      <span id="userProfil">{JSON.parse(user).displayName}</span>
      <div className="dropdown-menu">
        <Button
          id="accProfile"
          label="Profile"
          className="btn"
          callback={(e) => {
            myAccount(e.current);
          }}
        />
        <Button
          id="accSettings"
          label="Settings"
          className="btn"
          callback={(e) => {
            myAccount(e.current);
          }}
        />
        <Button
          id="accLogout"
          label="Log out"
          className="btn"
          callback={() => {
            fetchData("/api/auth/logout").then(() => {
              alert(
                "You are now disconnected.\nYou will be redirect to the home page."
              );
              window.location.href = "/";
            });
          }}
        />
      </div>
    </div>
  );
}

export default function AuthUserSection() {
  const user = getCookie("user") || null;
  const [popupType, setPopupType] = useState(null);

  function handleButtonClick(type) {
    setPopupType(type);
  }

  function authButtons() {
    return (
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
    );
  }

  try {
    if (isLoggedIn(user)) {
      return userProfil(user);
    } else {
      return (
        <>
          {authButtons()}
          {popupType &&
            createPortal(
              <AuthPopup type={popupType} onClose={() => setPopupType(null)} />,
              document.getElementById("root")
            )}
        </>
      );
    }
  } catch (error) {
    console.error(error);
    deleteCookie("sid");
    deleteCookie("user");
    deleteCookie("gameDetails");
    window.location.reload();
  }
}
