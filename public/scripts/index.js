// formatage
const typeBox = document.getElementById("typeBox");
const typeText = document.getElementById("typeText");
const scoreDiv = document.getElementById("scoreDiv");
const timeDiv = document.getElementById("time");
const startButton = document.getElementById("startGameButton");

const logs = logsContainer.getElementsByTagName("span");
const logsDir = {};
for (let i = 0; i < logs.length; i++) {
  logsDir[logs[i].id] = logs[i];
}

const xWords = 5;

let totalOffset = 0;
/**
 * Offset target in pixels
 * @param {HTMLElement} parent
 * @param {string} target
 * @param {number} offset
 */
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

function setWords(wordlist, sample) {
  let html = ``;
  sample.forEach((word) => {
    wordlist[word].split("").forEach((char) => {
      html += `<span class="">${char}</span>
`;
    });
    if (sample.indexOf(word) != sample.length - 1)
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
/**
 * Calculate Gross WPM
 * @param {number} numOfChar
 * @param {number} timeTaken
 * @returns {number}
 */
function grossWPM(numOfChar, timeTaken) {
  numOfChar = (numOfChar + 1) / 8; // characters to words
  if (timeTaken == 0) timeTaken = 1; // fix timer error (0)
  timeTaken /= 60; // seconds to minutes
  return numOfChar / timeTaken;
}

/**
 *
 * @param {number} wpm
 * @param {numer} accuracy
 * @returns {number} score
 */
function getScore(wpm, accuracy) {
  return wpm * accuracy;
}

/**
 *  Returns characters typed in total and correctly
 * @param {HTMLElement} parent
 * @param {string} target
 * @param {string} options
 * @returns {object}
 */
function getTypedChars(parent, target) {
  let correct = 0;
  let counter = 0;

  parent.querySelectorAll(target).forEach((el) => {
    if (["correct", "incorrect"].includes(el.className)) counter += 1;
    if (el.className == "correct") correct += 1;
  });

  return { total: counter, correct: correct };
}

/**
 * Load a new game using wordList
 * @param {number} NoW Number of Word to include (integer)
 */
function loadNewGame(NoW = 1) {
  totalOffset = 0;
  const ranNums = shuffleWords(
    Array.from({ length: NoW }, () => Math.floor(Math.random() * 1372))
  );
  if (wordList) {
    typeText.innerHTML = setWords(wordList, ranNums);
    typeText.firstChild.classList = "current";
  } else window.location.reload();

  offsetChildren(typeText, "span", typeText.offsetWidth / 2);

  logsDir["log_totalwords"].textContent = `${NoW}`;
  logsDir["log_totalchars"].textContent = `${NoW * 8 - 1}`;
}

/**
 * True when first page load/refresh, then set to false
 */
let pageReload = true;
loadNewGame(xWords);
/**
 * Main function to run and manage the game
 * @param {number} timeLimit in seconds (optional)
 */
function run(timeLimit = null) {
  if (!pageReload) loadNewGame(xWords);
  else pageReload = false;

  eraseCookie("gameDetails");

  let interval, logging, counter;
  let timeSpent = 0;
  let score = 0;

  typeBox.classList = "focused";
  let gameStarted = true;
  let _typing = false;
  startButton.hidden = true;

  if (!_typing) timeDiv.textContent = "Start typing to begin the timer";

  typeText.value = "";
  typeBox.hidden = false;
  typeBox.focus();

  interval = setInterval(() => {
    if (!_typing) return;
    if (!timeLimit) timeDiv.textContent = "Game in progress...";
    else timeDiv.textContent = `Time spent typing: ${timeSpent}'`;

    let typedChars = getTypedChars(typeText, "span");
    let accuracy = typedChars.correct / typedChars.total;
    score = getScore(grossWPM(typedChars.total, timeSpent), accuracy);
    console.log(round(grossWPM(typedChars.total, timeSpent), 2));
    scoreDiv.textContent = isNaN(score) ? 0 : round(score, 2);
  }, 200);

  logging = setInterval(() => {
    let typedChars = getTypedChars(typeText, "span");
    let accuracy = typedChars.correct / typedChars.total;
    logsDir["log_typedchars"].textContent = `${typedChars.total}`;
    logsDir["log_rw_chars"].textContent =
      `${typedChars.correct}/${typedChars.total - typedChars.correct}`;
    logsDir["log_accuracy"].textContent = `${round(accuracy * 100, 0)}%`;
    logsDir["log_timer"].textContent =
      `${round(timeSpent, 2)}sec / ${round(timeSpent / 60, 2)}min`;
    logsDir["log_grosswpm"].textContent =
      `${round(grossWPM(typedChars.total, timeSpent), 2)}`;
    logsDir["log_netwpm"].textContent = `.`;
  }, 200);

  typeBox.addEventListener("keydown", function (event) {
    if (!gameStarted) return;

    let key;
    key = event.key; // The actual key pressed
    if (key == " ") key = "&nbsp;";

    // Check if the key is alphabetic (a-z or A-Z)
    const isAlphabetic = /^[a-zA-Z]$/.test(key);
    const isSpecial = ["&nbsp;", "Backspace"].includes(key);

    const currentChar = document.getElementsByClassName("current")[0];

    // Optionally prevent the default action for non-alphabetic keys
    if (!isAlphabetic && !isSpecial) {
      event.preventDefault(); // Stops the event from propagating further
      return;
    }

    if (!_typing) {
      _typing = true;

      counter = setInterval(() => {
        timeSpent = round(timeSpent + 0.01, 2);
        console.log(timeSpent, "sec");
      }, 10);
    }

    if (key == "Backspace") {
      if (currentChar.previousElementSibling) {
        currentChar.removeAttribute("class");
        currentChar.previousElementSibling.removeAttribute("class");
        currentChar.previousElementSibling.classList.add("current");
        offsetChildren(typeText, "span", currentChar.offsetWidth);
      }
    } else {
      currentChar.classList.remove("current"); // Switch current class to next item

      if (checkChar(currentChar.innerHTML, key)) {
        currentChar.classList.add("correct");
      } else {
        currentChar.classList.add("incorrect");
      }
      offsetChildren(typeText, "span", -currentChar.offsetWidth); // Offset text by "current character" size

      // Case where last item is typed
      if (!currentChar.nextElementSibling) {
        setTimeout(() => {
          clearInterval(interval);
          clearInterval(logging);
        }, 200);

        clearInterval(counter); // Arrêter la mise à jour du temps

        gameStarted = false;
        _typing = false;
        typeBox.classList["focused"] = false;

        startButton.textContent = "Play again ?";
        startButton.hidden = false;
        timeDiv.textContent = "Game ended !";

        /**
         * @const {id, token, name}
         */
        const isUserCo = getCookie("user");
        const gameInfo = {
          type: "typeSpeed",
          score: score,
          playedAt: new Date(),
        };
        if (isUserCo) {
          gameInfo["playedBy"] = isUserCo.userId;
          saveGame(gameInfo); // Save game in mongo
        } else {
          timeDiv.textContent += " Login to save your game score.";
          setCookie("gameDetails", gameInfo, [0, 1, 0, 0]);
        }
        return;
      }
      currentChar.nextElementSibling.classList.add("current");
    }
  });
}
