// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView, PokemonErrorBoundary} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!pokemonName) return;

    setPokemon(null);
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon(pokemonData);
      }
    ).catch(error => setError(error));
    
  }, [pokemonName])

  if (error) return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )

  if (pokemonName && !pokemon) return <PokemonInfoFallback name={pokemonName}/>

  if (pokemon) return <PokemonDataView pokemon={pokemon}/>

  return 'Submit a pokemon'
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
