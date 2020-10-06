# 🌅 useViewport()

[<img src="https://img.shields.io/npm/v/use-viewport" alt="" />](https://www.npmjs.com/package/use-viewport) [<img src="https://img.shields.io/bundlephobia/minzip/use-viewport" alt="" />](https://bundlephobia.com/result?p=use-viewport)

useViewport() provides a hook with the current window size and convenient functions to help building responsive apps.

## Usage

Add it to your project:

```console
yarn add use-viewport
```

Use it in your React app:

```jsx
// App.js

import React from 'react'
import { ViewportProvider, useViewport } from 'use-viewport'

function App() {
  return (
    <ViewportProvider>
      <h1>useViewport</h1>
      <ViewportSize />
    </ViewportProvider>
  )
}

function ViewportSize() {
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

export default App
```

## API

### &lt;ViewportProvider />

This is the provider component. It should be placed above any component using `useViewport()`.

Apart from `children` it accepts the following props:

##### throttle

The interval in ms for window updates. Defaults to `100`.

### useViewport()

This is the hook to be used throughout the app.

It takes no parameters and returns the following:

- `width`: The current screen width.
- `height`: The current screen height.
- `within(min, max)`: A function that returns `true` if the viewport width is between `min` and `max`. `min` and `max` can be any number, or one of the available breakpoints. If -1 is passed as min or max, there will be no minimum or maximum.
- `above(x)`: Returns `true` if the viewport width is above `x`, `false` otherwise.
- `below(x)`: Returns `true` if the viewport width is below `x`, `false` otherwise.
- `breakpoints`: An object that contains the number values of the different recommended breakpoints. It can be useful to set these values in CSS, for example.
