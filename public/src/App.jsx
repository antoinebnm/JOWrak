import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Game from "./components/Game.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import NotFound from "./components/NotFound.jsx";

function App() {
  const _uri = window.location.pathname;

  return (
    <>
      <Header />
      <div className="container">
        {(_uri == "/" && <Game />) ||
          (_uri == "/scoreboard" && <Leaderboard />) || <NotFound />}
      </div>
      <Footer />
    </>
  );
}

export default App;
