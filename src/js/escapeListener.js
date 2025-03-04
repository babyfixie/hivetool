document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;

  if (!currentPage.includes('stats.html')) {
    document.addEventListener('keydown', handleSearch);
  }

  function handleSearch(event) {
    if (event.key === 'Enter') {
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

      const statsUrl = `stats.html?gameMode=${gameMode}&nickname=${nickname}`;
      console.log('Redirecting to:', statsUrl);
      window.location.href = statsUrl;

      document.removeEventListener('keydown', handleSearch);
    }
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      window.location.href = 'index.html';
    }
  });
});
