window.leaderboardData = [];

window.fetchLeaderboard = function () {
  const selectedGame = document.getElementById('gameSelect').value;
  const apiUrl = `https://api.playhive.com/v0/game/all/${selectedGame}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        window.leaderboardData = data;
        window.displayLeaderboard(data, selectedGame);
      } else {
        document.getElementById('leaderboard').innerHTML =
          '<tr><td colspan="7" class="text-center text-danger">No leaderboard data available.</td></tr>';
      }
    })
    .catch(error => {
      console.error('Error fetching leaderboard data:', error);
      document.getElementById('leaderboard').innerHTML =
        '<tr><td colspan="7" class="text-center text-danger">Error fetching leaderboard data.</td></tr>';
    });
};

window.displayLeaderboard = function (players, gameMode) {
  const leaderboardTable = document.getElementById('leaderboard');
  leaderboardTable.innerHTML = '';
  players.forEach(player => {
    const playerRow = document.createElement('tr');
    let killsColumn = '';

    if (gameMode === 'murder') {
      killsColumn = player.murders;
    } else if (gameMode === 'party') {
      killsColumn = '-';
    } else {
      killsColumn = player.kills;
    }

    playerRow.innerHTML = `
      <td>${player.human_index}</td>
      <td>${player.username}</td>
      <td>${player.xp}</td>
      <td>${player.played}</td>
      <td>${player.victories}</td>
      <td>${player.deaths}</td>
      <td>${killsColumn}</td>
    `;
    leaderboardTable.appendChild(playerRow);
  });
};

window.filterLeaderboard = function () {
  const searchTerm = document
    .getElementById('usernameSearch')
    .value.toLowerCase();
  const filteredData = window.leaderboardData.filter(player =>
    player.username.toLowerCase().includes(searchTerm)
  );
  const selectedGame = document.getElementById('gameSelect').value;
  window.displayLeaderboard(filteredData, selectedGame);
};

window.onload = window.fetchLeaderboard;
