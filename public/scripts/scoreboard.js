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
fetchData("api/users/read/all").then((users) => {
  let TCid = "0".repeat(24);
  users = users.filter((user) => user._id != TCid);
  console.log(users);
  updateTable(users, "typeSpeed"); // Json to array
});
