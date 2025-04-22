import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import GameSection from "../../views/GameSection";
import Leaderboard from "../../views/Leaderboard";
import Profile from "../../views/Profile";
import NotFound from "../../views/NotFound";

import ThemeProvider from "../../contexts/ThemeContext";
import UserProvider from "../../contexts/UserContext";

function App() {
  if (window.location.port == 5173) {
    localStorage.setItem("dev", true);
    localStorage.setItem(
      "user",
      JSON.stringify({
        displayName: "admin",
        login: "admin",
        password: "admin",
      })
    );
  }

  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <Header />
          <main className="container">
            <div className="main-box">
              <Routes>
                <Route path="/" element={<GameSection />} />
                <Route path="scoreboard" element={<Leaderboard />} />
                <Route path="account/:handle" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
