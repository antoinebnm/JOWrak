preload();

// formatage
const typeBox = document.getElementById("typeBox");
const typeText = document.getElementById("typeText");
const scoreDiv = document.getElementById("scoreDiv");
const timeDiv = document.getElementById("time");
const startButton = document.getElementById("startGameButton");

const logsArrow = document.getElementById("logs_arrow");
const logsContainer = document.getElementById("logs");
const logs = logsContainer.getElementsByTagName("span");

logsArrow.addEventListener("click", () => {
  logsArrow.classList.toggle("right");
  logsArrow.classList.toggle("down");
  if (logsContainer.style.visibility == "visible")
    logsContainer.style.visibility = "collapse";
  else logsContainer.style.visibility = "visible";
});

const logsDir = {};
for (let i = 0; i < logs.length; i++) {
  logsDir[logs[i].id] = logs[i];
}

/**
 * Time incrementation value (in ms)
 */
const deltaT = 100;
/**
 * Number of words to type
 */
const xWords = 2;
/**
 * True when first page load/refresh, then set to false
 */
let pageReload = true;
let totalOffset = 0;

loadNewGame(xWords);

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

/**
 * Uses Math.round
 * @param {number} x Number to round (0<.5<1)
 * @param {number} n Number of decimals
 * @returns
 */
function round(x, n) {
  return (
    Math.round((x + Number.EPSILON) * parseInt("1" + "0".repeat(n))) /
    parseInt("1" + "0".repeat(n))
  );
}

// TODO: Define Accurate Accuracy (all mistakes made intead of only uncorrected mistakes)
/**
 * Calculate Gross WPM
 * @param {number} totalOfChar
 * @param {number} timeTaken
 * @returns {number}
 */
function grossWPM(totalOfChar, timeTaken) {
  let typedWords = (totalOfChar + 1) / 8; // characters to words

  if (timeTaken == 0) timeTaken = 1; // fix timer error (0)
  let timeInMin = timeTaken / 60; // seconds to minutes

  return typedWords / timeInMin;
}

/**
 * Calculate Net WPM
 * @param {object} typedChars
 * @param {number} timeTaken
 * @returns {number}
 */
function netWPM(typedChars, timeTaken) {
  let errorsToWord = (typedChars.total - typedChars.correct) / 8;

  if (timeTaken == 0) timeTaken = 1; // fix timer error (0)
  let timeInMin = timeTaken / 60; // seconds to minutes
  console.log(grossWPM(typedChars.total, timeTaken));
  console.log(errorsToWord);

  return grossWPM(typedChars.total, timeTaken) - errorsToWord / timeInMin;
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

var logger = (typedChars, accuracy, timeSpent) => {
  logsDir["log_typedchars"].textContent = `${typedChars.total}`;
  logsDir["log_rw_chars"].textContent =
    `${typedChars.correct}/${typedChars.total - typedChars.correct}`;
  logsDir["log_accuracy"].textContent = `${round(accuracy * 100, 2)}%`;
  logsDir["log_timer"].textContent =
    `${timeSpent}sec / ${round(timeSpent / 60, 2)}min`;
  logsDir["log_grosswpm"].textContent =
    `${round(grossWPM(typedChars.total, timeSpent), 2)}`;
  logsDir["log_netwpm"].textContent =
    `${round(netWPM(typedChars, timeSpent), 2)}`;
};

var frontRender = (_typing) => {
  typeBox.classList = "focused";
  startButton.hidden = true;

  if (!_typing) timeDiv.textContent = "Start typing to begin the timer";

  typeText.value = "";
  typeBox.hidden = false;
  typeBox.focus();
};

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
 * Main function to run and manage the game
 * @param {number} timeLimit in seconds (optional)
 */
function run(timeLimit = null) {
  // Checks if first page load or if User pressed 'PlayAgain' button
  if (!pageReload) loadNewGame(xWords);
  else pageReload = false;

  let core, counter; // intervals
  let timeSpent = 0;
  let score = 0;

  let gameStarted = true;
  let _typing = false;

  eraseCookie("gameDetails");
  frontRender(_typing);

  core = setInterval(() => {
    if (!_typing) return;
    if (!timeLimit) timeDiv.textContent = "Game in progress...";
    else timeDiv.textContent = `Time spent typing: ${timeSpent}'`;

    let typedChars = getTypedChars(typeText, "span");
    let accuracy = round(typedChars.correct / typedChars.total, 2);

    score = round(
      getScore(grossWPM(typedChars.total, round(timeSpent, 2)), accuracy),
      0
    );
    scoreDiv.textContent = isNaN(score) ? 0 : score;

    logger(typedChars, accuracy, round(timeSpent, 2));
  }, deltaT);

  counter = setInterval(() => {
    if (!_typing) return;
    timeSpent = round(timeSpent + round(deltaT / 1000, 2), 2);
  }, deltaT);

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
    }

    if (key == "Backspace") {
      if (currentChar.previousElementSibling) {
        currentChar.removeAttribute("class");
        currentChar.previousElementSibling.removeAttribute("class");
        currentChar.previousElementSibling.classList.add("current");
        offsetChildren(typeText, "span", currentChar.offsetWidth);
      }
    } else if (currentChar) {
      // Avoid error log when current is undefined
      if (checkChar(currentChar.innerHTML, key)) {
        currentChar.classList.add("correct");
      } else {
        currentChar.classList.add("incorrect");
      }
      offsetChildren(typeText, "span", -currentChar.offsetWidth); // Offset text by "current character" size

      currentChar.classList.remove("current");

      // Case where last item is typed
      if (!currentChar.nextElementSibling) {
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
          gameInfo["playedBy"] = JSON.parse(isUserCo).userId;
          saveGame(gameInfo); // Save game in mongo
        } else {
          setCookie("gameDetails", gameInfo, [0, 1, 0, 0]);
        }

        setTimeout(() => {
          clearInterval(counter); // Arrêter la mise à jour du temps
          clearInterval(core);

          _typing = false;
          gameStarted = false;
          typeBox.classList["focused"] = false;

          startButton.textContent = "Play again ?";
          startButton.hidden = false;
          timeDiv.textContent = "Game ended !";
          if (!isUserCo)
            timeDiv.textContent += " Login to save your game score.";
        }, deltaT);

        return;
      }

      // Switch current class to next item
      currentChar.nextElementSibling.classList.add("current");
    }
  });
}
