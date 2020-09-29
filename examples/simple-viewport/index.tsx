import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ViewportProvider, useViewport } from 'use-viewport'

function App() {
  const [throttleAmount, setThrottleAmount] = useState(100)

  return (
    <ViewportProvider throttle={throttleAmount}>
      <div>
        <Content />
        <label style={{ marginTop: '20px' }}>
          Throttle(ms){' '}
          <input
            value={throttleAmount}
            onChange={event => setThrottleAmount(Number(event.target.value))}
          />
        </label>
      </div>
    </ViewportProvider>
  )
}

function Content() {
  const { width, height, within, below, above } = useViewport()
  return (
    <div>
      {below('medium') && <div>small</div>}
      {within('medium', 'large') && <div>medium</div>}
      {above('large') && <div>large</div>}
      <p>
        Current screen width is {width}px and the height is {height}px
      </p>
    </div>
  )
}

ReactDOM.render(
  <>
    <App />
    <style>
      {`
        body {
          width: 100vw;
          height: 100vh;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: sans-serif;
          font-size: 18px;
          line-height: 1.5;
        }
        h1 {
          font-weight: 400;
        }
      `}
    </style>
  </>,
  document.getElementById('root')
)
