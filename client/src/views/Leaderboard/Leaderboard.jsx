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
          <td>{player.name}</td>
          <td>{player.score}</td>
          <td>{new Date(player.date).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const devData = [
      { name: "user1", score: 1, date: formatDate(new Date().getTime()) },
      {
        name: "user2",
        score: 2,
        date: formatDate(new Date().getTime() - 2 * 24 * 3600 * 1000),
      },
      {
        name: "user3",
        score: 3,
        date: formatDate(new Date().getTime() - 24 * 3600 * 1000),
      },
    ];

    // Fetch player scores from the API
    const fetchScores = async () => {
      try {
        sessionStorage.getItem("dev") && setPlayers(devData);
        fetchData("api/games", undefined, "GET", {
          Authorization: "admin",
        }).then((data) => {
          if (data) {
            if (data.name == "Error") return;
            setPlayers(data);
          } else return;
        });
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
