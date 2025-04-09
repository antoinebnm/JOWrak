import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import Game from "../../views/Game";
import Leaderboard from "../../views/Leaderboard";
import NotFound from "../../views/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/scoreboard" element={<Leaderboard />} />
          <Route className="container" path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
