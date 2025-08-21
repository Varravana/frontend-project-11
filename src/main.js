import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>RSS агрегатор</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>

  </div>
`

setupCounter(document.querySelector('#counter'))
