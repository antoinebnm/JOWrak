let userInfo;

try {
  user = JSON.parse(getCookie("user"));

  document.getElementById("userProfil").textContent = user.displayName;
  document.getElementById("accountMenu").style.display = "flex";
} catch (err) {
  console.error(err);
  alert("An error happened, you will be redirect to the home page.");
  eraseCookie("sid");
  eraseCookie("user");
  window.location.href = "/";
}

const sections = document.getElementsByClassName("main-box");

const getSection = () => {
  return window.location.search.split("?")[1];
};
sections.namedItem(getSection()).classList.remove("hidden");
