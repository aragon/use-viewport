import React, {
  ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { DebouncedFunc } from 'lodash'
import lodashThrottle from 'lodash/throttle'
import { BREAKPOINTS } from './utils'

import {
  withinBreakpointRange,
  aboveBreakpoint,
  belowBreakpoint,
} from './utils'

type ProviderProps = {
  children: ReactNode
  throttle?: number
}

const HEADLESS_VIEWPORT_SIZE = { width: 0, height: 0 }
const VIEWPORT_SIZE_BASE = {
  breakpoints: BREAKPOINTS,
  ...getCurrentWindowSize(),
}

const isBrowser = typeof window !== 'undefined'

const ViewportContext = React.createContext(VIEWPORT_SIZE_BASE)

function getCurrentWindowSize() {
  return isBrowser
    ? { width: window.innerWidth, height: window.innerHeight }
    : HEADLESS_VIEWPORT_SIZE
}

export function ViewportProvider({
  throttle = 100,
  children,
}: ProviderProps): JSX.Element {
  const [viewportSize, setViewportSize] = useState(VIEWPORT_SIZE_BASE)
  const throttleHandler = useRef<DebouncedFunc<() => void>>()

  const updateWindowSize = useCallback(() => {
    setViewportSize({
      ...VIEWPORT_SIZE_BASE,
      ...getCurrentWindowSize(),
    })
  }, [])

  const resizeStart = useCallback(() => {
    throttleHandler.current = lodashThrottle(updateWindowSize, throttle)

    updateWindowSize()

    if (isBrowser) {
      window.addEventListener('resize', throttleHandler.current)
    }
  }, [throttle, updateWindowSize])

  const resizeStop = useCallback(() => {
    if (!throttleHandler.current) {
      return
    }

    if (isBrowser) {
      window.removeEventListener('resize', throttleHandler.current)
    }

    throttleHandler.current.cancel()
  }, [])

  useEffect(() => {
    resizeStart()

    return () => {
      resizeStop()
    }
  }, [resizeStart, resizeStop])

  return (
    <ViewportContext.Provider value={viewportSize}>
      {children}
    </ViewportContext.Provider>
  )
}

type ViewportAttributes = typeof VIEWPORT_SIZE_BASE & {
  within: (min: string | number, max: string | number) => boolean
  above: (value: string | number) => boolean
  below: (value: string | number) => boolean
}

export function useViewport(): ViewportAttributes {
  const viewportSize = React.useContext(ViewportContext)
  const { width } = viewportSize

  const within = useCallback(
    (min: string | number, max: string | number) =>
      withinBreakpointRange(min, max, width),
    [width]
  )

  const above = useCallback(
    (value: string | number) => aboveBreakpoint(value, width),
    [width]
  )

  const below = useCallback(
    (value: string | number) => belowBreakpoint(value, width),
    [width]
  )

  return { ...viewportSize, within, above, below }
}
