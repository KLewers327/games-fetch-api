// API: "https://www.freetogame.com/api/games"

const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const sortSelect = document.querySelector('#sortSelect');
const gamesGrid = document.querySelector('#gamesGrid');
const resultsInfo = document.querySelector('#resultsInfo');

let allGames = [];
const maxGamesPerPage = 24;

function showLoader() {
  resultsInfo.innerHTML = '<span>Showing: </span>Loading games...';
  gamesGrid.innerHTML = `
    <div class="loader-screen" role="status">
      <div class="rotating-dot-track"></div>
      <p>Loading games...</p>
    </div>
  `;
}

async function loadGames() {
  showLoader();
  try {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch('https://www.freetogame.com/api/games');
    allGames = await response.json();
    updateView();
  } catch (error) {
    resultsInfo.innerHTML = '<span>Error: </span>Could not load games.';
    gamesGrid.innerHTML = '<p role="alert">Could not load games. Please try again later.</p>';
    console.error(error);
  }
}

function updateView() {
  const searchQuery = searchInput.value.trim().toLowerCase();
  const sortOrder = sortSelect.value;

  const filteredGames = allGames.filter((game) => 
    game.title.toLowerCase().includes(searchQuery) || 
    game.genre.trim().toLowerCase().includes(searchQuery)
  );

  const sortFunctions = {
    'a-z': (a, b) => a.title.localeCompare(b.title),
    'z-a': (a, b) => b.title.localeCompare(a.title),
    'newest': (a, b) => new Date(b.release_date) - new Date(a.release_date),
    'oldest': (a, b) => new Date(a.release_date) - new Date(b.release_date),
  };

  if (sortFunctions[sortOrder]) filteredGames.sort(sortFunctions[sortOrder]);

  const visibleGames = filteredGames.slice(0, maxGamesPerPage);

  resultsInfo.innerHTML = `<span>Showing: </span>${visibleGames.length} of ${filteredGames.length} games`;

  gamesGrid.innerHTML = visibleGames.length
    ? visibleGames.map((game) => `
        <a href="${game.game_url}" target="_blank" rel="noopener noreferrer" class="game-card">
          ${game.thumbnail 
            ? `<img src="${game.thumbnail}" alt="${game.title}" loading="lazy">` 
            : `<div class="game-card__cover-placeholder">Game Cover <br> Not Available</div>`}
          <h2 class="game-card__title">${game.title}</h2>
          <p class="game-card__genre">${game.genre.trim()} • ${game.platform}</p>
          <p class="game-card__release-date">Released: ${game.release_date}</p>
        </a>
      `).join('')
    : `<p>No games found matching "${searchInput.value}".</p>`;
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateView();
});

searchInput.addEventListener('input', updateView);
sortSelect.addEventListener('change', updateView);

loadGames();
