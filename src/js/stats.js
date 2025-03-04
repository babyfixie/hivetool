import { presets } from './presets.js';

const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get('gameMode');
const nickname = urlParams.get('nickname');
const apiUrl = `https://api.playhive.com/v0/game/all/${gameMode}/${nickname}`;
const userInfoUrl = `https://api.playhive.com/v0/game/all/main/${nickname}`;
const gameMetaUrl = `https://api.playhive.com/v0/game/meta/${gameMode}`;

let playerData = null;
let gameMetaData = null;

function fetchPlayerData() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data) {
        fetchUserInfo();
        fetchGameMeta();
        displayStats(data);
      } else {
        document.getElementById('stats').innerHTML =
          '<p class="text-center text-danger">No data available for this player.</p>';
      }
    })
    .catch(() => {
      document.getElementById('stats').innerHTML =
        '<p class="text-center text-danger">Error fetching game data.</p>';
    });
}

function fetchUserInfo() {
  fetch(userInfoUrl)
    .then(response => response.json())
    .then(data => {
      const formattedUsername = data?.main?.username_cc || nickname;
      const rank = data?.main?.rank || null;

      if (rank === 'PLUS') {
        document.getElementById(
          'pageTitle'
        ).innerHTML = `<span style="color: #55FF55;">${formattedUsername}</span> Stats`;
      } else if (rank === 'HIVE_TEAM') {
        document.getElementById(
          'pageTitle'
        ).innerHTML = `<span style="color:rgb(255, 255, 32);">${formattedUsername}</span> Stats`;
      } else {
        document.getElementById(
          'pageTitle'
        ).innerText = `${formattedUsername} Stats`;
      }
    })
    .catch(() => {
      document.getElementById('pageTitle').innerText = `${nickname} Stats`;
    });
}

function fetchGameMeta() {
  fetch(gameMetaUrl)
    .then(response => response.json())
    .then(data => {
      if (data) {
        gameMetaData = data;
        displayPlayerLevel();
      }
    })
    .catch(() => {
      console.error('Error fetching game metadata.');
    });
}

function displayPlayerLevel() {
  if (!gameMetaData || !playerData) return;

  const xp = playerData.xp ?? 0;
  let level = 0;

  for (const [xpThreshold, levelNum] of Object.entries(
    gameMetaData.experienceToLevel
  )) {
    if (xp >= xpThreshold) {
      level = levelNum + 1;
    } else {
      break;
    }
  }

  const statsContainer = document.getElementById('stats');
  const levelCard = document.createElement('div');
  levelCard.classList.add('col-md-4', 'my-2');
  levelCard.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Level</h5>
        <p class="card-text">${level}</p>
      </div>
    </div>
  `;
  statsContainer.insertBefore(levelCard, statsContainer.firstChild);
}

function displayStats(data) {
  console.log(data);

  const statsContainer = document.getElementById('stats');
  const gameData = gameMode === 'main' ? data.main : data;

  if (!gameData) {
    statsContainer.innerHTML =
      '<p class="text-center text-danger">No data available for this player.</p>';
    return;
  }

  if (gameMode !== 'main') {
    if (!data.xp) {
      document.getElementById('downloadBtn').style.display = 'none';
      statsContainer.innerHTML =
        '<p class="text-center text-warning">This player hasnt played yet.</p>';
      return;
    }
  }

  const wins = gameData.victories ?? 0;
  const played = gameData.played ?? 0;
  const kills = gameData.kills ?? 0;
  const deaths = gameData.deaths ?? 0;

  const losses = played - wins;
  const lossesWlr = losses > 0 ? (100 * (wins / played)).toFixed(3) : 'N/A';
  const kdr = deaths > 0 ? (kills / deaths).toFixed(3) : 'N/A';

  presets[gameMode].forEach(preset => {
    let fieldValue = gameData[preset.field] ?? 'N/A';
    if (preset.field === 'equipped_avatar' && gameData[preset.field]?.name) {
      fieldValue = gameData[preset.field].name;
    }

    const statElement = document.createElement('div');
    statElement.classList.add('col-md-4', 'my-2');
    statElement.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${preset.label}</h5>
        <p class="card-text">${fieldValue}</p>
      </div>
    </div>
  `;
    statsContainer.appendChild(statElement);
  });

  if (gameMode !== 'main') {
    const statElementLosses = document.createElement('div');
    statElementLosses.classList.add('col-md-4', 'my-2');
    statElementLosses.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Losses</h5>
        <p class="card-text">${losses}</p>
      </div>
    </div>
  `;
    statsContainer.appendChild(statElementLosses);

    const statElementWlr = document.createElement('div');
    statElementWlr.classList.add('col-md-4', 'my-2');
    statElementWlr.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">WLR</h5>
        <p class="card-text">${lossesWlr}%</p>
      </div>
    </div>
  `;
    statsContainer.appendChild(statElementWlr);

    const statElementKdr = document.createElement('div');
    statElementKdr.classList.add('col-md-4', 'my-2');
    statElementKdr.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">KDR</h5>
        <p class="card-text">${kdr}</p>
      </div>
    </div>
  `;
    statsContainer.appendChild(statElementKdr);
  }

  playerData = gameData;
}

function downloadData() {
  const dataStr = JSON.stringify(playerData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nickname}_${gameMode}stats.json`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('downloadBtn').addEventListener('click', downloadData);

fetchPlayerData();
