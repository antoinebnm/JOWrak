import { createContext, useContext, useState, useEffect } from "react";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "../../components/utils/cookieAgent";
import fetchData from "../../components/utils/fetchData";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getCookie("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (userData) => {
    setUser(userData);
    setCookie("user", JSON.stringify(userData), [1, 0, 0, 0]);
  };

  const logout = () => {
    fetchData("/api/auth/logout").then(() => {
      alert("You are now disconnected.\nRedirecting to home...");
      deleteCookie("user");
      setUser(null);
      window.location.href = "/";
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
