import Button from "./Button";

import { getCookie } from "./utils/cookieAgent";
import fetchData from "./utils/fetchData";

import "../styles/AuthUserSection.css";

function isLoggedIn(user) {
  if (user) return true;
  else return false;
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

function authButtons() {
  return (
    <div className="auth-buttons">
      <Button
        id="loginButton"
        label="Log in"
        className="btn"
        handleClick={() => {}}
      />
      <Button
        id="registerButton"
        label="Register"
        className="btn"
        handleClick={() => {}}
      />
    </div>
  );
}

export default function AuthUserSection() {
  const user = getCookie("user") || null;

  if (isLoggedIn(user)) {
    return userProfil(user);
  } else {
    return authButtons();
  }
}
