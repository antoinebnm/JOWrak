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
      console.log(data);
      if (data) {
        if (data.name == "Error") return;
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

var getPB = (data) => {
  const bestPerUser = {};
  data.forEach((game) => {
    const userId = game.playedBy;
    if (!bestPerUser[userId]) bestPerUser[userId] = game;
    else if (bestPerUser[userId].score < game.score) bestPerUser[userId] = game;
  });
  return bestPerUser;
};

var updateTable = (data) => {
  let rows = ``;
  Object.entries(getPB(data)).forEach(async (best, rank) => {
    fetchData(`/api/users/${best[0]}`, undefined, "GET", {
      Authorization: "admin",
    }).then((user) => {
      best[1].username = user.displayName;

      console.log(best);
      rows += `
    <tr>
        <th>${rank + 1}</th>
        <th>${best[1].username}</th>
        <th>${best[1].score}</th>
        <th>${formatDate(best[1].playedAt)}</th>
    </tr>
    `;
      console.log(rows);
      tbody.innerHTML = rows;
    });
  });
};
