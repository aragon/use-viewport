import React from 'react'
import PropTypes from 'prop-types'
import { BREAKPOINTS } from './utils'
import throttle from 'lodash/throttle'

const NO_DOM_WINDOW_SIZE = { width: 0, height: 0 }

const WINDOW_SIZE_BASE = { breakpoints: BREAKPOINTS, ...getCurrentWindowSize() }

const ViewportContext = React.createContext(WINDOW_SIZE_BASE)

function getCurrentWindowSize() {
  return typeof window === 'undefined'
    ? NO_DOM_WINDOW_SIZE
    : { width: window.innerWidth, height: window.innerHeight }
}

export class ViewportProvider extends React.Component<{ throttle: any }> {
  static propTypes = {
    children: PropTypes.node,
    throttle: PropTypes.number,
  }

  static defaultProps = {
    throttle: 100,
  }

  state = { windowSize: this.getWindowSize() }

  componentDidMount() {
    this.resizeStart()
  }

  componentWillUnmount() {
    this.resizeStop()
  }

  componentDidUpdate(prevProps: any) {
    const { throttle } = this.props
    if (prevProps.throttle !== throttle) {
      this.resizeStop()
      this.resizeStart()
    }
  }

  resizeStart() {
    // @ts-ignore
    this._handleResize = throttle(this.updateWindowSize, this.props.throttle)
    this.updateWindowSize()

    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.addEventListener('resize', this._handleResize)
    }
  }

  resizeStop() {
    // @ts-ignore
    if (!this._handleResize) {
      return
    }
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.removeEventListener('resize', this._handleResize)
    }
    // @ts-ignore
    this._handleResize.cancel()
    // @ts-ignore
    delete this._handleResize
  }

  updateWindowSize = () => {
    this.setState({ windowSize: this.getWindowSize() })
  }

  getWindowSize() {
    return {
      ...WINDOW_SIZE_BASE,
      ...getCurrentWindowSize(),
    }
  }

  // Check if the current width is between two points.
  // Accepts a breakpoint string ('small', 'large') or numbers (width in pixels).
  // `min` is inclusive and `max` is exclusive.
  within = (min: string | number, max: string | number) => {
    const { width } = this.state.windowSize

    // Accept "" or -1 indifferently
    if (min === '') min = -1
    if (max === '') max = -1

    // Convert breakpoints into numbers
    // @ts-ignore
    if (typeof min === 'string') min = BREAKPOINTS[min]
    // @ts-ignore
    if (typeof max === 'string') max = BREAKPOINTS[max]

    if (typeof min !== 'number') {
      throw new Error(`Viewport: invalid minimum value (${min}).`)
    }
    if (typeof max !== 'number') {
      throw new Error(`Viewport: invalid maximum value (${max}).`)
    }

    return (min === -1 || width >= min) && (max === -1 || width < max)
  }

  above = (value: string | number) => this.within(value, -1)
  below = (value: string | number) => this.within(-1, value)

  render() {
    const { windowSize } = this.state
    const { children } = this.props
    const { within, above, below } = this
    console.log(this)
    return (
      <ViewportContext.Provider
        // @ts-ignore
        value={{ ...windowSize, within, above, below, this: this }}
      >
        {children}
      </ViewportContext.Provider>
    )
  }
}

export function useViewport() {
  return React.useContext(ViewportContext)
}
