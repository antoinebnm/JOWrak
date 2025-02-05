// formatage
const zoneToType = document.getElementById("zoneToType");
const scoreDiv = document.getElementById("scoreDiv");
const timeDiv = document.getElementById("time");
const startButton = document.getElementById("startGameButton");

let totalOffset = 0;
function offsetChildren(parent, target, offset) {
  totalOffset += offset;
  parent.querySelectorAll(target).forEach((el) => {
    el.style.left = `${totalOffset}px`;
  });
}

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

function setWords(list) {
  let html = ``;
  list.forEach((word) => {
    wordList[word].split("").forEach((char) => {
      html += `<span class="">${char}</span>
`;
    });
    if (list.indexOf(word) != list.length - 1)
      html += `<span class="">&nbsp;</span>
`;
  });
  return html;
}

function checkChar(char, key) {
  return char === key;
}

function round(x, n) {
  return (
    Math.round((x + Number.EPSILON) * parseInt("1" + "0".repeat(n))) /
    parseInt("1" + "0".repeat(n))
  );
}

// TODO: Define Net WPM, Gross WPM, Accurate Accuracy (no corrected mistakes)
function getWPM(numOfChar, timeTaken) {
  // 7chars words + space, timeTaken in seconds
  //numOfChar -= 1;
  numOfChar /= 8; // characters to words
  if (timeTaken == 0) timeTaken = 1;
  timeTaken /= 60; // seconds to minutes
  return round(numOfChar / timeTaken, 2);
}

function getScore(wpm, accuracy) {
  return round(wpm * accuracy, 2);
}

function getAccuracy(parent, target, options) {
  let correct = 0;
  let counter = 0;
  parent.querySelectorAll(target).forEach((el) => {
    if (options.includes(el.className)) counter += 1;
    if (el.className == "correct") correct += 1;
  });
  return { total: counter, correct: correct };
}

async function preloadGame() {
  try {
    const data = await fetchData("/api/session", undefined, "GET");
    if (data?.currentGame) {
      loadCurrentGame(null);
    } else {
      loadNewGame();
    }
  } catch (error) {
    console.log(error);
    //window.location.reload();
  }
}

preloadGame();

function loadNewGame(NoW = 10) {
  const ranNums = shuffleWords(
    Array.from({ length: NoW }, () => Math.floor(Math.random() * 1372))
  );

  zoneToType.innerHTML = setWords(ranNums);
  zoneToType.firstChild.classList = "current";

  offsetChildren(zoneToType, "span", zoneToType.offsetWidth / 2);
}

function loadCurrentGame(body) {
  const test = { A: 0, a: 1, r: 1, o: 1, n: 1, n: 0 };

  let charColor;
  Object.entries(test).forEach((pair) => {
    if (pair[1]) charColor = "correct";
    else charColor = "incorrect";
    zoneToType.innerHTML = `<span class="${charColor}">${pair[0]}</span>
  `;
  });

  offsetChildren(zoneToType, "span", zoneToType.offsetWidth / 2);

  gameStarted = false;
  zoneToType.classList["focused"] = false;

  startButton.textContent = "Rejouer ?";
  startButton.hidden = false;
  timeDiv.textContent = "Partie terminée !";

  return;

  let score = body?.score;
  let date = body?.date;
  let typeResult = body?.typeResult;
  let userId = body?.userId;

  if (!score || !date || !typeResult) {
    console.error("Score, Date or Typing results missing.");
    return;
  }

  offsetChildren(zoneToType, "span", zoneToType.offsetWidth / 2);

  gameStarted = false;
  zoneToType.classList["focused"] = false;

  startButton.textContent = "Rejouer ?";
  startButton.hidden = false;
  timeDiv.textContent = "Partie terminée !";
}

function run(timeLimit = null) {
  let interval;
  let timeSpent = 0;
  let gameStarted = null;
  let filledCharacters;

  zoneToType.classList = "focused";
  gameStarted = true;
  startButton.hidden = true;
  if (!timeLimit) timeDiv.textContent = "Partie en cours...";

  zoneToType.value = "";
  zoneToType.hidden = false;
  zoneToType.focus();

  interval = setInterval(() => {
    timeSpent++;
    filledCharacters = getAccuracy(zoneToType, "span", [
      "correct",
      "incorrect",
    ]);
    let accuracy = round(filledCharacters.correct / filledCharacters.total, 2);
    let score = getScore(getWPM(filledCharacters.total, timeSpent), accuracy);
    scoreDiv.textContent = isNaN(score) ? 0 : score;
  }, 1000);

  zoneToType.addEventListener("keydown", function (event) {
    if (!gameStarted) return;
    let key;
    key = event.key; // The actual key pressed
    if (key == " ") key = "&nbsp;";

    // Check if the key is alphabetic (a-z or A-Z)
    const isAlphabetic = /^[a-zA-Z]$/.test(key);
    const isSpecial = ["&nbsp;", "Backspace"].includes(key);

    const currentChar = document.getElementsByClassName("current")[0];

    // Log the results
    /*
  console.log({
    key: key,
    valid: isAlphabetic || isSpecial,
    target: currentChar.innerHTML,
  });
  */

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
        offsetChildren(zoneToType, "span", currentChar.offsetWidth);
      }
    } else {
      currentChar.classList.remove("current");

      if (checkChar(currentChar.innerHTML, key)) {
        currentChar.classList.add("correct");
      } else {
        currentChar.classList.add("incorrect");
      }
      offsetChildren(zoneToType, "span", -currentChar.offsetWidth);
      if (!currentChar.nextElementSibling) {
        gameStarted = false;
        zoneToType.classList["focused"] = false;
        clearInterval(interval); // Arrêter la mise à jour du temps
        //zoneToType.hidden = true;

        startButton.textContent = "Rejouer ?";
        startButton.hidden = false;
        timeDiv.textContent = "Partie terminée !";
        return;
      }
      currentChar.nextElementSibling.classList.add("current");
    }
  });
}
