let leaderboardData = [];

function fetchLeaderboard() {
  const selectedGame = document.getElementById('gameSelect').value;
  const apiUrl = `https://api.playhive.com/v0/game/all/${selectedGame}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data)) {
        leaderboardData = data;
        displayLeaderboard(data, selectedGame);
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
}

function displayLeaderboard(players, gameMode) {
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
}

function filterLeaderboard() {
  const searchTerm = document
    .getElementById('usernameSearch')
    .value.toLowerCase();
  const filteredData = leaderboardData.filter(player =>
    player.username.toLowerCase().includes(searchTerm)
  );
  const selectedGame = document.getElementById('gameSelect').value;
  displayLeaderboard(filteredData, selectedGame);
}

window.onload = fetchLeaderboard;
