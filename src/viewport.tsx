import React, {
  ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { DebouncedFunc } from 'lodash'
import lodashThrottle from 'lodash/throttle'
import { Breakpoints, DEFAULT_BREAKPOINTS } from './utils'

import {
  withinBreakpointRange,
  aboveBreakpoint,
  belowBreakpoint,
} from './utils'

type ProviderProps = {
  children: ReactNode
  breakpoints?: Breakpoints
  throttle?: number
}

type ViewportContextState = {
  width: number
  height: number
  breakpoints: Breakpoints
}

const HEADLESS_VIEWPORT_SIZE = { width: 0, height: 0 }

const isBrowser = typeof window !== 'undefined'
const ViewportContext = React.createContext<ViewportContextState | null>(null)

function getCurrentWindowSize() {
  return isBrowser
    ? { width: window.innerWidth, height: window.innerHeight }
    : HEADLESS_VIEWPORT_SIZE
}

export function ViewportProvider({
  throttle = 100,
  breakpoints = DEFAULT_BREAKPOINTS,
  children,
}: ProviderProps): JSX.Element {
  const [viewportSize, setViewportSize] = useState({
    breakpoints,
    ...getCurrentWindowSize(),
  })

  const throttleHandler = useRef<DebouncedFunc<() => void>>()

  // Avoid excessive re-renders if non-memoized object literal is provided via breakpoints prop
  const breakpointsAsValue = JSON.stringify(breakpoints)

  const updateWindowSize = useCallback(() => {
    setViewportSize({
      breakpoints,
      ...getCurrentWindowSize(),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpointsAsValue])

  const resizeStop = useCallback(() => {
    if (!throttleHandler.current) {
      return
    }

    if (isBrowser) {
      window.removeEventListener('resize', throttleHandler.current)
    }

    throttleHandler.current.cancel()
  }, [])

  const resizeStart = useCallback(() => {
    throttleHandler.current = lodashThrottle(updateWindowSize, throttle)

    updateWindowSize()

    if (isBrowser) {
      window.addEventListener('resize', throttleHandler.current)
    }
  }, [throttle, updateWindowSize])

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

type ViewportAttributes = ViewportContextState & {
  within: (min: string | number, max: string | number) => boolean
  above: (value: string | number) => boolean
  below: (value: string | number) => boolean
}

export function useViewport(): ViewportAttributes {
  const { width, height, breakpoints } = React.useContext(
    ViewportContext
  ) as ViewportContextState

  const within = useCallback(
    (min: string | number, max: string | number) =>
      withinBreakpointRange(min, max, width, breakpoints),
    [width, breakpoints]
  )

  const above = useCallback(
    (value: string | number) => aboveBreakpoint(value, width, breakpoints),
    [width, breakpoints]
  )

  const below = useCallback(
    (value: string | number) => belowBreakpoint(value, width, breakpoints),
    [width, breakpoints]
  )

  return { width, height, breakpoints, within, above, below }
}
