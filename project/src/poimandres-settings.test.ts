// Coverage for the Poimandres additions to Settings. Each of these replaces
// something that was previously impossible to express from the outside, so each
// test asserts BOTH the new behaviour and that the default still matches
// upstream -- the defaults are what every other consumer of this fork gets.
import Radix from './radix'
import SVG from './svg'
import Chart from './chart'
import default_settings from './settings'
import { splitDegreeMinute } from './utils'

const data = {
  // Sun at 4°30' Taurus (34.5), Moon at 29°59' Leo (149.99) -- both chosen so
  // degree, minute and sign are all distinguishable from zero.
  planets: { Sun: [34.5], Moon: [149.99] },
  cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
}

const mount = () => { document.body.innerHTML = '<div id="chart"></div>' }

describe('splitDegreeMinute', () => {
  it('floors, so a body never reads as a degree it has not reached', () => {
    expect(splitDegreeMinute(149.99)).toEqual({ degrees: 29, minutes: 59 })
  })

  it('survives values that are exact in decimal but not in binary', () => {
    // Multiplying the raw remainder by 60 lands a hair under the true minute on
    // 2880 of the 360000 thousandths of a degree in the circle, each of which
    // then floors one minute low. These are three of them; without the rounding
    // step they read 8', 23' and 41'.
    expect(splitDegreeMinute(0.15)).toEqual({ degrees: 0, minutes: 9 })
    expect(splitDegreeMinute(0.4)).toEqual({ degrees: 0, minutes: 24 })
    expect(splitDegreeMinute(0.7)).toEqual({ degrees: 0, minutes: 42 })
  })

  it('handles sign and circle boundaries', () => {
    expect(splitDegreeMinute(0)).toEqual({ degrees: 0, minutes: 0 })
    expect(splitDegreeMinute(30)).toEqual({ degrees: 0, minutes: 0 })
    expect(splitDegreeMinute(359.5)).toEqual({ degrees: 29, minutes: 30 })
    // Negative longitudes fold forward rather than producing negative minutes.
    expect(splitDegreeMinute(-1)).toEqual({ degrees: 29, minutes: 0 })
  })
})

describe('SIGNS_COLORS (per-sign glyph colour)', () => {
  it('defaults to SIGNS_COLOR for every sign', () => {
    mount()
    const settings = { ...default_settings, SIGNS_COLORS: null }
    const paper = new SVG('chart', 500, 500, settings)
    expect(paper.getSignColor(settings.SYMBOL_ARIES)).toBe(settings.SIGNS_COLOR)
  })

  it('uses the per-sign colour when one is given', () => {
    mount()
    const settings = { ...default_settings, SIGNS_COLORS: { Aries: '#ff0000' } }
    const paper = new SVG('chart', 500, 500, settings)
    expect(paper.getSignColor('Aries')).toBe('#ff0000')
    // A sign that is not listed must still fall back rather than go undefined.
    expect(paper.getSignColor('Taurus')).toBe(settings.SIGNS_COLOR)
  })

  it('applies the colour to the rendered glyph path', () => {
    mount()
    const settings = { ...default_settings, SIGNS_COLORS: { Aries: '#123456' } }
    const paper = new SVG('chart', 500, 500, settings)
    const glyph = paper.getSymbol(settings.SYMBOL_ARIES, 100, 100)
    expect(glyph.querySelector('path')?.getAttribute('stroke')).toBe('#123456')
  })
})

describe('AXIS_LINE_COLOR', () => {
  const cuspStrokes = (settings: typeof default_settings) => {
    mount()
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, data, settings)
    radix.drawPoints()
    radix.drawCusps()
    return Array.from(
      document.querySelectorAll('#chart-astrology-radix-cusps line')
    ).map((l) => l.getAttribute('stroke'))
  }

  it('leaves every cusp on LINE_COLOR by default', () => {
    const strokes = cuspStrokes({ ...default_settings, AXIS_LINE_COLOR: null })
    expect(new Set(strokes)).toEqual(new Set([default_settings.LINE_COLOR]))
  })

  it('colours only the four angles when set', () => {
    const strokes = cuspStrokes({ ...default_settings, AXIS_LINE_COLOR: '#b5533c' })
    // Angles and ordinary cusps must BOTH be present -- if the branch coloured
    // everything, or nothing, this would collapse to a single value.
    expect(strokes).toContain('#b5533c')
    expect(strokes).toContain(default_settings.LINE_COLOR)
  })
})

