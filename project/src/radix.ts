import Zodiac from './zodiac'
import AspectCalculator from './aspect'
import type { FormedAspect } from './aspect'
import Transit from './transit'
import {
  validate
  , radiansToDegree
  , getEmptyWrapper
  , getPointPosition
  , getRulerPositions
  , getDescriptionPosition
  , getDashedLinesPositions
  , assemble
  , normalizeAngle
  , splitDegreeMinute
  , SIGN_GLYPHS
} from './utils'
import type SVG from './svg'
import type { Settings } from './settings'

export type Points = Record<string, number[]>
export interface LocatedPoint { name: string; x: number; y: number; r: number; angle: number; pointer?: number; index?: number }
export interface AstroData {
  planets: Points
  cusps: number[]
}

/**
   * Radix charts.
   *
   * @class
   * @public
   * @constructor
    * @param {this.settings.SVG} paper
   * @param {int} cx
   * @param {int} cy
   * @param {int} radius
   * @param {Object} data
   */
class Radix {
  settings: Settings
  data: AstroData
  paper: SVG
  cx: number
  cy: number
  radius: number
  locatedPoints: LocatedPoint[]
  rulerRadius: number
  pointRadius: number
  toPoints: Points
  shift: number
  universe: Element
  context: this
  constructor(paper: SVG, cx: number, cy: number, radius: number, data: AstroData, settings: Settings) {
    this.settings = settings
    // Validate data
    const status = validate(data)
    if (status.hasError) {
      throw new Error(status.messages.join(' | '))
    }

    this.data = data
    this.paper = paper
    this.cx = cx
    this.cy = cy
    this.radius = radius

    // after calling this.drawPoints() it contains current position of point
    this.locatedPoints = []
    this.rulerRadius = ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / this.settings.RULER_RADIUS)
    this.pointRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + 2 * this.rulerRadius + (this.settings.PADDING * this.settings.SYMBOL_SCALE))

    // @see aspects()
    // @see setPointsOfInterest()
    this.toPoints = JSON.parse(JSON.stringify(this.data.planets)) // Clone object

    this.shift = 0
    if (this.data.cusps && this.data.cusps[0]) {
      const deg360 = radiansToDegree(2 * Math.PI)
      this.shift = deg360 - this.data.cusps[0]
    }

    // preparing wrapper for aspects. It is the lowest layer
    const divisionForAspects = document.createElementNS(this.paper.root.namespaceURI, 'g')
    divisionForAspects.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_ASPECTS)
    this.paper.root.appendChild(divisionForAspects)

    this.universe = document.createElementNS(this.paper.root.namespaceURI, 'g')
    this.universe.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX)
    this.paper.root.appendChild(this.universe)

    this.context = this
  }

  /**
   * Draw background
   */
  drawBg(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_BG, this.paper.root.id)

    const LARGE_ARC_FLAG = 1
    const start = 0 // degree
    const end = 359.99 // degree
    const hemisphere = this.paper.segment(this.cx, this.cy, this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO, start, end, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, LARGE_ARC_FLAG)
    hemisphere.setAttribute('fill', this.settings.STROKE_ONLY ? 'none' : this.settings.COLOR_BACKGROUND)
    wrapper.appendChild(hemisphere)
  }

  /**
   * Draw universe.
   */
  drawUniverse(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS, this.paper.root.id)

    // colors
    for (let i = 0, step = 30, start = this.shift, len = this.settings.COLORS_SIGNS.length; i < len; i++) {
      const segment = this.paper.segment(this.cx, this.cy, this.radius, start, start + step, this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO)
      segment.setAttribute('fill', this.settings.STROKE_ONLY ? 'none' : this.settings.COLORS_SIGNS[i])
      segment.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS + '-' + i)
      segment.setAttribute('stroke', this.settings.STROKE_ONLY ? this.settings.CIRCLE_COLOR : 'none')
      segment.setAttribute('stroke-width', this.settings.STROKE_ONLY ? '1' : '0')
      wrapper.appendChild(segment)

      start += step
    }

    // signs
    for (let i = 0, step = 30, start = 15 + this.shift, len = this.settings.SYMBOL_SIGNS.length; i < len; i++) {
      const position = getPointPosition(this.cx, this.cy, this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / 2, start, this.settings)
      wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_SIGNS[i], position.x, position.y))
      start += step
    }
  }

  /**
   * Draw points
   */
  drawPoints(): void {
    if (this.data.planets == null) {
      return
    }

    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_POINTS, this.paper.root.id)

    const gap = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO)
    const step = (gap - 2 * (this.settings.PADDING * this.settings.SYMBOL_SCALE)) / Object.keys(this.data.planets).length

    const pointerRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius)
    let startPosition
    let endPosition

    for (const planet in this.data.planets) {
      if (this.data.planets.hasOwnProperty(planet)) {
        const position = getPointPosition(this.cx, this.cy, this.pointRadius, this.data.planets[planet][0] + this.shift, this.settings)
        const point = { name: planet, x: position.x, y: position.y, r: (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE), angle: this.data.planets[planet][0] + this.shift, pointer: this.data.planets[planet][0] + this.shift }
        this.locatedPoints = assemble(this.locatedPoints, point, { cx: this.cx, cy: this.cy, r: this.pointRadius }, this.settings)
      }
    }

    if (this.settings.DEBUG) console.log('Radix count of points: ' + this.locatedPoints.length)
    if (this.settings.DEBUG) console.log('Radix located points:\n' + JSON.stringify(this.locatedPoints))

    this.locatedPoints.forEach(function (point: LocatedPoint) {
      // draw pointer
      startPosition = getPointPosition(this.cx, this.cy, pointerRadius, this.data.planets[point.name][0] + this.shift, this.settings)
      endPosition = getPointPosition(this.cx, this.cy, pointerRadius - this.rulerRadius / 2, this.data.planets[point.name][0] + this.shift, this.settings)
      const pointer = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
      pointer.setAttribute('stroke', this.settings.CIRCLE_COLOR)
      pointer.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
      wrapper.appendChild(pointer)

      // draw pointer line
      if (!this.settings.STROKE_ONLY && (this.data.planets[point.name][0] + this.shift) !== point.angle) {
        startPosition = endPosition
        endPosition = getPointPosition(this.cx, this.cy, this.pointRadius + (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE), point.angle, this.settings)
        const line = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
        line.setAttribute('stroke', this.settings.LINE_COLOR)
        line.setAttribute('stroke-width', 0.5 * (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
        wrapper.appendChild(line)
      }

      // draw symbol
      const symbol = this.paper.getSymbol(point.name, point.x, point.y)
      symbol.setAttribute('id', this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_POINTS + '-' + point.name)
      wrapper.appendChild(symbol)

      // draw point descriptions
      const longitude = this.data.planets[point.name][0]

      // SHOW_POINT_DEGREES off keeps the upstream label: a bare whole-degree
      // number. On, it becomes three rows -- degree, sign glyph, minutes --
      // matching how a printed chart states a position.
      const dm = splitDegreeMinute(longitude)
      const zodiac = new Zodiac(this.data.cusps, this.settings)
      const isRetrograde = Boolean(this.data.planets[point.name][1]) && zodiac.isRetrograde(this.data.planets[point.name][1])

      let textsToShow: string[]

      if (this.settings.SHOW_POINT_DEGREES) {
        // Three rows: degree, sign, minutes -- how a printed chart states a
        // position. The retrograde marker rides on the SIGN row rather than
        // taking a fourth row of its own; a four-row stack is tall enough to
        // push neighbouring planets apart via the collision logic, which
        // visibly scatters a tight cluster.
        textsToShow = [
          dm.degrees.toString() + '\u00B0',
          SIGN_GLYPHS[Math.floor(normalizeAngle(longitude) / 30) % 12] + (isRetrograde ? ' R' : ''),
          dm.minutes.toString().padStart(2, '0') + '\u2032'
        ]
      } else {
        textsToShow = [(Math.floor(longitude) % 30).toString(), isRetrograde ? 'R' : '']
      }

      if (this.settings.SHOW_DIGNITIES_TEXT)
        textsToShow = textsToShow.concat(zodiac.getDignities({ name: point.name, position: this.data.planets[point.name][0] }, this.settings.DIGNITIES_EXACT_EXALTATION_DEFAULT).join(','))

      const pointDescriptions = getDescriptionPosition(point, textsToShow, this.settings)
      pointDescriptions.forEach(function (dsc) {
        wrapper.appendChild(this.paper.text(dsc.text, dsc.x, dsc.y, this.settings.POINTS_TEXT_SIZE, this.settings.POINTS_TEXT_COLOR ?? this.settings.SIGNS_COLOR))
      }, this)
    }, this)
  }

  drawAxis(): void {
    if (this.data.cusps == null) {
      return
    }

    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_AXIS, this.paper.root.id)

    const axisRadius = this.radius + ((this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / 4)

    const AS = 0
    const IC = 3
    const DC = 6
    const MC = 9
    let overlapLine
    let startPosition
    let endPosition

    // Under whole-sign the cusps are the sign boundaries, not the angles, so
    // reading the axis off cusps[0/3/6/9] would draw it at 0 degrees of the
    // rising sign instead of on the Ascendant. AXIS_POSITIONS carries the real
    // longitudes; the cusps remain the fallback for house systems where the two
    // are the same thing.
    const axisAngles = this.settings.AXIS_POSITIONS
    const angleFor = (i: number): number => {
      if (axisAngles == null) return this.data.cusps[i]
      if (i === AS) return axisAngles.As
      if (i === IC) return axisAngles.Ic
      if (i === DC) return axisAngles.Ds
      return axisAngles.Mc
    }

    const axisColor = this.settings.AXIS_LINE_COLOR ?? this.settings.LINE_COLOR;

    [AS, IC, DC, MC].forEach(function (i) {
      let textPosition
      const angle = angleFor(i)

      // The axis proper: one unbroken line from the indoor circle out to the
      // rim, so the Ascendant and Midheaven read as axes of the chart rather
      // than as two more house cusps.
      if (this.settings.DRAW_AXIS_LINE) {
        const innerPosition = getPointPosition(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, angle + this.shift, this.settings)
        const outerPosition = getPointPosition(this.cx, this.cy, this.radius, angle + this.shift, this.settings)
        const axisLine = this.paper.line(innerPosition.x, innerPosition.y, outerPosition.x, outerPosition.y)
        axisLine.setAttribute('stroke', axisColor)
        axisLine.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE))
        wrapper.appendChild(axisLine)
      }

      // overlap
      startPosition = getPointPosition(this.cx, this.cy, this.radius, angle + this.shift, this.settings)
      endPosition = getPointPosition(this.cx, this.cy, axisRadius, angle + this.shift, this.settings)
      overlapLine = this.paper.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y)
      overlapLine.setAttribute('stroke', axisColor)
      overlapLine.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE))
      wrapper.appendChild(overlapLine)

      if (this.settings.SHOW_AXIS_DEGREES) {
        const dm = splitDegreeMinute(angle)
        const degreeLabel = dm.degrees.toString() + '\u00B0' + dm.minutes.toString().padStart(2, '0') + '\u2032'
        const labelPosition = getPointPosition(this.cx, this.cy, axisRadius + (46 * this.settings.SYMBOL_SCALE), angle + this.shift, this.settings)
        const label = this.paper.text(degreeLabel, labelPosition.x, labelPosition.y, this.settings.POINTS_TEXT_SIZE, axisColor)
        label.setAttribute('text-anchor', 'middle')
        wrapper.appendChild(label)
      }

      // As
      if (i === AS) {
        // Text
        textPosition = getPointPosition(this.cx, this.cy, axisRadius + (20 * this.settings.SYMBOL_SCALE), angle + this.shift, this.settings)
        wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_AS, textPosition.x, textPosition.y))
      }

      // Ds
      if (i === DC) {
        // Text
        textPosition = getPointPosition(this.cx, this.cy, axisRadius + (2 * this.settings.SYMBOL_SCALE), angle + this.shift, this.settings)
        wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_DS, textPosition.x, textPosition.y))
      }

      // Ic
      if (i === IC) {
        // Text
        textPosition = getPointPosition(this.cx, this.cy, axisRadius + (10 * this.settings.SYMBOL_SCALE), angle - 2 + this.shift, this.settings)
        wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_IC, textPosition.x, textPosition.y))
      }

      // Mc
      if (i === MC) {
        // Text
        textPosition = getPointPosition(this.cx, this.cy, axisRadius + (10 * this.settings.SYMBOL_SCALE), angle + 2 + this.shift, this.settings)
        wrapper.appendChild(this.paper.getSymbol(this.settings.SYMBOL_MC, textPosition.x, textPosition.y))
      }
    }, this)
  }

  /**
   * Draw cusps
   */
  drawCusps(): void {
    if (this.data.cusps == null) {
      return
    }

    let lines
    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CUSPS, this.paper.root.id)

    const numbersRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO + (this.settings.COLLISION_RADIUS * this.settings.SYMBOL_SCALE)

    const AS = 0
    const IC = 3
    const DC = 6
    const MC = 9
    const mainAxis = [AS, IC, DC, MC]

    // Cusps
    for (let i = 0, ln = this.data.cusps.length; i < ln; i++) {
      const lineStartRadius = this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO
      const lineEndRadius = this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius)

      if (this.settings.CUSPS_SPLIT_AROUND_POINTS) {
        // Draws a dashed line when an point is in the way
        lines = getDashedLinesPositions(
          this.cx,
          this.cy,
          this.data.cusps[i] + this.shift,
          lineStartRadius,
          lineEndRadius,
          this.pointRadius,
          this.locatedPoints,
          this.settings
        )
      } else {
        // One unbroken line. Splitting around the planet glyphs leaves visible
        // holes in the ring; drawing the cusps first and letting the glyphs sit
        // on top of them reads as a continuous wheel instead.
        const startPoint = getPointPosition(this.cx, this.cy, lineStartRadius, this.data.cusps[i] + this.shift, this.settings)
        const endPoint = getPointPosition(this.cx, this.cy, lineEndRadius, this.data.cusps[i] + this.shift, this.settings)
        lines = [{ startX: startPoint.x, startY: startPoint.y, endX: endPoint.x, endY: endPoint.y }]
      }

      lines.forEach(function (line) {
        const newLine = this.paper.line(line.startX, line.startY, line.endX, line.endY)

        // Only treat cusps 0/3/6/9 as the axis when the caller has NOT supplied
        // the real angles. Under whole-sign those cusps are the boundaries of
        // the angular signs, not the Ascendant and Midheaven, so colouring them
        // as the axis draws a second, wrong axis beside the real one.
        if (mainAxis.includes(i) && this.settings.AXIS_POSITIONS == null) {
          newLine.setAttribute('stroke', this.settings.AXIS_LINE_COLOR ?? this.settings.LINE_COLOR)
          newLine.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE))
        } else {
          newLine.setAttribute('stroke', this.settings.LINE_COLOR)
          newLine.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
        }

        wrapper.appendChild(newLine)
      }, this)

      // Cup number
      const deg360 = radiansToDegree(2 * Math.PI)
      const startOfCusp = this.data.cusps[i]
      const endOfCusp = this.data.cusps[(i + 1) % 12]
      const gap = endOfCusp - startOfCusp > 0 ? endOfCusp - startOfCusp : endOfCusp - startOfCusp + deg360
      const textPosition = getPointPosition(this.cx, this.cy, numbersRadius, ((startOfCusp + gap / 2) % deg360) + this.shift, this.settings)
      wrapper.appendChild(this.paper.getSymbol((i + 1).toString(), textPosition.x, textPosition.y))
    }
  }

  /**
   * Draw aspects
   * @param{Array<Object> | null} customAspects - posible custom aspects to draw;
   */
  aspects(customAspects?: FormedAspect[] | null): Radix {
    const aspectsList = customAspects != null && Array.isArray(customAspects)
      ? customAspects
      : new AspectCalculator(this.toPoints, this.settings).radix(this.data.planets)

    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_ASPECTS, this.paper.root.id)

    const duplicateCheck: string[] = []

    for (let i = 0, ln = aspectsList.length; i < ln; i++) {
      const key = aspectsList[i].aspect.name + '-' + aspectsList[i].point.name + '-' + aspectsList[i].toPoint.name
      const opositeKey = aspectsList[i].aspect.name + '-' + aspectsList[i].toPoint.name + '-' + aspectsList[i].point.name
      if (!duplicateCheck.includes(opositeKey)) {
        duplicateCheck.push(key)

        const startPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, aspectsList[i].toPoint.position + this.shift, this.settings)
        const endPoint = getPointPosition(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO, aspectsList[i].point.position + this.shift, this.settings)

        const line = this.paper.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y)
        line.setAttribute('stroke', this.settings.STROKE_ONLY ? this.settings.LINE_COLOR : aspectsList[i].aspect.color)
        line.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())

        line.setAttribute('data-name', aspectsList[i].aspect.name)
        line.setAttribute('data-degree', aspectsList[i].aspect.degree.toString())
        line.setAttribute('data-point', aspectsList[i].point.name)
        line.setAttribute('data-toPoint', aspectsList[i].toPoint.name)
        line.setAttribute('data-precision', aspectsList[i].precision.toString())

        wrapper.appendChild(line)
      }
    }

    return this.context
  }

  /**
   * Add points of interest for aspects calculation
   * @param {Obect} points, {"As":[0],"Ic":[90],"Ds":[180],"Mc":[270]}
   * @see (this.settings.AspectCalculator( toPoints) )
   */
  addPointsOfInterest(points: Points): Radix {
    for (const point in points) {
      if (points.hasOwnProperty(point)) {
        this.toPoints[point] = points[point]
      }
    }

    return this.context
  }

  drawRuler(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_RULER, this.paper.root.id)

    const startRadius = (this.radius - (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO + this.rulerRadius))
    const rays = getRulerPositions(this.cx, this.cy, startRadius, startRadius + this.rulerRadius, this.shift, this.settings)

    rays.forEach(function (ray) {
      const line = this.paper.line(ray.startX, ray.startY, ray.endX, ray.endY)
      line.setAttribute('stroke', this.settings.CIRCLE_COLOR)
      line.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE))
      wrapper.appendChild(line)
    }, this)

    const circle = this.paper.circle(this.cx, this.cy, startRadius)
    circle.setAttribute('stroke', this.settings.CIRCLE_COLOR)
    circle.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)
  }

  /**
   * Draw each house cusp's degree just outside the outer circle.
   *
   * Upstream draws nothing here. The label states where the cusp actually falls
   * (e.g. 28\u00B040\u2032), which is the information a whole-sign chart hides -- there
   * the cusps sit at 0\u00B0 of each sign but the ANGLES do not, and the difference
   * is exactly what a reader needs to see.
   *
   * Rendered outside this.radius so it never collides with the zodiac band.
   */
  drawCuspDegrees(): void {
    if (!this.settings.SHOW_CUSP_DEGREES) {
      return
    }

    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-cusp-degrees', this.paper.root.id)

    // Sits in the same band the axis stubs occupy, one text height further out.
    const labelRadius = this.radius + (this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO) / this.settings.RULER_RADIUS + (this.settings.POINTS_TEXT_SIZE * this.settings.SYMBOL_SCALE)

    // Angles the axis already labels. Printing the cusp degree there too puts
    // two identical readings on top of each other.
    const axisAngles = this.settings.AXIS_POSITIONS
    const labelledByAxis = this.settings.SHOW_AXIS_DEGREES
      ? (axisAngles != null
          ? [axisAngles.As, axisAngles.Ds, axisAngles.Mc, axisAngles.Ic]
          : [this.data.cusps[0], this.data.cusps[3], this.data.cusps[6], this.data.cusps[9]])
      : []

    for (let i = 0; i < this.data.cusps.length; i++) {
      const cuspAngle = normalizeAngle(this.data.cusps[i])
      const collidesWithAxis = labelledByAxis.some(
        (angle) => Math.abs(normalizeAngle(angle) - cuspAngle) < 0.02
      )
      if (collidesWithAxis) {
        continue
      }

      const dm = splitDegreeMinute(this.data.cusps[i])
      const label = dm.degrees.toString() + '\u00B0' + dm.minutes.toString().padStart(2, '0') + '\u2032'

      const position = getPointPosition(this.cx, this.cy, labelRadius, this.data.cusps[i] + this.shift, this.settings)
      const text = this.paper.text(label, position.x, position.y, this.settings.POINTS_TEXT_SIZE, this.settings.POINTS_TEXT_COLOR ?? this.settings.SIGNS_COLOR)
      text.setAttribute('text-anchor', 'middle')
      wrapper.appendChild(text)
    }
  }

  /**
   * Draw circles
   */
  drawCircles(): void {
    const universe = this.universe
    const wrapper = getEmptyWrapper(universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CIRCLES, this.paper.root.id)

    // indoor circle
    let circle = this.paper.circle(this.cx, this.cy, this.radius / this.settings.INDOOR_CIRCLE_RADIUS_RATIO)
    circle.setAttribute('stroke', this.settings.CIRCLE_COLOR)
    circle.setAttribute('stroke-width', (this.settings.CIRCLE_STRONG * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)

    // outdoor circle
    circle = this.paper.circle(this.cx, this.cy, this.radius)
    circle.setAttribute('stroke', this.settings.CIRCLE_COLOR)
    circle.setAttribute('stroke-width', (this.settings.CIRCLE_STRONG * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)

    // inner circle
    circle = this.paper.circle(this.cx, this.cy, this.radius - this.radius / this.settings.INNER_CIRCLE_RADIUS_RATIO)
    circle.setAttribute('stroke', this.settings.CIRCLE_COLOR)
    circle.setAttribute('stroke-width', (this.settings.CIRCLE_STRONG * this.settings.SYMBOL_SCALE).toString())
    wrapper.appendChild(circle)
  }

  /**
   * Display transit horoscope
   *
   * @param {Object} data
   * @example
   *  {
   *    "planets":{"Moon":[0], "Sun":[30],  ... },
   *    "cusps":[300, 340, 30, 60, 75, 90, 116, 172, 210, 236, 250, 274],  *
   *  }
   *
   * @return {Transit} transit
   */
  transit(data: AstroData): Transit {
    // remove axis (As, Ds, Mc, Ic) from radix
    getEmptyWrapper(this.universe, this.paper.root.id + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_AXIS, this.paper.root.id)
    const transit = new Transit(this.context, data, this.settings)
    transit.drawBg()
    transit.drawPoints()
    transit.drawCusps()
    transit.drawRuler()
    transit.drawCircles()
    return transit
  }
}

export default Radix
