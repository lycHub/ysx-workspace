import { useState } from 'react'
import { plus } from '@dci/shared';
import './App.css'

function App() {
  console.log('plus', plus(1, 4))
  return (
    <div className="App">
      <h2>App</h2>
      <ul>
        <li>aa</li>
        <li>bb</li>
      </ul>
    </div>
  )
}

export default App
