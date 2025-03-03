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
    /* if (gamemode === 'murder') {
      if (map.name === 'Backrooms') {
        map.image = 'https://cdn.playhive.com/maps/mm_backrooms.jpg';
      }

      if (map.name === 'Office') {
        map.image = 'https://cdn.playhive.com/maps/mm_office.jpg';
      }
    }

    if (gamemode === 'bed') {
      if (map.name === 'Monster Labs') {
        map.image = './img/no-image.jpg';
      }
    }

    if (gamemode === 'sky') {
      if (
        map.name === 'Pinecone Point' ||
        map.name === 'Wintergrove' ||
        map.name === 'Jungle'
      ) {
        map.image = './img/no-image.jpg';
      }
    }

    if (gamemode === 'wars') {
      if (map.name === 'Abandoned') {
        map.image = './img/no-image.jpg';
      }
    } */
    const mapImages = {
      murder: {
        Backrooms: 'https://cdn.playhive.com/maps/mm_backrooms.jpg',
        Office: 'https://cdn.playhive.com/maps/mm_office.jpg',
      },
      bed: {
        'Monster Labs': './img/no-image.jpg',
      },
      sky: {
        'Pinecone Point': './img/no-image.jpg',
        Wintergrove: './img/no-image.jpg',
        Jungle: './img/no-image.jpg',
      },
      wars: {
        Abandoned: './img/no-image.jpg',
      },
    };

    if (mapImages[gamemode] && mapImages[gamemode][map.name]) {
      map.image = mapImages[gamemode][map.name];
    }

    const cardHTML = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${map.image}" class="card-img-top" alt="${map.name}" />
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
