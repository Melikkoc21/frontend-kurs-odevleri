import { useState } from 'react';
import { dealTeams, getArtworkUrl, getTeamExperience } from './pokemon.js';

function PokemonCard({ pokemon }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="pokemon-card">
      <h3>Pokemon</h3>
      <div className={'pokemon-art ' + pokemon.type}>
        {!imageFailed ? (
          <img
            src={getArtworkUrl(pokemon.id)}
            alt={'Pokemon, ' + pokemon.type + ' type'}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="image-fallback" aria-label={'Pokemon number ' + pokemon.id}>
            <span>{String(pokemon.id).padStart(3, '0')}</span>
            <b>Pokémon</b>
          </div>
        )}
      </div>
      <div className="pokemon-details">
        <span>Type: {pokemon.type}</span>
        <span>Exp: {pokemon.exp}</span>
      </div>
    </article>
  );
}

function Team({ title, team, winning }) {
  const totalExperience = getTeamExperience(team);
  return (
    <section className="team-section">
      <h2 className={winning ? 'winner-title' : 'loser-title'}>{title}</h2>
      <p className="team-total">Total Experience: <strong>{totalExperience}</strong></p>
      <div className="pokemon-grid">
        {team.map((pokemon) => <PokemonCard key={pokemon.id} pokemon={pokemon} />)}
      </div>
    </section>
  );
}

export default function App() {
  const [teams] = useState(dealTeams);
  const [first, second] = teams;
  const firstWins = getTeamExperience(first) >= getTeamExperience(second);
  const winners = firstWins ? first : second;
  const losers = firstWins ? second : first;

  return (
    <main className="page">
      <h1>Pokemon Go Card Game</h1>
      <Team title="Winning Player" team={winners} winning />
      <Team title="Losing Player" team={losers} winning={false} />
      <footer className="page-footer">Refresh the page to shuffle the teams and play again.</footer>
    </main>
  );
}
