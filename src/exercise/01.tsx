// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {useEffect} from 'react'

type State = {
  count: number
}

type IncrementAction = {
  type: 'INCREMENT'
  step: number
}
type Action = IncrementAction

function reducer(state: State, action: Action) {
  // const addedState = typeof payload === 'function' ? payload(state) : payload;
  const {type, step} = action
  switch (type) {
    case 'INCREMENT':
      return {...state, count: state.count + step}
    default:
      return state
  }
}

type CounterProps = {
  initialCount?: number
  step?: number
}

function Counter({initialCount = 0, step = 1}: CounterProps) {
  const initialState = {
    count: initialCount,
  }
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const increment = () => dispatch({type: 'INCREMENT', step})
  return <button onClick={increment}>a {state.count}</button>
}

function App() {
  return <Counter />
}

export default App
