window.onload = function () {
  loadHistory();

  const savedNickname = localStorage.getItem('nickname');
  const savedGameMode = localStorage.getItem('gameMode');

  if (savedNickname) {
    document.getElementById('nickname').value = savedNickname;
  }

  if (savedGameMode) {
    document.getElementById('gameMode').value = savedGameMode;
  }
};

document.getElementById('searchBtn').addEventListener('click', event => {
  event.preventDefault();
  const nickname = document.getElementById('nickname').value.trim();
  const gameMode = document.getElementById('gameMode').value;

  if (!nickname || !gameMode) {
    displayMessage(
      'Please enter a correct nickname and select a game mode.',
      'danger'
    );
    return;
  }

  localStorage.setItem('nickname', nickname);
  localStorage.setItem('gameMode', gameMode);

  const searchHistory = getSearchHistory();
  const newSearch = { nickname, gameMode };

  const searchExists = searchHistory.some(
    item => item.nickname === nickname && item.gameMode === gameMode
  );

  if (!searchExists) {
    searchHistory.push(newSearch);
    if (searchHistory.length > 5) searchHistory.shift();

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }

  const statsUrl = `stats.html?gameMode=${gameMode}&nickname=${nickname}`;
  console.log('Redirecting to:', statsUrl);
  window.location.href = statsUrl;
});

function displayMessage(message, type) {
  const messageContainer = document.getElementById('messageContainer');
  messageContainer.innerHTML = `  
          <div class="alert alert-${type} alert-custom" role="alert">
            ${message}
          </div>
        `;
}

function getSearchHistory() {
  const history = localStorage.getItem('searchHistory');
  return history ? JSON.parse(history) : [];
}

function loadHistory() {
  const history = getSearchHistory();
  const historyList = document.getElementById('historyList');
  const historyTitle = document.getElementById('historyTitle');
  historyList.innerHTML = '';

  if (history.length === 0) {
    historyTitle.style.display = 'none';
  } else {
    historyTitle.style.display = 'block';
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.textContent = `${
        item.nickname
      } - ${item.gameMode.toUpperCase()}`;
      historyItem.addEventListener('click', () => {
        document.getElementById('nickname').value = item.nickname;
        document.getElementById('gameMode').value = item.gameMode;
      });
      historyList.appendChild(historyItem);
    });
  }
}
