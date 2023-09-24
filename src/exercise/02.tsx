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

type Pokemon = {
  name: string
  number: string
  image: string
  attacks: {
    special: Array<{
      name: string
      type: string
      damage: number
    }>
  }
  fetchedAt: string
}

type AsyncState<T> = {
  status: StatusType
  data?: T | null
  error?: Error | null
}

type BaseAction = {type: string}

type Action<T> =
  | {
      type: StatusType.pending
    }
  | {
      type: StatusType.resolved
      data: T
    }
  | {
      type: StatusType.rejected
      error: Error
    }

// 🐨 this is going to be our generic asyncReducer
function asyncStateReducer<T>(
  state: AsyncState<T>,
  action: Action<T>,
): AsyncState<T> {
  switch (action.type) {
    case StatusType.pending: {
      return {status: StatusType.pending, data: null, error: null}
    }
    case StatusType.resolved: {
      return {
        status: StatusType.resolved,
        data: action.data,
        error: null,
      }
    }
    case 'rejected': {
      return {
        status: StatusType.rejected,
        data: null,
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

function useAsync<T>(
  getPromise: () => Promise<T> | undefined,
  initialState: Partial<AsyncState<T>> | undefined,
  deps: React.DependencyList,
): AsyncState<T> {
  const [state, dispatch] = useReducer<React.Reducer<AsyncState<T>, Action<T>>>(
    asyncStateReducer,
    {
      status: StatusType.idle,
      data: null,
      error: null,
      ...(initialState ?? {}),
    },
  )

  React.useEffect(() => {
    const promise = getPromise()
    if (promise) {
      console.log('Pending')
      dispatch({type: StatusType.pending})
      promise
        .then(data => {
          console.log('Resolved', data)
          dispatch({type: StatusType.resolved, data})
        })
        .catch(error => {
          console.log('Rejected', error)
          dispatch({type: StatusType.rejected, error})
        })
    } else {
      console.log('No promise')
    }
  }, deps)

  return state
}
function PokemonInfo({pokemonName}: PokemonInfoProps) {
  const initialState: AsyncState<Pokemon> = {
    status: pokemonName ? StatusType.pending : StatusType.idle,
  }

  const state = useAsync<Pokemon>(
    () => {
      if (!pokemonName) {
        return
      }
      return fetchPokemon(pokemonName) as Promise<Pokemon>
    },
    initialState,
    [pokemonName],
  )
  const {data: pokemon, status, error} = state

  switch (status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      if (!pokemon) {
        throw new Error('Fetch resolved with no pokemon')
      }
      return <PokemonDataView pokemon={pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T),
  // the = {} fixes the error we would get from destructuring when no argument was passed
  // Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
): [T, React.Dispatch<T>] {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function'
      ? (defaultValue as () => T)()
      : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  // Check the example at src/examples/local-state-key-change.js to visualize a key change
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function App() {
  const [pokemonName, setPokemonName] = useLocalStorageState('pokemonName', '')

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
