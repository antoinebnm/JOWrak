export default function Title({
  text = "Title",
  className = "",
  size = "1rem",
}) {
  return (
    <h1 className={className} style={{ fontSize: size }}>
      {text}
    </h1>
  );
}
