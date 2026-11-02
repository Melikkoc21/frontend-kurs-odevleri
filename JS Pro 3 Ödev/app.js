const form = document.querySelector('#search-form');
const input = document.querySelector('#username-input');
const result = document.querySelector('#result');
const searchButton = document.querySelector('.search-button');

const icons = {
  followers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2z"></path><circle cx="9" cy="7" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  following: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21v-1a8 8 0 0 1 16 0v1"></path></svg>',
  repositories: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a2 2 0 0 1 2 2v17l-8-4-8 4V5a2 2 0 0 1 2-2z"></path></svg>',
};

function setBusy(isBusy) {
  result.setAttribute('aria-busy', String(isBusy));
  searchButton.disabled = isBusy;
}

function renderStatus(message, isLoading = false) {
  result.replaceChildren();
  const panel = document.createElement('div');
  panel.className = isLoading ? 'status-card loading' : 'status-card';
  const heading = document.createElement('h2');
  if (isLoading) {
    const spinner = document.createElement('span');
    spinner.className = 'spinner';
    spinner.setAttribute('aria-hidden', 'true');
    heading.append(spinner);
  }
  const text = document.createElement('span');
  text.textContent = message;
  heading.append(text);
  panel.append(heading);
  result.append(panel);
}

function makeStat(value, label, icon, href) {
  const link = document.createElement('a');
  link.className = 'stat-link';
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = '<span class="stat-top">' + icon + '<span></span></span><span class="stat-label"></span>';
  link.querySelector('.stat-top span').textContent = value;
  link.querySelector('.stat-label').textContent = label;
  return link;
}

function renderProfile(user) {
  result.replaceChildren();

  const card = document.createElement('article');
  card.className = 'profile-card';

  const avatarFrame = document.createElement('div');
  avatarFrame.className = 'avatar-frame';
  const avatar = document.createElement('img');
  avatar.src = user.avatar_url;
  avatar.alt = (user.name || user.login) + ' profil fotoğrafı';
  avatar.referrerPolicy = 'no-referrer';
  avatarFrame.append(avatar);

  const name = document.createElement('h1');
  name.className = 'profile-name';
  name.textContent = user.name || user.login;

  const login = document.createElement('a');
  login.className = 'profile-login';
  login.href = user.html_url;
  login.target = '_blank';
  login.rel = 'noopener noreferrer';
  login.textContent = '@' + user.login;

  const divider = document.createElement('div');
  divider.className = 'profile-divider';
  divider.setAttribute('aria-hidden', 'true');

  const stats = document.createElement('div');
  stats.className = 'profile-stats';
  stats.append(
    makeStat(user.followers, 'Followers', icons.followers, user.html_url + '?tab=followers'),
    makeStat(user.following, 'Following', icons.following, user.html_url + '?tab=following'),
    makeStat(user.public_repos, user.public_repos === 1 ? 'Repository' : 'Repository', icons.repositories, user.html_url + '?tab=repositories'),
  );

  card.append(avatarFrame, name, login, divider, stats);
  result.append(card);
}

async function getUser(username) {
  setBusy(true);
  renderStatus('GitHub kullanıcısı aranıyor…', true);

  try {
    if (!window.axios) throw new Error('Axios yüklenemedi. İnternet bağlantısını kontrol edip tekrar dene.');
    const { data } = await axios.get('https://api.github.com/users/' + encodeURIComponent(username), {
      headers: { Accept: 'application/vnd.github+json' },
      timeout: 12000,
    });
    renderProfile(data);
  } catch (error) {
    const message = error.response?.status === 404
      ? 'Bu kullanıcı bulunamadı. Kullanıcı adını kontrol edip tekrar dene.'
      : error.response?.status === 403
        ? 'GitHub arama sınırına ulaşıldı. Biraz bekleyip tekrar dene.'
        : error.message || 'Profil alınamadı. Bağlantını kontrol edip tekrar dene.';
    renderStatus(message);
  } finally {
    setBusy(false);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = input.value.trim();
  if (!username) {
    input.focus();
    renderStatus('Aramak için bir GitHub kullanıcı adı yaz.');
    return;
  }
  getUser(username);
});

input.value = 'Melikkoc21';
getUser(input.value);
