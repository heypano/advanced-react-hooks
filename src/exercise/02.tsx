// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {useEffect, useReducer, useState} from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonErrorBoundary,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

enum StatusType {
  idle = 'idle',
  pending = 'pending',
  resolved = 'resolved',
  rejected = 'rejected',
}
type Pokemon = unknown

type State = {
  status: StatusType
  pokemon?: Pokemon | null
  error?: Error | null
}

type BaseAction = {type: string}

type Action =
  | {
      type: StatusType.pending
    }
  | {
      type: StatusType.resolved
      pokemon: Pokemon
    }
  | {
      type: StatusType.rejected
      error: Error
    }

// 🐨 this is going to be our generic asyncReducer
function pokemonInfoReducer(state: State, action: Action) {
  switch (action.type) {
    case StatusType.pending: {
      // 🐨 replace "pokemon" with "data"
      return {status: StatusType.pending, pokemon: null, error: null}
    }
    case StatusType.resolved: {
      // 🐨 replace "pokemon" with "data" (in the action too!)
      return {
        status: StatusType.resolved,
        pokemon: action.pokemon,
        error: null,
      }
    }
    case 'rejected': {
      // 🐨 replace "pokemon" with "data"
      return {
        status: StatusType.rejected,
        pokemon: null,
        error: action.error,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as BaseAction).type}`)
    }
  }
}

type PokemonInfoProps = {
  pokemonName: string
}

function PokemonInfo({pokemonName}: PokemonInfoProps) {
  // 🐨 move all the code between the lines into a new useAsync function.
  // 💰 look below to see how the useAsync hook is supposed to be called
  // 💰 If you want some help, here's the function signature (or delete this
  // comment really quick if you don't want the spoiler)!

  // -------------------------- start --------------------------
  const initialState = {
    status: pokemonName ? StatusType.pending : StatusType.idle,
    // 🐨 this will need to be "data" instead of "pokemon"
    pokemon: null,
    error: null,
  }

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(
    pokemonInfoReducer,
    initialState,
  )

  React.useEffect(() => {
    // 💰 this first early-exit bit is a little tricky, so let me give you a hint:
    // const promise = asyncCallback()
    // if (!promise) {
    //   return
    // }
    // then you can dispatch and handle the promise etc...
    if (!pokemonName) {
      return
    }
    dispatch({type: StatusType.pending})
    fetchPokemon(pokemonName).then(
      pokemon => {
        dispatch({type: StatusType.resolved, pokemon})
      },
      error => {
        dispatch({type: StatusType.rejected, error})
      },
    )
    // 🐨 you'll accept dependencies as an array and pass that here.
    // 🐨 because of limitations with ESLint, you'll need to ignore
    // the react-hooks/exhaustive-deps rule. We'll fix this in an extra credit.
  }, [pokemonName])
  // --------------------------- end ---------------------------

  // 🐨 here's how you'll use the new useAsync hook you're writing:
  // const state = useAsync(() => {
  //   if (!pokemonName) {
  //     return
  //   }
  //   return fetchPokemon(pokemonName)
  // }, {/* initial state */}, [pokemonName])
  // 🐨 this will change from "pokemon" to "data"
  const {pokemon, status, error} = state

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonErrorBoundary onReset={handleReset} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </PokemonErrorBoundary>
      </div>
    </div>
  )
}

function AppWithUnmountCheckbox() {
  const [mountApp, setMountApp] = React.useState(true)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={mountApp}
          onChange={e => setMountApp(e.target.checked)}
        />{' '}
        Mount Component
      </label>
      <hr />
      {mountApp ? <App /> : null}
    </div>
  )
}

export default AppWithUnmountCheckbox
