const grid = document.querySelector('#movie-grid');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#movie-search');
const catalogNote = document.querySelector('#catalog-note');

let movies = [];

function makeMovieCard(movie, index) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.style.setProperty('--card-index', index);

  const posterWrap = document.createElement('div');
  posterWrap.className = 'poster-wrap';

  const poster = document.createElement('img');
  poster.className = 'movie-poster';
  poster.src = movie.poster;
  poster.alt = movie.title + ' poster';
  poster.loading = 'lazy';
  poster.onerror = () => {
    posterWrap.classList.add('poster-fallback');
    poster.remove();
  };

  const rating = document.createElement('span');
  rating.className = 'rating';
  rating.innerHTML = '<span aria-hidden="true">★</span> ' + Number(movie.rating).toFixed(1);

  const details = document.createElement('div');
  details.className = 'movie-overview';
  const genre = document.createElement('span');
  genre.className = 'movie-genre';
  genre.textContent = movie.genre + ' · ' + movie.year;
  const heading = document.createElement('h3');
  heading.textContent = movie.title;
  const overviewTitle = document.createElement('span');
  overviewTitle.className = 'overview-label';
  overviewTitle.textContent = 'Overview';
  const overview = document.createElement('p');
  overview.textContent = movie.overview;

  details.append(genre, heading, overviewTitle, overview);
  posterWrap.append(poster, rating, details);

  const footer = document.createElement('div');
  footer.className = 'movie-footer';
  const title = document.createElement('h2');
  title.textContent = movie.title;
  const score = document.createElement('span');
  score.className = 'movie-score';
  score.textContent = Number(movie.rating).toFixed(1);
  score.setAttribute('aria-label', 'Rating ' + Number(movie.rating).toFixed(1) + ' out of 10');
  footer.append(title, score);

  card.append(posterWrap, footer);
  return card;
}

function renderMovies(items) {
  grid.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<span class="empty-mark">0</span><h3>No movies found</h3><p>Try another title or clear your search.</p>';
    grid.append(empty);
    return;
  }
  items.forEach((movie, index) => grid.append(makeMovieCard(movie, index)));
}

function filterMovies(query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filtered = movies.filter((movie) => movie.title.toLocaleLowerCase().includes(normalizedQuery));
  renderMovies(filtered);
  catalogNote.textContent = normalizedQuery
    ? filtered.length + (filtered.length === 1 ? ' title found for ' : ' titles found for ') + '“' + query.trim() + '”'
    : 'A small collection of movies to get you started.';
}

async function loadMovies() {
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '<div class="loading-state"><span class="spinner" aria-hidden="true"></span><p>Gathering tonight’s picks…</p></div>';
  try {
    const response = await fetch('./data/movies.json');
    if (!response.ok) throw new Error('Movie list could not be loaded.');
    movies = await response.json();
    renderMovies(movies);
  } catch {
    grid.innerHTML = '<div class="empty-state"><span class="empty-mark">!</span><h3>We could not load the collection</h3><p>Run the project with Live Server, then refresh this page.</p></div>';
  } finally {
    grid.setAttribute('aria-busy', 'false');
  }
}

searchInput.addEventListener('input', (event) => filterMovies(event.target.value));
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  filterMovies(searchInput.value);
});
loadMovies();
