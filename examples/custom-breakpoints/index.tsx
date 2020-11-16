import React from 'react'
import ReactDOM from 'react-dom'
import { ViewportProvider, useViewport } from 'use-viewport'

const BREAKPOINTS = {
  alpha: 500,
  beta: 1000,
  gamma: 1500,
}

function App() {
  return (
    <ViewportProvider breakpoints={BREAKPOINTS}>
      <Content />
    </ViewportProvider>
  )
}

function Content() {
  const { width, height, within, below, above, breakpoints } = useViewport()

  return (
    <div>
      {below('beta') && <div>alpha</div>}
      {within('beta', 'gamma') && <div>beta</div>}
      {above('gamma') && <div>gamma</div>}
      <p>
        Current screen width is {width}px and the height is {height}px
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {Object.keys(breakpoints).map((key) => (
          <li key={key}>
            {key}: {breakpoints[key]}px
          </li>
        ))}
      </ul>
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
