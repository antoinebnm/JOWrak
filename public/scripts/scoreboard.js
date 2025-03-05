preload();

let tbody = document.querySelector("tbody");
let thead = document.querySelector("thead");

const _categories = { rank: "#", name: "Name", score: "Score", date: "Played" };

var header = `
    <tr>
        <th>${_categories.rank}</th>
        <th>${_categories.name}</th>
        <th>${_categories.score}</th>
        <th>${_categories.date}</th>
    </tr>
    `;

thead.innerHTML = header;

// Appelle la fonction pour récupérer les données et mettre à jour le tableau (à chaque chargement de la page scoreboard)
try {
  fetchData("api/games", undefined, "GET", { Authorization: "admin" }).then(
    (data) => {
      if (data) {
        if (data.name == "Error") return;
        console.log("data ", data);
        updateTable(data);
      } else return;
    }
  );
} catch (err) {
  console.error(err);
}

function formatDate(date) {
  let array = new Date(date).toDateString().split(" ");
  return +array[2] + " " + array[1] + " " + array[3];
}

function filter(array, arg = null, order = "asc") {
  let callback;
  switch (order) {
    case "asc":
      if (arg) callback = (a, b) => a.arg - b.arg;
      callback = (a, b) => a - b;
      break;

    case "desc":
      if (arg) callback = (a, b) => b.arg - a.arg;
      callback = (a, b) => b - a;
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
        <th>${index + 1}</th>
        <th>${game[1].playedBy.displayName}</th>
        <th>${game[1].score}</th>
        <th>${formatDate(game[1].playedAt)}</th>
    </tr>
    `;
  });

  tbody.innerHTML = rows;
  return;
}

// TODO: get all users instead of each per each
var updateTable = (data) => {
  const games = [];
  Object.entries(getPB(data)).forEach((best) => {
    games.push(best);
    console.log("best ", best);
  });
  setTimeout(() => {
    render(games);
  }, 100);
};
