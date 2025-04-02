import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import Button from "./Button";
import Input from "./Input";
import Title from "./Title";

import "../styles/AuthPopup.css";

export default function AuthPopup({ type, onClose, onLogin }) {
  const popupRef = useRef(null);
  const [isRegisterPopup, setIsRegisterPopup] = useState(
    type.toUpperCase() == "REGISTER"
  );
  const [pwdView, setPwdView] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    displayname: "",
    password: "",
    confirmpwd: "",
  });
  const [errors, setErrors] = useState({});

  function togglePwdSwitchView() {
    setPwdView(!pwdView);
  }

  function togglePopupType() {
    setIsRegisterPopup(!isRegisterPopup);
  }

  function handleInputChange(event) {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  }

  function Submit() {
    const status = useFormStatus();
    return (
      <Input
        type="submit"
        className="btn"
        value="Submit"
        disabled={status.pending}
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({}); // Clear previous errors
    const action = isRegisterPopup ? "register" : "login";

    try {
      let headers = {};
      if (isRegisterPopup) {
        if (formData.password !== formData.confirmpwd) {
          throw new Error(
            "Passwords must be the same (password confirmation is different)"
          );
        }

        headers = {
          Login: formData.username,
          Password: formData.password,
          DisplayName: formData.displayname,
        };
      } else {
        headers = {
          Login: formData.username,
          Password: formData.password,
        };
      }

      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
      });

      const data = await response.json();
      if (data?.message === "Response status: 401") {
        throw new Error("Invalid credentials!");
      } else if (data?.message === "Response status: 500") {
        alert("A user with this name already exists!");
        throw new Error("Unique user login required!");
      }

      if (data?.user) {
        onLogin(data.user);

        setFormData({
          username: "",
          displayname: "",
          password: "",
          confirmpwd: "",
        });

        onClose();

        // Handle game saving if applicable
        // const gameDetails = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)gameDetails\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        // if (gameDetails) {
        //   gameDetails["playedBy"] = data.user.userId;
        //   await saveGame(gameDetails);
        //   document.cookie = "gameDetails=; path=/; max-age=0"; // Clear gameDetails cookie
        //   alert("Successfully saved the game");
        // }
      }
    } catch (error) {
      const newErrors = {};
      if (error.message.startsWith("Passwords")) {
        newErrors.confirmpwd = "Passwords do not match";
      }
      if (error.message.startsWith("Invalid")) {
        newErrors.username = "Invalid credentials";
        newErrors.password = "Invalid credentials";
      }
      setErrors(newErrors);
    }
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
          <form id="authForm" onSubmit={handleSubmit}>
            <Input
              type="text"
              id="username"
              placeholder="Login"
              autoComplete="username"
              required
              value={formData.username}
              onChange={(e) => handleInputChange(e)}
              className={errors.username ? "wrong" : ""}
            />
            {isRegisterPopup && (
              <Input
                type="text"
                id="displayname"
                placeholder="Username"
                autoComplete="username"
                required
                value={formData.displayname}
                onChange={(e) => handleInputChange(e)}
              />
            )}
            <Input
              type={(pwdView && "text") || "password"}
              id="password"
              placeholder="Password"
              autoComplete={
                (isRegisterPopup && "new-password") || "current-password"
              }
              required
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              className={errors.password ? "wrong" : ""}
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
            {isRegisterPopup && (
              <Input
                type={pwdView ? "text" : "password"}
                id="confirmpwd"
                placeholder="Confirm Password"
                autoComplete="new-password"
                required
                value={formData.confirmpwd}
                onChange={(e) => handleInputChange(e)}
                className={errors.confirmpwd ? "wrong" : ""}
              />
            )}
            <Submit />
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
