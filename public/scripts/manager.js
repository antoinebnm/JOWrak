// Sélection des éléments du DOM
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const closeBtn = document.querySelector(".close-btn");

const authButtons = document.querySelector(".auth-buttons");
const authPopup = document.getElementById("authPopup");
const authTitle = document.getElementById("authTitle");
const authForm = document.getElementById("authForm");

const accountMenu = document.getElementById("accountMenu");
const userProfil = document.getElementById("userProfil");
const switchAuth = document.getElementById("switchAuth");

const accLogout = document.getElementById("accLogout");

const pwdEye = document.getElementById("pwdEye");

const fields = {
  usernameField: document.getElementById("username"),
  displaynameField: document.getElementById("displayname"),
  passwordField: document.getElementById("password"),
  confirmpwdField: document.getElementById("confirmpwd"),
};

async function preload() {
  try {
    const sid = getCookie("sid") || null;
    if (sid) {
      const data = await fetchData("/api/auth/session", undefined, undefined, {
        Cookie: sid,
      });
      if (data?.name == "Error") {
        throw new Error(
          "preload error, surely due to a server restart (=> erased memory sessions, need to clear cookies)"
        );
      }
      toggleUserProfil(data.displayName);
    } else {
      toggleAuthButtons();
    }
  } catch (error) {
    console.log(error);
    eraseCookie("sid");
    eraseCookie("user");
    window.location.reload();
  }
}

preload();

function clearFields(array) {
  array.forEach((element) => {
    element.value = "";
  });
}

function switchFields(array, hide = true) {
  array.forEach((element) => {
    element.required = !hide;
    element.hidden = hide;
  });
}

function toggleUserProfil(name) {
  authButtons.hidden = true;
  accountMenu.style.display = "flex";

  userProfil.textContent = name;
}

function toggleAuthButtons() {
  authButtons.hidden = false;
  accountMenu.style.display = "none";
}

// Fonction pour ouvrir le popup
function openPopup(type) {
  if (type == "register") {
    switchFields([fields.displaynameField, fields.confirmpwdField], false);

    switchAuth.innerHTML = `Already have an account ?</br>
  > Log in here instead <`;
    switchAuth.addEventListener("click", () => openPopup("login"));
  } else {
    switchFields([fields.displaynameField, fields.confirmpwdField], true);

    switchAuth.innerHTML = `First time here ?</br>
  > Register for free <`;
    switchAuth.addEventListener("click", () => openPopup("register"));
  }
  authPopup.style.display = "flex";
  authTitle.textContent = type === "login" ? "Login" : "Register";
}

// Fonction pour fermer le popup
function closePopup() {
  authPopup.style.display = "none";
}

function togglePwdVisibility() {
  if (PwdVisibility) {
    PwdVisibility = false;
    pwdEye.textContent = "Ø";
    fields.passwordField["type"] = "password";
    fields.confirmpwdField["type"] = "password";
  } else {
    PwdVisibility = true;
    pwdEye.textContent = "O";
    fields.passwordField["type"] = "text";
    fields.confirmpwdField["type"] = "text";
  }
}

// Événements pour ouvrir et fermer le popup
loginButton.addEventListener("click", () => openPopup("login"));
registerButton.addEventListener("click", () => openPopup("register"));
closeBtn.addEventListener("click", closePopup);

let PwdVisibility = false;
pwdEye.addEventListener("click", () => togglePwdVisibility());

accLogout.addEventListener("click", () => {
  fetchData("/api/auth/logout").then(() => {
    window.location.reload();
  });
});

// Fermer le popup si on clique en dehors du contenu
window.addEventListener("click", (event) => {
  if (event.target === authPopup) {
    closePopup();
  }
});

// Soumission du formulaire d'authentification
authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Ajouter la logique de connexion/inscription ici
  const action = authTitle.textContent == "Login" ? "login" : "register";
  try {
    let headers = {};
    if (action == "register") {
      if (fields.passwordField.value != fields.confirmpwdField.value) {
        throw new Error(
          "Passwords must be the same (password confirmation is different)"
        );
      }

      headers["Login"] = fields.usernameField.value;
      headers["Password"] = fields.passwordField.value;
      headers["DisplayName"] = fields.displaynameField.value;
    } else {
      headers["Login"] = fields.usernameField.value;
      headers["Password"] = fields.passwordField.value;
    }

    const data = await fetchData(
      `api/auth/${action}`,
      undefined,
      undefined,
      headers
    );
    if (data?.message == "Response status: 401") {
      throw new Error("Invalid credentials !");
    } else if (data?.message == "Response status: 500") {
      alert("A user with this name already exist !");
      throw new Error("Unique user login required !");
    }
    if (data?.userInfo) {
      setCookie("user", data.userInfo, [1, 0, 0, 0]);
      toggleUserProfil(data.userInfo.displayName);
    }

    // Clear fields and classes when all cases are verified
    clearFields(Object.values(fields));
    switchFields([fields.displaynameField, fields.confirmpwdField], true);
    fields.usernameField.classList.remove("wrong");
    fields.passwordField.classList.remove("wrong");
    fields.confirmpwdField.classList.remove("wrong");

    closePopup();
  } catch (error) {
    if (error.message.startsWith("Passwords")) {
      fields.confirmpwdField.className = "wrong";
    }
    if (error.message.startsWith("Invalid")) {
      fields.usernameField.className = "wrong";
      fields.passwordField.className = "wrong";
    }
    //myRedirect("/");
  }
});
