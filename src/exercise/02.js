// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { useEffect, useState } from 'react'

function Greeting({initialName = ''}) {
  const useLocalStorageState = (key, initialName = '') => {
    const [state, setState] = useState(
      () => window.localStorage.getItem(key) ?? initialName
    )

    useEffect(() => {
      window.localStorage.setItem(key, state);
    }, [key, state]);

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
