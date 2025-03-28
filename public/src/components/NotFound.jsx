import Button from "./Button";
import Title from "./Title";

export default function NotFound() {
  return (
    <div className="main-box">
      <Title text="Are you lost ?" size="h1" />
      <Title text="There is nothing to see here" size="h3" />
      <Button
        id="backButton"
        label="Go back"
        className="btn"
        callback={() => {
          window.location.href = "/";
        }}
      />
    </div>
  );
}
