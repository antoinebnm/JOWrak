function shuffleWords(array) {
  var i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

const zoneToType = document.getElementById("zoneToType");
function run(timeLimit = 10) {
  const scoreDiv = document.getElementById("scoreDiv");
  const timeDiv = document.getElementById("time");
  const startButton = document.getElementById("startGameButton");

  let _x = 100;

  const ranNums = shuffleWords(
    Array.from({ length: _x }, () => Math.floor(Math.random() * 1372))
  );

  let userScore = 0;
  let userInput = "";
  let i = 0;

  zoneToType.value = "";
  zoneToType.hidden = false;
  document.getElementById("label").textContent = "Type here:";
  zoneToType.focus();

  let timeRemaining = timeLimit;
  timeDiv.textContent = timeRemaining;

  startButton.hidden = true;

  const interval = setInterval(() => {
    timeRemaining--;
    timeDiv.textContent = timeRemaining;
  }, 1000);

  const timeout = setTimeout(() => {
    console.log("Timeout");
    zoneToType.hidden = true;
    document.getElementById("label").textContent = "";
    clearTimeout(timeout); // Arrêter le timer
    clearInterval(interval); // Arrêter la mise à jour du temps
    scoreDiv.textContent = userScore;

    startButton.textContent = "Play Again ?";
    startButton.hidden = false;
    timeDiv.textContent = "Game Ended !";
  }, timeLimit * 1000);

  zoneToType.addEventListener("input", () => {
    userInput = zoneToType.value;
  });
}

function setWord(list, position) {
  let chars = list[position].split("");
  let html;
  chars.forEach((char) => {
    html += `<span class="incorrect">${char}</span>
    `;
  });
  html += `<span class="incorrect">&nbsp;</span>
    `;
  console.log(html);
  return html;
}

function checkChar(char, key) {
  return char === key;
}

function inRange(x, min, max) {
  return x >= min && x <= max;
}

zoneToType.focus();
zoneToType.addEventListener("keydown", function (event) {
  let key;
  key = event.key; // The actual key pressed
  if (key == " ") key = "&nbsp;";

  const code = key.codePointAt(0); // Unicode code point for the character

  // Check if the key is alphabetic (a-z or A-Z)
  const isAlphabetic = /^[a-zA-Z]$/.test(key);
  const isSpecial = ["&nbsp;", "Backspace"].includes(key);

  const currentChar = document.getElementsByClassName("current")[0];

  // Log the results
  console.log({
    key: key,
    code: code,
    valid: isAlphabetic || isSpecial,
    target: currentChar.innerHTML,
  });

  // Optionally prevent the default action for non-alphabetic keys
  if (!isAlphabetic && !isSpecial) {
    event.preventDefault(); // Stops the event from propagating further
    return;
  }

  if (key == "Backspace") {
    if (currentChar.previousElementSibling) {
      currentChar.removeAttribute("class");
      currentChar.previousElementSibling.removeAttribute("class");
      currentChar.previousElementSibling.classList.add("current");
    }
  } else {
    currentChar.classList.remove("current");

    if (checkChar(currentChar.innerHTML, key)) {
      currentChar.classList.add("correct");
    } else {
      currentChar.classList.add("incorrect");
    }

    currentChar.nextElementSibling.classList.add("current");
  }
});