describe('POINTS_TEXT_COLOR', () => {
  const labelFill = (settings: typeof default_settings) => {
    mount()
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, data, settings)
    radix.drawPoints()
    return document
      .querySelector('#chart-astrology-radix-planets text')
      ?.getAttribute('fill')
  }

  it('falls back to SIGNS_COLOR, as upstream did', () => {
    expect(labelFill({ ...default_settings, POINTS_TEXT_COLOR: null }))
      .toBe(default_settings.SIGNS_COLOR)
  })

  it('decouples label colour from the sign colour when set', () => {
    expect(labelFill({ ...default_settings, POINTS_TEXT_COLOR: '#334155' }))
      .toBe('#334155')
  })
})

describe('SHOW_POINT_DEGREES', () => {
  const labels = (show: boolean) => {
    mount()
    const settings = { ...default_settings, SHOW_POINT_DEGREES: show, SHOW_DIGNITIES_TEXT: false }
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, data, settings)
    radix.drawPoints()
    return Array.from(
      document.querySelectorAll('#chart-astrology-radix-planets text')
    ).map((t) => t.textContent)
  }

  it('keeps the bare whole-degree label when off', () => {
    // Upstream behaviour: Math.floor(34.5) % 30 === 4, no degree sign.
    expect(labels(false)).toContain('4')
    expect(labels(false).join('')).not.toContain('°')
  })

  it('shows degree, sign glyph and minutes when on', () => {
    const shown = labels(true)
    // Sun 34.5 -> 4°, Taurus, 30'
    expect(shown).toContain('4°')
    expect(shown).toContain('♉')
    expect(shown).toContain("30′")
  })

  it('floors minutes rather than rounding, so a body never reads ahead of itself', () => {
    // Moon 149.99 is 29°59' Leo. Rounding would give 60' and read as 30° Leo,
    // a degree that does not exist in the sign.
    const shown = labels(true)
    expect(shown).toContain('29°')
    expect(shown).toContain('♌')
    expect(shown).toContain('59′')
  })

  it('pads minutes to two digits', () => {
    mount()
    const settings = { ...default_settings, SHOW_POINT_DEGREES: true, SHOW_DIGNITIES_TEXT: false }
    const paper = new SVG('chart', 500, 500, settings)
    // 60.05 -> 0°03' Gemini
    const radix = new Radix(paper, 250, 250, 200, { ...data, planets: { Sun: [60.05] } }, settings)
    radix.drawPoints()
    const shown = Array.from(
      document.querySelectorAll('#chart-astrology-radix-planets text')
    ).map((t) => t.textContent)
    expect(shown).toContain('03′')
  })
})

describe('SHOW_CUSP_DEGREES', () => {
  const rimLabels = (show: boolean) => {
    mount()
    const settings = { ...default_settings, SHOW_CUSP_DEGREES: show }
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, {
      ...data,
      // Deliberately not sign boundaries, so the labels are non-zero.
      cusps: [28.6667, 58.6667, 88.6667, 118.6667, 148.6667, 178.6667, 208.6667, 238.6667, 268.6667, 298.6667, 328.6667, 358.6667]
    }, settings)
    radix.drawCuspDegrees()
    return Array.from(
      document.querySelectorAll('#chart-astrology-radix-cusp-degrees text')
    ).map((t) => t.textContent)
  }

  it('draws nothing when off', () => {
    expect(rimLabels(false)).toHaveLength(0)
  })

  it('draws one label per cusp when on', () => {
    const shown = rimLabels(true)
    expect(shown).toHaveLength(12)
    // 28.6667 -> 28°40'
    expect(shown[0]).toBe('28°40′')
  })
})

