document.getElementById('fetchStatsBtn').addEventListener('click', function () {
  const nickname = document.getElementById('nicknameInput').value.trim();
  const desiredWinrate = parseFloat(
    document.getElementById('desiredWinrateInput').value.trim()
  );

  if (
    !nickname ||
    isNaN(desiredWinrate) ||
    desiredWinrate < 0 ||
    desiredWinrate > 100
  ) {
    displayMessage(
      'Enter both nickname and a valid winrate (0-100).',
      'danger'
    );

    return;
  }

  const gameMode = 'bed';
  const apiUrl = `https://api.playhive.com/v0/game/all/${gameMode}/${nickname}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        displayMessage('Error fetching data for the player.', 'danger');
        return;
      }

      const currentWins = data.victories;
      const gamesPlayed = data.played;
      const currentLosses = gamesPlayed - currentWins;
      const currentWinrate = currentWins / gamesPlayed;

      const requiredWins =
        ((desiredWinrate / 100) * gamesPlayed - currentWins) /
        (1 - desiredWinrate / 100);
      const gamesRemaining = Math.max(0, Math.ceil(requiredWins));

      displayStats(data, currentWinrate, desiredWinrate, gamesRemaining);

      clearMessage();
    })
    .catch(error => {
      displayMessage('There was an error fetching the stats.', 'danger');
      console.error(error);
    });
});

function displayMessage(message, type) {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = `
          <div class="alert alert-${type} alert-custom" role="alert">
            ${message}
          </div>
        `;
}

function clearMessage() {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = '';
}

function displayStats(data, currentWinrate, desiredWinrate, gamesRemaining) {
  const statsContainer = document.getElementById('stats');
  statsContainer.innerHTML = '';

  const stats = [
    { label: 'Games Played', value: data.played },
    { label: 'Wins', value: data.victories },
    { label: 'Losses', value: data.played - data.victories },
    {
      label: 'Current Winrate',
      value: `${(currentWinrate * 100).toFixed(2)}%`,
    },
  ];

  stats.forEach(stat => {
    const statElement = document.createElement('div');
    statElement.classList.add('col-md-4', 'my-2');
    statElement.innerHTML = ` 
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${stat.label}</h5>
                <p class="card-text">${stat.value}</p>
              </div>
            </div>
          `;
    statsContainer.appendChild(statElement);
  });

  const gamesRemainingElement = document.createElement('div');
  gamesRemainingElement.classList.add('col-md-4', 'my-2');
  gamesRemainingElement.innerHTML = `
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Games Left for Desired Winrate</h5>
              <p class="card-text">${
                gamesRemaining > 0 ? gamesRemaining : 'Target winrate reached'
              }</p>
            </div>
          </div>
        `;
  statsContainer.appendChild(gamesRemainingElement);
}
