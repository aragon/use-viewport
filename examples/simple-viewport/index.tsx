import 'react-app-polyfill/ie11'
import React from 'react'
import ReactDOM from 'react-dom'
import { ViewportProvider, useViewport } from 'use-viewport'

function App() {
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
  <ViewportProvider>
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
  </ViewportProvider>,
  document.getElementById('root')
)
