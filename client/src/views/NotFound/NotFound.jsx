import Button from "../../components/Button";
import Title from "../../components/Title";

export default function NotFound() {
  return (
    <>
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
    </>
  );
}
