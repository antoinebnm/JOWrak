import { useParams } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  return (
    <>
      <h1>{useParams().handle.toUpperCase()}</h1>
    </>
  );
}
