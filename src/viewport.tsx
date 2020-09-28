import React, {
  ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect
} from 'react'
import { DebouncedFunc } from 'lodash'
import lodashThrottle from 'lodash/throttle'
import { BREAKPOINTS } from './utils'

interface Props {
  children: ReactNode
  throttle?: number
}

const HEADLESS_VIEWPORT_SIZE = { width: 0, height: 0 }
const VIEWPORT_SIZE_BASE = {
  breakpoints: BREAKPOINTS,
  ...getCurrentWindowSize()
}

const isBrowser = typeof window !== 'undefined'

const ViewportContext = React.createContext(VIEWPORT_SIZE_BASE)

function getCurrentWindowSize() {
  return isBrowser
    ? { width: window.innerWidth, height: window.innerHeight }
    : HEADLESS_VIEWPORT_SIZE
}

export function ViewportProvider({ throttle = 100, children }: Props) {
  const [viewportSize, setViewportSize] = useState(VIEWPORT_SIZE_BASE)
  const throttleHandler = useRef<DebouncedFunc<() => void>>()

  const updateWindowSize = useCallback(() => {
    setViewportSize({
      ...VIEWPORT_SIZE_BASE,
      ...getCurrentWindowSize()
    })
  }, [])

  const resizeStart = useCallback((): void => {
    throttleHandler.current = lodashThrottle(updateWindowSize, throttle)

    updateWindowSize()

    if (isBrowser) {
      window.addEventListener('resize', throttleHandler.current)
    }
  }, [throttle, updateWindowSize])

  const resizeStop = useCallback((): void => {
    if (!throttleHandler.current) {
      return
    }

    updateWindowSize()

    if (isBrowser) {
      window.removeEventListener('resize', throttleHandler.current)
    }

    throttleHandler.current.cancel()
  }, [updateWindowSize])

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

export function useViewport() {
  const viewportSize = React.useContext(ViewportContext)
  const { width } = viewportSize

  const within = useCallback(
    (min: string | number, max: string | number) => {
      // Accept "" or -1 indifferently
      if (min === '') min = -1
      if (max === '') max = -1

      // Convert breakpoints into numbers
      if (typeof min === 'string') {
        min = BREAKPOINTS[min]
      }
      if (typeof max === 'string') {
        max = BREAKPOINTS[max]
      }
      if (typeof min !== 'number') {
        throw new Error(`Viewport: invalid minimum value (${min}).`)
      }
      if (typeof max !== 'number') {
        throw new Error(`Viewport: invalid maximum value (${max}).`)
      }

      return (min === -1 || width >= min) && (max === -1 || width < max)
    },
    [width]
  )

  const above = useCallback((value: string | number) => within(value, -1), [
    within
  ])

  const below = useCallback((value: string | number) => within(-1, value), [
    within
  ])

  return { ...viewportSize, within, above, below }
}
