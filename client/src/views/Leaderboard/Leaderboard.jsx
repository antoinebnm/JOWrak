import "./Leaderboard.css";
import Title from "../../components/Title";

// Leaderboard.jsx
import React, { useEffect, useState } from "react";

// Sub-component for the table header
const TableHeader = ({ sortConfig, requestSort }) => {
  return (
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th onClick={() => requestSort("score")} style={{ cursor: "pointer" }}>
          Score{" "}
          {sortConfig.key === "score" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </th>
        <th onClick={() => requestSort("date")} style={{ cursor: "pointer" }}>
          Date{" "}
          {sortConfig.key === "date" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </th>
      </tr>
    </thead>
  );
};

// Sub-component for the table body
const TableBody = ({ players }) => {
  return (
    <tbody>
      {players.map((player, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{player.name}</td>
          <td>{player.score}</td>
          <td>{new Date(player.date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  );
};

// Main Leaderboard component
export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    // Fetch player scores from the API
    const fetchScores = async () => {
      try {
        const response = await fetch("https://api.example.com/scores"); // Replace with your API endpoint
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = React.useMemo(() => {
    let sortablePlayers = [...players];
    if (sortConfig.key !== null) {
      sortablePlayers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortablePlayers;
  }, [players, sortConfig]);

  return (
    <div>
      <Title text="Top Scores" className="table-title" size="h2" />
      <table>
        <TableHeader sortConfig={sortConfig} requestSort={requestSort} />
        <TableBody players={sortedPlayers} />
      </table>
    </div>
  );
}
