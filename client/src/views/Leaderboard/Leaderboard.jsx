import "./Leaderboard.css";
import Title from "../../components/Title";

import React, { useEffect, useRef, useState } from "react";
import fetchData from "../../components/utils/fetchData";

function formatDate(date) {
  let array = new Date(date).toDateString().split(" ");
  return +array[2] + " " + array[1] + " " + array[3];
}

// Sub-component for the table header
const TableHeader = ({ sortConfig, requestSort, refs }) => {
  return (
    <thead>
      <tr>
        <th style={{ width: "30px" }} ref={(el) => (refs.current[0] = el)}>
          #
        </th>
        <th style={{ width: "250px" }} ref={(el) => (refs.current[1] = el)}>
          Name
        </th>
        <th
          ref={(el) => (refs.current[2] = el)}
          onClick={() => requestSort("score")}
          style={{ width: "180px", cursor: "pointer" }}
        >
          Score
          {sortConfig.key === "score" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </th>
        <th
          ref={(el) => (refs.current[3] = el)}
          onClick={() => requestSort("date")}
          style={{ width: "250px", cursor: "pointer" }}
        >
          Date
          {sortConfig.key === "date" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </th>
      </tr>
    </thead>
  );
};

// Sub-component for the table body
const TableBody = ({ players, refs }) => {
  return (
    <tbody>
      {players.map((player, index) => (
        <tr key={index}>
          <td style={{ width: refs.current[0].offsetWidth, display: "block" }}>
            {index + 1}
          </td>
          <td style={{ width: refs.current[1].offsetWidth }}>
            {player.playedBy.displayName}
          </td>
          <td style={{ width: refs.current[2].offsetWidth, display: "block" }}>
            {player.score}
          </td>
          <td style={{ width: refs.current[3].offsetWidth }}>
            {formatDate(player.playedAt)}
          </td>
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
  const sizesRef = useRef([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetchData("/api/games", undefined, "GET");
        if (res.name == "Error") return; // Check if data error, else set players to data
        setPlayers(res);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  const requestSort = (key) => {
    let direction = "descending";
    if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
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
      <Title text="Top Scores" className="tableTitle" size="h2" />
      <table>
        <TableHeader
          refs={sizesRef}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
        <TableBody refs={sizesRef} players={sortedPlayers} />
      </table>
    </div>
  );
}
