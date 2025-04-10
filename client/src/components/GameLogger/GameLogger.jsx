import { useState } from "react";
import "./GameLogger.css";

export default function GameLogger({
  totalWords,
  totalChars,
  typedChars,
  correctChars,
  incorrectChars,
  accuracy,
  grossWPM,
  netWPM,
  timer,
}) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleIsVisible = () => setIsVisible(!isVisible);

  return (
    <>
      <span
        id="logs_arrow"
        className={`arrow ${isVisible ? "down" : "right"}`}
        onClick={toggleIsVisible}
      ></span>
      {isVisible && (
        <div id="logs">
          <span>Total Words:</span> <span>{totalWords}</span>
          <br />
          <span>Total Characters:</span> <span>{totalChars}</span>
          <br />
          <span>Typed Characters:</span> <span>{typedChars}</span>
          <br />
          <span>Rights/Wrongs:</span>{" "}
          <span>
            {correctChars} / {incorrectChars}
          </span>
          <br />
          <span>Accuracy:</span>{" "}
          <span>{accuracy ? `${(accuracy * 100).toFixed(2)}%` : "0%"}</span>
          <br />
          <span>Gross WPM:</span> <span>{grossWPM}</span>
          <br />
          <span>Net WPM:</span> <span>{netWPM}</span>
          <br />
          <span>Timer:</span> <span>{timer}s</span>
        </div>
      )}
    </>
  );
}
