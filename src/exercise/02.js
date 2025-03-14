// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { useEffect, useState } from 'react'

function Greeting({initialName = ''}) {
  const useLocalStorageState = (
    key, 
    intitialValue = null, 
    {serialize = JSON.stringify, deserialize = JSON.parse} = {},
  ) => {
    const [state, setState] = useState(
      () => {
        const valueInLocalStorage = window.localStorage.getItem(key);
        return valueInLocalStorage ? deserialize(valueInLocalStorage) : 
        typeof intitialValue === 'function' ? intitialValue() : intitialValue;
      }
    )

    const prevKeyRef = React.useRef(key);

    useEffect(() => {
      const prevKey = prevKeyRef.current
      if (prevKey !== key) {
        window.localStorage.removeItem(prevKey)
      }
      prevKeyRef.current = key
      window.localStorage.setItem(key, serialize(state))
    }, [key, state, serialize]);

    return [state, setState];
  }

  const [name, setName] = useLocalStorageState('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='George'/>
}

export default App
