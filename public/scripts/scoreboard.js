preload();

let tbody = document.querySelector("tbody");
let thead = document.querySelector("thead");

const _categories = { rank: "#", name: "Name", score: "Score", date: "Played" };

var header = `
    <tr>
        <th class="fixed_w">${_categories.rank}</th>
        <th>${_categories.name}</th>
        <th class="fixed_w">${_categories.score}<img id="filterScore" class="filterArrow" onclick="filterMenu(this);" src="../assets/filterArrowBot.png"></th>
        <th>${_categories.date}<img id="filterDate" class="filterArrow" onclick="filterMenu(this);" src="../assets/filterArrowBot.png"></th>
    </tr>
    `;

thead.innerHTML = header;

// Appelle la fonction pour récupérer les données et mettre à jour le tableau (à chaque chargement de la page scoreboard)
try {
  fetchData("api/games", undefined, "GET", { Authorization: "admin" }).then(
    (data) => {
      if (data) {
        if (data.name == "Error") return;
        updateTable(data);
      } else return;
    }
  );
} catch (err) {
  console.error(err);
}

let filters = {
  score: { count: 0, src: document.getElementById("filterScore") },
  date: { count: 0, src: document.getElementById("filterDate") },
};
function filterMenu(html) {
  switch (html.id) {
    case "filterScore":
      toggleFiltreScore(filters.score.count++);
      if (filters.score.count == 2) filters.score.count = 0;
      break;

    case "filterDate":
      toggleFiltreDate(filters.date.count++);
      if (filters.date.count == 2) filters.date.count = 0;
      break;

    default:
      break;
  }
}

var toggleFiltreScore = (count) => {
  if (count) {
    filters.score.src.src = "../assets/filterArrowBot.png";
    render(filter(games, "score", "desc"));
  } else {
    filters.score.src.src = "../assets/filterArrowTop.png";
    render(filter(games, "score", "asc"));
  }
};

var toggleFiltreDate = (count) => {
  const mappedGames = games.map(([id, game]) => [
    id,
    { ...game, playedAt: new Date(game.playedAt).getTime() },
  ]);
  if (count) {
    filters.date.src.src = "../assets/filterArrowBot.png";
    render(filter(mappedGames, "playedAt", "desc"));
  } else {
    filters.date.src.src = "../assets/filterArrowTop.png";
    render(filter(mappedGames, "playedAt", "asc"));
  }
};

function formatDate(date) {
  let array = new Date(date).toDateString().split(" ");
  return +array[2] + " " + array[1] + " " + array[3];
}

function filter(array, arg = null, order = "asc") {
  let callback;
  switch (order) {
    case "asc":
      if (arg) callback = (a, b) => a[1][arg] - b[1][arg];
      else callback = (a, b) => a - b;
      break;

    case "desc":
      if (arg) callback = (a, b) => b[1][arg] - a[1][arg];
      else callback = (a, b) => b - a;
      break;

    default:
      callback = null;
      break;
  }

  return array.sort(callback);
}

/**
 * Get Personal Best (per users)
 * @param {object} data
 * @returns {object}
 */
var getPB = (data) => {
  const bestPerUser = {};
  data.forEach((game) => {
    const userId = game.playedBy._id;
    if (!bestPerUser[userId]) bestPerUser[userId] = game;
    else if (bestPerUser[userId].score < game.score) bestPerUser[userId] = game;
  });
  return bestPerUser;
};

function render(data) {
  let rows = ``;
  data.forEach((game, index) => {
    rows += `
    <tr>
        <td style="flex: none; width: 128px;">${index + 1}</td>
        <td style="flex: 1; ">${game[1].playedBy.displayName}</td>
        <td style="flex: none; width: 128px;">${game[1].score}</td>
        <td style="flex: 1; ">${formatDate(game[1].playedAt)}</td>
    </tr>
    `;
  });

  tbody.innerHTML = rows;
  return;
}

const games = [];
var updateTable = (data) => {
  games.length = 0;
  Object.entries(getPB(data)).forEach((best) => {
    games.push(best);
  });
  setTimeout(() => {
    render(filter(games, "score", "desc"));
  }, 100);
};
