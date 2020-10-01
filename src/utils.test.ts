import {
  withinBreakpointRange,
  aboveBreakpoint,
  belowBreakpoint,
} from './utils'

const mockViewportWidth = 500

describe('withinRange() ', () => {
  it('returns falsy when viewport is not in the breakpoint range', () => {
    expect(
      withinBreakpointRange('medium', 'large', mockViewportWidth)
    ).toBeFalsy()
    expect(withinBreakpointRange(200, 300, mockViewportWidth)).toBeFalsy()
  })

  it('returns truthy when viewport is within the breakpoint range', () => {
    expect(
      withinBreakpointRange('small', 'large', mockViewportWidth)
    ).toBeTruthy()
    expect(withinBreakpointRange(200, 600, mockViewportWidth)).toBeTruthy()
  })

  it('returns correctly when passed empty string', () => {
    expect(withinBreakpointRange('small', '', mockViewportWidth)).toBeTruthy()
    expect(withinBreakpointRange('', 'small', mockViewportWidth)).toBeFalsy()
  })

  it('throws when passing an undefined breakpoint name', () => {
    expect(() => {
      withinBreakpointRange('muffins', '', mockViewportWidth)
    }).toThrowError()

    expect(() => {
      withinBreakpointRange('', 'muffins', mockViewportWidth)
    }).toThrowError()
  })
})

describe('aboveValue() ', () => {
  it('returns falsy when viewport is smaller than breakpoint', () => {
    expect(
      aboveBreakpoint(mockViewportWidth + 1, mockViewportWidth)
    ).toBeFalsy()
  })

  it('returns truthy when viewport is larger than breakpoint', () => {
    expect(
      aboveBreakpoint(mockViewportWidth - 1, mockViewportWidth)
    ).toBeTruthy()
  })
})

describe('belowValue() ', () => {
  it('returns falsy when viewport is larger than breakpoint', () => {
    expect(
      belowBreakpoint(mockViewportWidth - 1, mockViewportWidth)
    ).toBeFalsy()
  })

  it('returns truthy when viewport is smaller than breakpoint', () => {
    expect(
      belowBreakpoint(mockViewportWidth + 1, mockViewportWidth)
    ).toBeTruthy()
  })
})
