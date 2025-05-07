import "./Leaderboard.css";
import Title from "../../components/Title";

import React, { useEffect, useRef, useState } from "react";
import fetchData from "../../components/utils/fetchData";

function formatDate(date) {
  let array = new Date(date).toDateString().split(" ");
  return +array[2] + " " + array[1] + " " + array[3];
}

/**
 * Get the personal best game entry for each user.
 * @param {Array} data - The array of game entries (scoreboard).
 * @returns {Array} - Array of highest score entries per user.
 */
function getPersonalBests(data) {
  const bestByUser = new Map();

  data.forEach((entry) => {
    const userId = entry.playedBy._id;

    if (!bestByUser.has(userId)) {
      bestByUser.set(userId, entry);
    } else {
      const currentBest = bestByUser.get(userId);

      // If score is higher, or same score but more recent date
      if (
        entry.score > currentBest.score ||
        (entry.score === currentBest.score &&
          new Date(entry.playedAt) > new Date(currentBest.playedAt))
      ) {
        bestByUser.set(userId, entry);
      }
    }
  });

  return Array.from(bestByUser.values());
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
          onClick={() => requestSort("playedAt")}
          style={{ width: "250px", cursor: "pointer" }}
        >
          Date
          {sortConfig.key === "playedAt" &&
            (sortConfig.direction === "ascending" ? "↑" : "↓")}
        </th>
      </tr>
    </thead>
  );
};

// Sub-component for the table body
const TableBody = ({ games, refs }) => {
  return (
    <tbody>
      {games.map((game, index) => (
        <tr key={index}>
          <td style={{ width: refs.current[0].offsetWidth, display: "block" }}>
            {index + 1}
          </td>
          <td style={{ width: refs.current[1].offsetWidth }}>
            {game.playedBy.displayName}
          </td>
          <td style={{ width: refs.current[2].offsetWidth, display: "block" }}>
            {game.score}
          </td>
          <td style={{ width: refs.current[3].offsetWidth }}>
            {formatDate(game.playedAt)}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default function Leaderboard() {
  const [games, setGames] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "score",
    direction: "descending",
  });
  const sizesRef = useRef([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetchData("/api/games", undefined, "GET");
        if (res.name == "Error") return; // Check if data error, else set games to data

        setGames(getPersonalBests(res));
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

  const sortedGames = React.useMemo(() => {
    let sortableGames = [...games];
    if (sortConfig.key !== null) {
      sortableGames.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGames;
  }, [games, sortConfig]);

  return (
    <div>
      <Title text="Top Scores" className="tableTitle" size="h2" />
      <table>
        <TableHeader
          refs={sizesRef}
          sortConfig={sortConfig}
          requestSort={requestSort}
        />
        <TableBody refs={sizesRef} games={sortedGames} />
      </table>
    </div>
  );
}
