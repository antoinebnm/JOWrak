import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import GameSection from "../../views/GameSection";
import Leaderboard from "../../views/Leaderboard";
import NotFound from "../../views/NotFound";

import ThemeProvider from "../../contexts/ThemeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Header />
        <main className="container">
          <div className="main-box">
            <Routes>
              <Route path="/" element={<GameSection />} />
              <Route path="scoreboard" element={<Leaderboard />} />
              <Route path="account" element={<Leaderboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
