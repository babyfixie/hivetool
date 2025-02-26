import { presets } from './presets.js';

const urlParams = new URLSearchParams(window.location.search);
const gameMode = urlParams.get('gameMode');
const nickname = urlParams.get('nickname');
const apiUrl = `https://api.playhive.com/v0/game/all/${gameMode}/${nickname}`;

let playerData = null;

function displayStats(data) {
  const statsContainer = document.getElementById('stats');

  const gameData = gameMode === 'main' ? data.main : data;

  if (!gameData) {
    statsContainer.innerHTML =
      '<p class="text-center text-danger">No data available for this player.</p>';
    return;
  }

  const wins = gameData.victories ?? 0;
  const played = gameData.played ?? 0;
  const kills = gameData.kills ?? 0;
  const deaths = gameData.deaths ?? 0;

  const losses = played - wins;
  const lossesWlr = losses > 0 ? (100 * (wins / played)).toFixed(5) : 'N/A';
  const kdr = deaths > 0 ? (kills / deaths).toFixed(5) : 'N/A';

  presets[gameMode].forEach(preset => {
    let fieldValue = 'N/A'; // Значение по умолчанию

    if (gameData[preset.field] !== undefined) {
      if (
        preset.field === 'equipped_avatar' &&
        gameData[preset.field] &&
        gameData[preset.field].name
      ) {
        // Если поле "equipped_avatar" существует и в нем есть поле "name"
        fieldValue = gameData[preset.field].name;
      } else {
        // В другом случае просто берем значение
        fieldValue = gameData[preset.field];
      }
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
        <p class="card-text">${lossesWlr}</p>
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
  if (!playerData) {
    alert('No data available to download.');
    return;
  }

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

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (gameMode !== 'main' && !data.xp) {
      document.getElementById('stats').innerHTML =
        '<p class="text-center text-warning">Player hasn\'t played the game yet.</p>';
    } else if (data) {
      displayStats(data);
    } else {
      document.getElementById('stats').innerHTML =
        '<p class="text-center text-danger">No data available for this player.</p>';
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('stats').innerHTML =
      '<p class="text-center text-danger">Error fetching data.</p>';
  });
