// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function countReducer(state, payload) {
  // const addedState = typeof payload === 'function' ? payload(state) : payload;
  const {action, step} = payload
  switch ('INCREMENT') {
    case action:
      return {...state, count: state.count + step}
    default:
      return state
  }
}

function Counter({initialCount = 0, step = 1}) {
  const [state, dispatch] = React.useReducer(
    countReducer,
    {
      count: initialCount,
    },
    i => i,
  )

  const increment = () => dispatch({action: 'INCREMENT', step})
  return <button onClick={increment}>a {state.count}</button>
}

function App() {
  return <Counter />
}

export default App
