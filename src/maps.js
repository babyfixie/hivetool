async function fetchMaps() {
  const gamemode = document.getElementById('gameSelect').value;
  const mapType = document.getElementById('mapTypeSelect').value;
  const searchQuery = document.getElementById('nameSearch').value.toLowerCase();

  const response = await fetch(
    `https://api.playhive.com/v0/game/map/${gamemode}`
  );
  const maps = await response.json();

  const mapCardsContainer = document.getElementById('mapCards');
  mapCardsContainer.innerHTML = '';

  const filteredMaps = maps.filter(map => {
    const matchesType = mapType === 'all' || map.variant === mapType;
    const matchesSearch = map.name.toLowerCase().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  filteredMaps.forEach(map => {
    const mapImage = map.image || './img/no-image.jpg';

    const cardHTML = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img 
            src="${mapImage}" 
            class="card-img-top" 
            alt="${map.name}" 
            onerror="this.onerror=null; this.src='./img/no-image.jpg';"
          />
          <div class="card-body">
            <h5 class="card-title">${map.name}</h5>
            <p class="card-text">Variant: ${map.variant}</p>
          </div>
        </div>
      </div>
    `;
    mapCardsContainer.innerHTML += cardHTML;
  });
}

window.onload = fetchMaps;

document.getElementById('gameSelect').addEventListener('change', fetchMaps);
document.getElementById('mapTypeSelect').addEventListener('change', fetchMaps);
document.getElementById('nameSearch').addEventListener('input', fetchMaps);
