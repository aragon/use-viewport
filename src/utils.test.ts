import {
  withinBreakpointRange,
  aboveBreakpoint,
  belowBreakpoint,
  DEFAULT_BREAKPOINTS,
} from './utils'

const MOCK_VIEWPORT_WIDTH = 500

describe('withinBreakpointRange() ', () => {
  it('returns falsy when viewport is not in the breakpoint range', () => {
    expect(
      withinBreakpointRange(
        'medium',
        'large',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeFalsy()
    expect(
      withinBreakpointRange(200, 300, MOCK_VIEWPORT_WIDTH, DEFAULT_BREAKPOINTS)
    ).toBeFalsy()
  })

  it('returns truthy when viewport is within the breakpoint range', () => {
    expect(
      withinBreakpointRange(
        'small',
        'large',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeTruthy()
    expect(
      withinBreakpointRange(200, 600, MOCK_VIEWPORT_WIDTH, DEFAULT_BREAKPOINTS)
    ).toBeTruthy()
  })

  it('returns correctly when passed empty string', () => {
    expect(
      withinBreakpointRange(
        'small',
        '',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeTruthy()
    expect(
      withinBreakpointRange(
        '',
        'small',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeFalsy()
  })

  it('throws when passing an undefined breakpoint name', () => {
    expect(() => {
      withinBreakpointRange(
        'muffins',
        '',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    }).toThrowError()

    expect(() => {
      withinBreakpointRange(
        '',
        'muffins',
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    }).toThrowError()
  })
})

describe('aboveBreakpoint() ', () => {
  it('returns falsy when viewport is smaller than breakpoint', () => {
    expect(
      aboveBreakpoint(
        MOCK_VIEWPORT_WIDTH + 1,
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeFalsy()
  })

  it('returns truthy when viewport is larger than breakpoint', () => {
    expect(
      aboveBreakpoint(
        MOCK_VIEWPORT_WIDTH - 1,
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeTruthy()
  })
})

describe('belowBreakpoint() ', () => {
  it('returns falsy when viewport is larger than breakpoint', () => {
    expect(
      belowBreakpoint(
        MOCK_VIEWPORT_WIDTH - 1,
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeFalsy()
  })

  it('returns truthy when viewport is smaller than breakpoint', () => {
    expect(
      belowBreakpoint(
        MOCK_VIEWPORT_WIDTH + 1,
        MOCK_VIEWPORT_WIDTH,
        DEFAULT_BREAKPOINTS
      )
    ).toBeTruthy()
  })
})
