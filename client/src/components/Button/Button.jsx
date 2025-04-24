import { useRef } from "react";

import "./Button.css";

export default function Button({
  id,
  label = "Button",
  type = "button",
  className = "",
  callback = () => {},
}) {
  const ref = useRef(null);

  function handleClick() {
    callback(ref);
  }

  return (
    <button
      id={id}
      ref={ref}
      type={type}
      className={className}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
