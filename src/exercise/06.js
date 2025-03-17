// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonErrorBoundary} from '../pokemon'

const statusType = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null);
  const [status, setStatus] = React.useState(statusType.idle);

  React.useEffect(() => {
    if (!pokemonName) {
      setStatus(statusType.idle);
      return;
    }

    setStatus(statusType.pending);
    setPokemon(null);
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon(pokemonData);
        setStatus(statusType.resolved);
      }
    ).catch(error => {
      setError(error);
      setStatus(statusType.rejected);
    });
    
  }, [pokemonName])

  switch (status) {
    case statusType.rejected:
        return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    case statusType.pending:
      return <PokemonInfoFallback name={pokemonName}/>;
    case statusType.resolved:
      return <PokemonDataView pokemon={pokemon}/>
    case statusType.idle:
      return 'Submit a pokemon'
    default:
      throw new Error(`Error: Status "${status}" not recognized`);
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
