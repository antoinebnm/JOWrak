preload();

let tbody = document.querySelector("tbody");
let thead = document.querySelector("thead");

var header = `
    <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Date of entry</th>
    </tr>
    `;
thead.innerHTML = header;

function updateTable(players, gameType) {
  let row = ``;
  players.forEach((element) => {
    element.gamesPlayed.forEach((game) => {
      if (game.type == gameType) {
        row += `
          <tr>
              <td>${element.displayName}</td>
              <td>${game.score}</td>
              <td>${new Date(game.dateOfEntry).toLocaleDateString()}</td>
          </tr>`;
      }
    });
  });
  tbody.innerHTML = row;
}

// Appelle la fonction pour récupérer les données et mettre à jour le tableau (à chaque chargement de la page scoreboard)
try {
  fetchData("api/users/scoreboard", undefined, "GET").then((data) => {
    console.log(data);
    if (data.name == "Error") return;
    if (data)
      updateTable(data, "typeSpeed"); // Json to array
    else return;
  });
} catch (err) {
  console.error(err);
}