describe('AXIS_POSITIONS (whole-sign angles)', () => {
  // Whole-sign: cusps sit at 0 degrees of each sign, but the Ascendant is at
  // 9 degrees Capricorn. Reading the axis off cusps[0] would draw it on the
  // sign boundary instead of on the Ascendant -- the exact bug this fixes.
  const wholeSignCusps = [270, 300, 330, 0, 30, 60, 90, 120, 150, 180, 210, 240]
  const trueAngles = { As: 279.11, Ds: 99.11, Mc: 202.15, Ic: 22.15 }

  const axisLineCount = (settings: typeof default_settings) => {
    mount()
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, { ...data, cusps: wholeSignCusps }, settings)
    radix.drawAxis()
    return document.querySelectorAll('#chart-astrology-radix-axis line').length
  }

  it('draws only the four stubs by default', () => {
    expect(axisLineCount({ ...default_settings, DRAW_AXIS_LINE: false })).toBe(4)
  })

  it('adds a full axis line per angle when asked', () => {
    expect(axisLineCount({ ...default_settings, DRAW_AXIS_LINE: true })).toBe(8)
  })

  it('puts the axis on the cusps when no angles are given', () => {
    mount()
    const settings = { ...default_settings, AXIS_POSITIONS: null, SHOW_AXIS_DEGREES: true }
    const paper = new SVG('chart', 500, 500, settings)
    new Radix(paper, 250, 250, 200, { ...data, cusps: wholeSignCusps }, settings).drawAxis()
    const labels = Array.from(document.querySelectorAll('#chart-astrology-radix-axis text')).map((t) => t.textContent)
    // cusps[0] is 270 -> 0 degrees of the sign.
    expect(labels).toContain('0°00′')
  })

  it('puts the axis on the TRUE angles when they are given', () => {
    mount()
    const settings = { ...default_settings, AXIS_POSITIONS: trueAngles, SHOW_AXIS_DEGREES: true }
    const paper = new SVG('chart', 500, 500, settings)
    new Radix(paper, 250, 250, 200, { ...data, cusps: wholeSignCusps }, settings).drawAxis()
    const labels = Array.from(document.querySelectorAll('#chart-astrology-radix-axis text')).map((t) => t.textContent)
    // As 279.11 -> 9 degrees 06 minutes, Mc 202.15 -> 22 degrees 09 minutes.
    // Each appears twice: opposite angles are 180 apart, so they share the same
    // degree within their respective signs.
    expect(labels).toContain('9°06′')
    expect(labels).toContain('22°09′')
    expect(labels).toHaveLength(4)
    // And it must NOT still be sitting on the sign boundary.
    expect(labels).not.toContain('0°00′')
  })
})

describe('CUSPS_SPLIT_AROUND_POINTS', () => {
  const cuspLineCount = (split: boolean) => {
    mount()
    const settings = { ...default_settings, CUSPS_SPLIT_AROUND_POINTS: split }
    const paper = new SVG('chart', 500, 500, settings)
    const radix = new Radix(paper, 250, 250, 200, data, settings)
    radix.drawPoints()
    radix.drawCusps()
    return document.querySelectorAll('#chart-astrology-radix-cusps line').length
  }

  it('splits lines around planets by default, producing extra segments', () => {
    // 12 cusps, but planets in the way break some into two -- that is the
    // upstream behaviour, and the source of the gaps in the ring.
    expect(cuspLineCount(true)).toBeGreaterThan(12)
  })

  it('draws exactly one unbroken line per cusp when splitting is off', () => {
    expect(cuspLineCount(false)).toBe(12)
  })
})

describe('FONT_FAMILY', () => {
  it('defaults to serif, as upstream hardcoded', () => {
    mount()
    const paper = new SVG('chart', 500, 500, default_settings)
    expect(paper.text('x', 0, 0, 8, '#000').getAttribute('font-family')).toBe('serif')
  })

  it('is configurable', () => {
    mount()
    const settings = { ...default_settings, FONT_FAMILY: 'Poppins, sans-serif' }
    const paper = new SVG('chart', 500, 500, settings)
    expect(paper.text('x', 0, 0, 8, '#000').getAttribute('font-family')).toBe('Poppins, sans-serif')
  })
})

describe('defaults are unchanged for existing consumers', () => {
  it('every new setting is inert out of the box', () => {
    expect(default_settings.SIGNS_COLORS).toBeNull()
    expect(default_settings.AXIS_LINE_COLOR).toBeNull()
    expect(default_settings.POINTS_TEXT_COLOR).toBeNull()
    expect(default_settings.SHOW_POINT_DEGREES).toBe(false)
    expect(default_settings.SHOW_CUSP_DEGREES).toBe(false)
    expect(default_settings.FONT_FAMILY).toBe('serif')
    expect(default_settings.AXIS_POSITIONS).toBeNull()
    expect(default_settings.DRAW_AXIS_LINE).toBe(false)
    expect(default_settings.SHOW_AXIS_DEGREES).toBe(false)
    expect(default_settings.CUSPS_SPLIT_AROUND_POINTS).toBe(true)
  })

  it('a chart drawn with no overrides still renders the standard groups', () => {
    mount()
    const chart = new Chart('chart', 500, 500)
    chart.radix(data)
    expect(document.querySelector('#chart-astrology-radix-signs')).not.toBeNull()
    expect(document.querySelector('#chart-astrology-radix-planets')).not.toBeNull()
    expect(document.querySelector('#chart-astrology-radix-cusps')).not.toBeNull()
    // The new group must be absent when the flag is off.
    expect(document.querySelector('#chart-astrology-radix-cusp-degrees')).toBeNull()
  })
})
