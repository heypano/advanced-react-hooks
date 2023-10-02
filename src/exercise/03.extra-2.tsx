// useContext: Caching response data in context
// 💯 caching in a context provider (exercise)
// http://localhost:3000/isolated/exercise/03.extra-2.js

// you can edit this here and look at the isolated page or you can copy/paste
// this in the regular exercise file.

import * as React from 'react'
import {
  fetchPokemon,
  PokemonForm,
  PokemonDataView,
  PokemonInfoFallback,
  PokemonErrorBoundary,
  Pokemon,
} from '../pokemon'
import {useAsync} from '../utils'

// 🐨 Create a PokemonCacheContext

// 🐨 create a PokemonCacheProvider function
// 🐨 useReducer with pokemonCacheReducer in your PokemonCacheProvider
// 💰 you can grab the one that's in PokemonInfo
// 🐨 return your context provider with the value assigned to what you get back from useReducer
// 💰 value={[cache, dispatch]}
// 💰 make sure you forward the props.children!

type PokemonState = {
  [pokemonName: string]: Pokemon
}

type PokemonAction =
  | {
      type: 'ADD_POKEMON'
      pokemonName: string
      pokemonData: Pokemon
    }
  | {
      type: 'REMOVE_POKEMON'
      pokemonName: string
    }

type PokemonActionType = PokemonAction['type']

function pokemonCacheReducer(state: PokemonState, action: PokemonAction) {
  switch (action.type) {
    case 'ADD_POKEMON': {
      return {...state, [action.pokemonName]: action.pokemonData}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

type PokemonInfoProps = {
  pokemonName: string
}
function PokemonInfo({pokemonName}: PokemonInfoProps) {
  // 💣 remove the useReducer here (or move it up to your PokemonCacheProvider)
  const [cache, dispatch] = React.useReducer(pokemonCacheReducer, {})
  // 🐨 get the cache and dispatch from useContext with PokemonCacheContext

  const {data: pokemon, status, error, run, setData} = useAsync<Pokemon>()

  React.useEffect(() => {
    if (!pokemonName) {
      return
    } else if (cache[pokemonName]) {
      setData(cache[pokemonName])
    } else {
      run(
        fetchPokemon(pokemonName).then(pokemonData => {
          dispatch({type: 'ADD_POKEMON', pokemonName, pokemonData})
          return pokemonData
        }),
      )
    }
  }, [cache, pokemonName, run, setData])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    throw error
  } else if (status === 'resolved' && pokemon) {
    return <PokemonDataView pokemon={pokemon} />
  }
  throw "Unhandled pokemon status - this shouldn't happen"
}

type OnSelectCallback = (pokemonName: string) => void

type PreviousPokemonProps = {
  onSelect: OnSelectCallback
}
function PreviousPokemon({onSelect}: PreviousPokemonProps) {
  // 🐨 get the cache from useContext with PokemonCacheContext
  const cache = {}
  return (
    <div>
      Previous Pokemon
      <ul style={{listStyle: 'none', paddingLeft: 0}}>
        {Object.keys(cache).map(pokemonName => (
          <li key={pokemonName} style={{margin: '4px auto'}}>
            <button
              style={{width: '100%'}}
              onClick={() => onSelect(pokemonName)}
            >
              {pokemonName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type PokemonSectionProps = {
  onSelect: OnSelectCallback
  pokemonName: string
}
function PokemonSection({onSelect, pokemonName}: PokemonSectionProps) {
  // 🐨 wrap this in the PokemonCacheProvider so the PreviousPokemon
  // and PokemonInfo components have access to that context.
  return (
    <div style={{display: 'flex'}}>
      <PreviousPokemon onSelect={onSelect} />
      <div className="pokemon-info" style={{marginLeft: 10}}>
        <PokemonErrorBoundary
          onReset={() => onSelect('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState<string>('')

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  function handleSelect(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <PokemonSection onSelect={handleSelect} pokemonName={pokemonName} />
    </div>
  )
}

export default App
