import { useRef } from "react";

import "../styles/Button.css";

export default function Button({
  id,
  label = "Button",
  className = "",
  callback = () => {},
}) {
  const ref = useRef(null);

  function handleClick() {
    callback(ref);
  }

  return (
    <button id={id} ref={ref} className={className} onClick={handleClick}>
      {label}
    </button>
  );
}
