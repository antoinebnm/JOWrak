export default function Title({ text = "Title", className = "", size = "h1" }) {
  switch (size) {
    case "h1":
      return <h1 className={className}>{text}</h1>;

    case "h2":
      return <h2 className={className}>{text}</h2>;

    case "h3":
      return <h3 className={className}>{text}</h3>;

    case "h4":
      return <h4 className={className}>{text}</h4>;

    default:
      break;
  }
}
