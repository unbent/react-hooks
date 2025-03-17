// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary';

const statusType = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

const defaultState = {
  pokemon: null,
  error: null,
  status: statusType.idle,
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState(defaultState);
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }

    setState({status: statusType.pending});

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({pokemon, status: statusType.resolved});
      }
    ).catch(error => {
      setState({error, status: statusType.rejected});
    });
    
  }, [pokemonName])

  switch (status) {
    case statusType.rejected:
        throw error;
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

const ErrorFallbackComponent = ({error}) => (
  <div role="alert">
    There was an error:{' '}
    <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
  </div>
)

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
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
