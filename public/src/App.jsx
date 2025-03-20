import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Game from "./components/Game.jsx";
import Leaderboard from "./components/Leaderboard.jsx";

function App() {
  const _uri = window.location.pathname;

  return (
    <>
      <Header />
      {(_uri == "/" && <Game />) ||
        (_uri == "/scoreboard" && <Leaderboard />) || <h1>404 - Not Found</h1>}
      <Footer />
    </>
  );
}

export default App;
