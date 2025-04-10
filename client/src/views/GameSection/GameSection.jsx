import { useEffect, useRef, useState } from "react";

import Button from "../../components/Button";
import GameLogger from "../../components/GameLogger";
import Title from "../../components/Title";

import "./GameSection.css";

const xWords = 2;
import wordList from "../../components/utils/wordList";

function shuffleWords(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

function getWordSample(words, count) {
  return shuffleWords(words).slice(0, count);
}

function buildSpans(sample) {
  const spans = [];
  sample.forEach((word, wIdx) => {
    word.split("").forEach((char, cIdx) => {
      spans.push(<span key={`${wIdx}-${cIdx}`}>{char}</span>);
    });
    if (wIdx !== sample.length - 1) {
      spans.push(<span key={`space-${wIdx}`}>&nbsp;</span>);
    }
  });
  return spans;
}

export default function GameSection() {
  const [input, setInput] = useState("");
  const [spans, setSpans] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [time, setTime] = useState(0);
  const [typing, setTyping] = useState(false);

  const typeTextRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const sample = getWordSample(wordList, xWords);
    setSpans(buildSpans(sample));
    setInput("");
    setCorrect(0);
    setIncorrect(0);
    setTime(0);
    setTyping(false);
    clearInterval(intervalRef.current);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (!typing) {
      setTyping(true);
      startTimer();
    }

    let key = e.key;
    if (key === " ") key = "\u00A0"; // space match

    if (!/^[a-zA-Z]$/.test(key) && key !== "\u00A0" && key !== "Backspace") {
      e.preventDefault();
      return;
    }

    const newInput =
      key === "Backspace"
        ? input.slice(0, -1)
        : input.length < spans.length
        ? input + key
        : input;

    setInput(newInput);

    let correctCount = 0;
    let incorrectCount = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (spans[i]?.props?.children === newInput[i]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }

    setCorrect(correctCount);
    setIncorrect(incorrectCount);

    if (newInput.length >= spans.length) {
      clearInterval(intervalRef.current);
      setTyping(false);
    }
  };

  const accuracy = input.length > 0 ? correct / input.length : 0;
  const grossWPM = time > 0 ? input.length / 5 / (time / 60) : 0;
  const netWPM = grossWPM * accuracy;

  return (
    <>
      <GameLogger
        totalWords={xWords}
        totalChars={spans.length}
        typedChars={input.length}
        correctChars={correct}
        incorrectChars={incorrect}
        accuracy={accuracy}
        grossWPM={grossWPM.toFixed(2)}
        netWPM={netWPM.toFixed(2)}
        timer={time}
      />

      {/* Game section */}
      <Title text="Typing Speed Game" size="h2" />
      <p className="game-description">
        Goal: write as fast as possible all the given words (avoid mistakes!)
      </p>
      <div className="action_btns">
        <Button
          id="startGameButton"
          className="btn"
          label="Start Game"
          callback={() => {
            initGame();
          }}
        />
        <Button
          id="toScoreboard"
          className="btn"
          label="View Leaderboard"
          callback={() => {
            window.location.href = "scoreboard";
          }}
        />
      </div>
      <section className="game-info">
        <p>
          <span id="time">Waiting for the game to start</span>
        </p>
        <p>
          Score: <span id="scoreDiv">0</span>
        </p>
        <div className="input-container">
          <span id="label">Type here:</span>
          <div
            id="typeBox"
            tabIndex="1"
            onKeyDown={handleKeyDown}
            className="typeBox"
            ref={typeTextRef}
          >
            <div id="typeText">
              {spans.map((span, idx) => {
                let className = "";
                if (input.length > idx) {
                  className =
                    input[idx] === span.props.children
                      ? "correct"
                      : "incorrect";
                } else if (input.length === idx) {
                  className = "current";
                }
                return (
                  <span key={span.key} className={className}>
                    {span.props.children}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
