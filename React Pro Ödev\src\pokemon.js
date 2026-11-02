const pokemonData = [
  { id: 1, type: 'grass', exp: 64 }, { id: 2, type: 'grass', exp: 142 }, { id: 3, type: 'grass', exp: 263 },
  { id: 4, type: 'fire', exp: 62 }, { id: 5, type: 'fire', exp: 142 }, { id: 6, type: 'fire', exp: 267 },
  { id: 7, type: 'water', exp: 63 }, { id: 8, type: 'water', exp: 142 }, { id: 9, type: 'water', exp: 265 },
  { id: 10, type: 'bug', exp: 39 }, { id: 12, type: 'flying', exp: 178 }, { id: 16, type: 'flying', exp: 50 },
  { id: 25, type: 'electric', exp: 112 }, { id: 39, type: 'fairy', exp: 95 }, { id: 52, type: 'normal', exp: 58 },
  { id: 58, type: 'fire', exp: 70 }, { id: 74, type: 'rock', exp: 60 }, { id: 94, type: 'poison', exp: 225 },
  { id: 133, type: 'normal', exp: 65 }, { id: 150, type: 'psychic', exp: 340 },
];

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealTeams() {
  const cards = shuffle(pokemonData).slice(0, 8);
  return [cards.slice(0, 4), cards.slice(4, 8)];
}

export function getTeamExperience(team) {
  return team.reduce((total, pokemon) => total + pokemon.exp, 0);
}

export function getArtworkUrl(id) {
  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + id + '.png';
}
