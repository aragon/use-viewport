// Grid Unit - 8px
const GU = 8

// These breakpoints values represent minimum screen sizes.
export const BREAKPOINTS: { [key: string]: number } = {
  min: 360,
  small: 360,
  medium: 96 * GU,
  large: 144 * GU,
}

export function withinBreakpointRange(
  min: string | number,
  max: string | number,
  viewportWidth: number
): boolean {
  // Accept "" or -1 indifferently
  if (min === '') min = -1
  if (max === '') max = -1

  // Get the breakpoint unit value if the name is provided
  if (typeof min === 'string') {
    min = BREAKPOINTS[min]
  }
  if (typeof max === 'string') {
    max = BREAKPOINTS[max]
  }

  if (typeof min !== 'number') {
    // eslint-disable-next-line
    throw new Error(`Viewport: invalid minimum value (${min}).`)
  }

  if (typeof max !== 'number') {
    // eslint-disable-next-line
    throw new Error(`Viewport: invalid maximum value (${max}).`)
  }

  return (
    (min === -1 || viewportWidth >= min) && (max === -1 || viewportWidth < max)
  )
}

export function aboveBreakpoint(
  value: string | number,
  viewportWidth: number
): boolean {
  return withinBreakpointRange(value, -1, viewportWidth)
}

export function belowBreakpoint(
  value: string | number,
  viewportWidth: number
): boolean {
  return withinBreakpointRange(-1, value, viewportWidth)
}
