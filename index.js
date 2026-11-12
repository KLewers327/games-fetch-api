// API: "https://www.freetogame.com/api/games"

const form = document.querySelector('#searchForm');
const input = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');
const grid = document.querySelector('#gamesGrid');
const info = document.querySelector('#resultsInfo');

let allGames = [];

async function loadGames() {
  info.innerHTML = '<span>Showing: </span>Loading...';
  try {
    const res = await fetch('https://corsproxy.io');
    allGames = await res.json();
    updateView();
  } catch (err) {
    info.innerHTML = '<span>Error: </span>Could not load games.';
  }
}

function updateView() {
  const q = input.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let filtered = allGames.filter(function(g) {
    return g.title.toLowerCase().includes(q) || g.genre.toLowerCase().includes(q);
  });

  const sorters = {
    'a-z': (a, b) => a.title.localeCompare(b.title),
    'z-a': (a, b) => b.title.localeCompare(a.title),
    'newest': (a, b) => new Date(b.release_date) - new Date(a.release_date),
    'oldest': (a, b) => new Date(a.release_date) - new Date(b.release_date),
  };

  if (sorters[sort]) filtered.sort(sorters[sort]);

  info.innerHTML = `<span>Showing: </span>${filtered.length} games`;

  grid.innerHTML = filtered.length
    ? filtered.map(g => `
        <div class="game-card">
          ${g.thumbnail 
            ? `<img src="${g.thumbnail}" alt="${g.title}" loading="lazy">` 
            : `<div class="game-card__cover-placeholder">Game Cover <br> Not Available</div>`}
          <h2 class="game-card__title">${g.title}</h2>
          <p class="game-card__genre">${g.genre}</p>
        </div>
      `).join('')
    : `<p>No games found matching "${input.value}".</p>`;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  updateView();
});

input.addEventListener('input', updateView);
sortSelect.addEventListener('change', updateView);

loadGames();
