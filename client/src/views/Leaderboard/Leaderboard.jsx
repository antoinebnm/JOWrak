import "./Leaderboard.css";
import Title from "../../components/Title";

import React, { useEffect, useState } from "react";
import fetchData from "../../components/utils/fetchData";

function formatDate(date) {
  let array = new Date(date).toDateString().split(" ");
  return +array[2] + " " + array[1] + " " + array[3];
}

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
          <td>{player.playedBy.displayName}</td>
          <td>{player.score}</td>
          <td>{formatDate(player.playedAt)}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "score",
    direction: "descending",
  });

  useEffect(() => {
    // Fetch player scores from the API
    const fetchScores = async () => {
      try {
        const res = await fetchData("/api/games", undefined, "GET");

        setPlayers(res);
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
