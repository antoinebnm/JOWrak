import { useRef } from "react";

export default function Image({
  id,
  src,
  alt = "",
  height = 64,
  className = "",
  callback = () => {},
}) {
  const ref = useRef(null);

  function handleClick() {
    callback(ref);
  }

  return (
    <img
      id={id}
      src={src}
      alt={alt}
      height={height}
      className={className}
      onClick={handleClick}
    />
  );
}
