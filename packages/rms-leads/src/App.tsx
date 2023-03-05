import { useState } from 'react'
import { plus } from '@dci/shared';
import './App.scss'

function App() {
  console.log('plus', plus(1, 4));
  return (
    <div className="App">
      <h2>App s</h2>
      <ul>
        <li>aa</li>
        <li>bb</li>
      </ul>
    </div>
  )
}

export default App
