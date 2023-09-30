// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext
type CountContextType = [number, React.Dispatch<React.SetStateAction<number>>]

// The default value is used only when the provider is missing from the tree above.
const CountContext = React.createContext<CountContextType | null>(null)

type CountProviderProps = {
  children: React.ReactNode
}
const CountProvider = ({children}: CountProviderProps) => {
  const [count, setCount] = React.useState(0)
  return (
    <CountContext.Provider value={[count, setCount]}>
      {children}
    </CountContext.Provider>
  )
}

function CountDisplay() {
  const [count] = React.useContext(CountContext) as CountContextType
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  const [, setCount] = React.useContext(CountContext) as CountContextType
  const increment = () => setCount((c: number) => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
