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
    .then(response => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch game metadata. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        gameMetaData = data;
        displayPlayerLevel();
        displayPlayerEfficiency();
      }
    })
    .catch(error => {
      console.error('Error fetching game metadata:', error);
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

function displayPlayerEfficiency() {
  if (!gameMetaData || !playerData) return;

  let efficiency = 0;
  const statsContainer = document.getElementById('stats');

  if (gameMode === 'bed') {
    console.log('bed');
    const kills = playerData.kills ?? 0;
    const finalKills = playerData.final_kills ?? 0;
    const bedsDestroyed = playerData.beds_destroyed ?? 0;
    const played = playerData.played ?? 0;

    const killProbability = 0.2 * (kills / played);
    const finalKillProbability = 0.3 * (finalKills / played);
    const bedDestructionProbability = 0.4 * (bedsDestroyed / played);

    efficiency =
      100 *
      (parseFloat(killProbability) +
        parseFloat(finalKillProbability) +
        parseFloat(bedDestructionProbability));
  } else if (gameMode === 'wars') {
    console.log('wars');
    const kills = playerData.kills ?? 0;
    const finalKills = playerData.final_kills ?? 0;
    const treasuresDestroyed = playerData.treasure_destroyed ?? 0;
    const played = playerData.played ?? 0;

    const killProbability = 0.2 * (kills / played);
    const finalKillProbability = 0.3 * (finalKills / played);
    const treasureProbability = 0.4 * (treasuresDestroyed / played);

    efficiency =
      100 *
      (parseFloat(killProbability) +
        parseFloat(finalKillProbability) +
        parseFloat(treasureProbability));
  } else if (gameMode === 'sky') {
    console.log('sky');
    const kills = playerData.kills ?? 0;
    const mysteryChestsDestroyed = playerData.mystery_chests_destroyed ?? 0;
    const oresMined = playerData.ores_mined ?? 0;
    const played = playerData.played ?? 0;

    const killProbability = 0.25 * (kills / played);
    const mysteryChestProbability = 0.2 * (mysteryChestsDestroyed / played);
    const oresMinedProbability = 0.15 * (oresMined / played);

    efficiency =
      100 *
      (parseFloat(killProbability) +
        parseFloat(mysteryChestProbability) +
        parseFloat(oresMinedProbability));
  } else if (gameMode === 'murder') {
    console.log('murder');
    const murders = playerData.murders ?? 0;
    const murderer_eliminations = playerData.murderer_eliminations ?? 0;
    const victories = playerData.victories ?? 0;
    const played = playerData.played ?? 0;

    const murderProbability = 0.4 * (murders / played);
    const murdererEliminationProbability =
      1.5 * (murderer_eliminations / played);
    const victoriesProbability = 0.4 * (victories / played);

    efficiency =
      100 *
      (parseFloat(murderProbability) +
        parseFloat(murdererEliminationProbability) +
        parseFloat(victoriesProbability));
  } else if (gameMode === 'dr') {
    console.log('dr');
    const kills = playerData.kills ?? 0;
    const activatedTraps = playerData.activated ?? 0;
    const victories = playerData.victories ?? 0;
    const played = playerData.played ?? 0;

    const killProbability = 0.4 * (kills / played);
    const activatedTrapsProbability = 0.5 * (activatedTraps / played);
    const victoriesProbability = 0.3 * (victories / played);

    efficiency =
      100 *
      (parseFloat(killProbability) +
        parseFloat(activatedTrapsProbability) +
        parseFloat(victoriesProbability));
  } else if (gameMode === 'party') {
    console.log('party');
    const powerupsCollected = playerData.powerups_collected ?? 0;
    const roundsSurvived = playerData.powerups_collected ?? 0;
    const victories = playerData.victories ?? 0;
    const played = playerData.played ?? 0;

    const powerupsCollectedProbability = 0.1 * (powerupsCollected / played);
    const roundsSurvivedProbability = 0.05 * (roundsSurvived / played);
    const victoriesProbability = 0.4 * (victories / played);

    efficiency =
      100 *
      (parseFloat(powerupsCollectedProbability) +
        parseFloat(roundsSurvivedProbability) +
        parseFloat(victoriesProbability));
  } else if (gameMode === 'ground') {
    console.log('party');
    const blocksDestroyed = playerData.blocks_destroyed ?? 0;
    const projectilesFired = playerData.projectiles_fired ?? 0;
    const victories = playerData.victories ?? 0;
    const played = playerData.played ?? 0;

    const blocksDestroyedProbability = 0.005 * (blocksDestroyed / played);
    const projectilesFiredProbability = 0.008 * (projectilesFired / played);
    const victoriesProbability = 0.4 * (victories / played);

    efficiency =
      100 *
      (parseFloat(blocksDestroyedProbability) +
        parseFloat(projectilesFiredProbability) +
        parseFloat(victoriesProbability));
  } else {
    efficiency = 0;
  }

  const efficiencyCard = document.createElement('div');
  efficiencyCard.classList.add('col-md-4', 'my-2');
  efficiencyCard.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Efficiency</h5>
        <p class="card-text efficiency">${efficiency.toFixed(3)}</p>
      </div>
    </div>
  `;

  statsContainer.insertBefore(efficiencyCard, statsContainer.children[1]);

  const efficiencyElement = efficiencyCard.querySelector('.efficiency');

  if (efficiency < 50) {
    efficiencyElement.style.color = 'red';
  } else if (efficiency >= 50 && efficiency < 85) {
    efficiencyElement.style.color = 'yellow';
  } else if (efficiency >= 85) {
    efficiencyElement.style.color = 'green';
  }

  statsContainer.insertBefore(efficiencyCard, statsContainer.children[1]);
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
  const murders = gameData.murders ?? 0;

  const losses = played - wins;
  const lossesWlr = losses > 0 ? (100 * (wins / played)).toFixed(3) : 'N/A';
  const kdr = deaths > 0 ? (kills / deaths).toFixed(3) : 'N/A';
  const kdrMurder = murders > 0 ? (murders / deaths).toFixed(3) : 'N/A';

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

    if (gameMode !== 'murder') {
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
    } else {
      const statElementKdrMurder = document.createElement('div');
      statElementKdrMurder.classList.add('col-md-4', 'my-2');
      statElementKdrMurder.innerHTML = ` 
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">KDR</h5>
        <p class="card-text">${kdrMurder}</p>
      </div>
    </div>
  `;
      statsContainer.appendChild(statElementKdrMurder);
    }
  }

  playerData = gameData;
}

function downloadData() {
  const dataWithGameMode = {
    date: new Date().toISOString(),
    gameMode: gameMode,
    playerName: nickname,
    playerData: playerData,
  };

  const dataStr = JSON.stringify(dataWithGameMode, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `${nickname}_${gameMode}_stats.json`;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('downloadBtn').addEventListener('click', downloadData);

fetchPlayerData();
