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
import {createContext, useContext, useReducer} from 'react'

type PokemonCache = {
  [pokemonName: string]: Pokemon
}
type PokemonCacheContextType =
  | [cache: PokemonCache, dispatch: React.Dispatch<PokemonAction>]
  | null
const PokemonCacheContext = createContext<PokemonCacheContextType>(null)
type PokemonCacheProviderProps = {
  children: React.ReactNode
}
function PokemonCacheProvider({children}: PokemonCacheProviderProps) {
  const [cache, dispatch] = useReducer(pokemonCacheReducer, {})
  return (
    <PokemonCacheContext.Provider value={[cache, dispatch]}>
      {children}
    </PokemonCacheContext.Provider>
  )
}

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

function usePokemonContext() {
  const context = useContext(PokemonCacheContext)
  if (!context) {
    throw new Error(
      'usePokemonContext must be used within a PokemonCacheProvider',
    )
  }
  return context
}

type PokemonInfoProps = {
  pokemonName: string
}
function PokemonInfo({pokemonName}: PokemonInfoProps) {
  const [cache, dispatch] = usePokemonContext()

  const {data: pokemon, status, error, run, setData} = useAsync<Pokemon>()

  React.useEffect(() => {
    if (!pokemonName) {
      return
    } else if (cache[pokemonName]) {
      console.log('from cache!')
      setData(cache[pokemonName])
    } else {
      console.log('fetch!')
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
  const [cache] = usePokemonContext()
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
  return (
    <PokemonCacheProvider>
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
    </PokemonCacheProvider>
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
