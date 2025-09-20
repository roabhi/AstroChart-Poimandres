import type { Settings } from './settings'

/**
   * SVG tools.
   *
   * @class
   * @public
   * @constructor
   * @param {String} elementId - root DOM Element
   * @param {int} width
   * @param {int} height
   */
class SVG {
  settings: Settings
  _paperElementId: string
  DOMElement: SVGSVGElement
  root: Element
  width: number
  height: number
  context: this
  constructor(elementId: string, width: number, height: number, settings: Settings) {
    this.settings = settings
    const rootElement = document.getElementById(elementId)
    if (rootElement == null) throw new Error('Root element not found')

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink')
    svg.setAttribute('style', 'position: relative; overflow: hidden;')
    svg.setAttribute('version', '1.1')
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height)
    rootElement.appendChild(svg)

    this._paperElementId = elementId + '-' + this.settings.ID_CHART

    const wrapper = document.createElementNS(svg.namespaceURI, 'g')
    wrapper.setAttribute('id', this._paperElementId)
    svg.appendChild(wrapper)

    this.DOMElement = svg
    this.root = wrapper
    this.width = width
    this.height = height

    this.context = this
  }

  _getSymbol(name: string, x: number, y: number): Element {
    switch (name) {
      case this.settings.SYMBOL_SUN:
        return this.sun(x, y)
      case this.settings.SYMBOL_MOON:
        return this.moon(x, y)
      case this.settings.SYMBOL_MERCURY:
        return this.mercury(x, y)
      case this.settings.SYMBOL_VENUS:
        return this.venus(x, y)
      case this.settings.SYMBOL_MARS:
        return this.mars(x, y)
      case this.settings.SYMBOL_JUPITER:
        return this.jupiter(x, y)
      case this.settings.SYMBOL_SATURN:
        return this.saturn(x, y)
      case this.settings.SYMBOL_URANUS:
        return this.uranus(x, y)
      case this.settings.SYMBOL_NEPTUNE:
        return this.neptune(x, y)
      case this.settings.SYMBOL_PLUTO:
        return this.pluto(x, y)
      case this.settings.SYMBOL_CHIRON:
        return this.chiron(x, y)
      case this.settings.SYMBOL_LILITH:
        return this.lilith(x, y)
      case this.settings.SYMBOL_NNODE:
        return this.nnode(x, y)
      case this.settings.SYMBOL_SNODE:
        return this.snode(x, y)
      case this.settings.SYMBOL_FORTUNE:
        return this.fortune(x, y)
      case this.settings.SYMBOL_ARIES:
        return this.aries(x, y)
      case this.settings.SYMBOL_TAURUS:
        return this.taurus(x, y)
      case this.settings.SYMBOL_GEMINI:
        return this.gemini(x, y)
      case this.settings.SYMBOL_CANCER:
        return this.cancer(x, y)
      case this.settings.SYMBOL_LEO:
        return this.leo(x, y)
      case this.settings.SYMBOL_VIRGO:
        return this.virgo(x, y)
      case this.settings.SYMBOL_LIBRA:
        return this.libra(x, y)
      case this.settings.SYMBOL_SCORPIO:
        return this.scorpio(x, y)
      case this.settings.SYMBOL_SAGITTARIUS:
        return this.sagittarius(x, y)
      case this.settings.SYMBOL_CAPRICORN:
        return this.capricorn(x, y)
      case this.settings.SYMBOL_AQUARIUS:
        return this.aquarius(x, y)
      case this.settings.SYMBOL_PISCES:
        return this.pisces(x, y)
      case this.settings.SYMBOL_AS:
        return this.ascendant(x, y)
      case this.settings.SYMBOL_DS:
        return this.descendant(x, y)
      case this.settings.SYMBOL_MC:
        return this.mediumCoeli(x, y)
      case this.settings.SYMBOL_IC:
        return this.immumCoeli(x, y)
      case this.settings.SYMBOL_CUSP_1:
        return this.number1(x, y)
      case this.settings.SYMBOL_CUSP_2:
        return this.number2(x, y)
      case this.settings.SYMBOL_CUSP_3:
        return this.number3(x, y)
      case this.settings.SYMBOL_CUSP_4:
        return this.number4(x, y)
      case this.settings.SYMBOL_CUSP_5:
        return this.number5(x, y)
      case this.settings.SYMBOL_CUSP_6:
        return this.number6(x, y)
      case this.settings.SYMBOL_CUSP_7:
        return this.number7(x, y)
      case this.settings.SYMBOL_CUSP_8:
        return this.number8(x, y)
      case this.settings.SYMBOL_CUSP_9:
        return this.number9(x, y)
      case this.settings.SYMBOL_CUSP_10:
        return this.number10(x, y)
      case this.settings.SYMBOL_CUSP_11:
        return this.number11(x, y)
      case this.settings.SYMBOL_CUSP_12:
        return this.number12(x, y)
      default: {
        const unknownPoint = this.circle(x, y, 8)
        unknownPoint.setAttribute('stroke', '#ffff00')
        unknownPoint.setAttribute('stroke-width', '1')
        unknownPoint.setAttribute('fill', '#ff0000')
        return unknownPoint
      }
    }
  }

  /**
   * Get a required symbol.
   *
   * @param {String} name
   * @param {int} x
   * @param {int} y
   *
   * @return {SVGElement g}
   */
  getSymbol(name: string, x: number, y: number): Element {
    if (this.settings.CUSTOM_SYMBOL_FN == null) return this._getSymbol(name, x, y)

    const symbol = this.settings.CUSTOM_SYMBOL_FN(name, x, y, this.context)
    if (symbol == null || symbol === undefined) return this._getSymbol(name, x, y)

    return symbol
  }

  /**
   * Create transparent rectangle.
   *
   * Used to improve area click, @see this.settings.ADD_CLICK_AREA
   *
   * @param {Number} x
   * @param {Number} y
   *
   * @return {Element} rect
   */
  createRectForClick(x: number, y: number): Element {
    const rect = document.createElementNS(this.context.root.namespaceURI, 'rect')
    rect.setAttribute('x', (x - this.settings.SIGNS_STROKE).toString())
    rect.setAttribute('y', (y - this.settings.SIGNS_STROKE).toString())
    rect.setAttribute('width', '20px')
    rect.setAttribute('height', '20px')
    rect.setAttribute('fill', 'transparent')
    return rect
  }

  /**
   * Get ID for sign wrapper.
   *
   * @param {String} sign
   *
   * @return {String id}
   */
  getSignWrapperId(sign: string): string {
    return this._paperElementId + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_SIGNS + '-' + sign
  }

  /**
   * Get ID for house wrapper.
   *
   * @param {String} house
   *
   * @return {String id}
   */
  getHouseIdWrapper(house: string): string {
    return this._paperElementId + '-' + this.settings.ID_RADIX + '-' + this.settings.ID_CUSPS + '-' + house
  }

  /*
   * Sun path
   * @private
   *
   * @param {int} x
   * @param {int} y
   *
   * @return {SVG g}
   */
  sun(x: number, y: number): Element {
    // center symbol
    const xShift = -1 // px
    const yShift = -8 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Moon path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  moon(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = -7 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Mercury path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  mercury(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = 7 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const body = document.createElementNS(this.context.root.namespaceURI, 'path')
    body.setAttribute('d', 'm' + x + ', ' + y + ' 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z')
    body.setAttribute('stroke', this.settings.POINTS_COLOR)
    body.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    body.setAttribute('fill', 'none')
    wrapper.appendChild(body)

    const crownXShift = 6 // px
    const crownYShift = -16 // px
    const crown = document.createElementNS(this.context.root.namespaceURI, 'path')
    crown.setAttribute('d', 'm' + (x + crownXShift) + ', ' + (y + crownYShift) + ' a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445')
    crown.setAttribute('stroke', this.settings.POINTS_COLOR)
    crown.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    crown.setAttribute('fill', 'none')
    wrapper.appendChild(crown)

    return wrapper
  }

  /*
 * Venus path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  venus(x: number, y: number): Element {
    // center symbol
    const xShift = 2 // px
    const yShift = 7 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Mars path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  mars(x: number, y: number): Element {
    // center symbol
    const xShift = 2 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Jupiter path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  jupiter(x: number, y: number): Element {
    // center symbol
    const xShift = -5 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y - 3))

    return wrapper
  }

  /*
 * Saturn path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  saturn(x: number, y: number): Element {
    // center symbol
    const xShift = 5 // px
    const yShift = 10 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Uranus path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  uranus(x: number, y: number): Element {
    // center symbol
    const xShift = -5 // px
    const yShift = -7 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const horns = document.createElementNS(this.context.root.namespaceURI, 'path')
    horns.setAttribute('d', 'm' + x + ', ' + y + '  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985')
    horns.setAttribute('stroke', this.settings.POINTS_COLOR)
    horns.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    horns.setAttribute('fill', 'none')
    wrapper.appendChild(horns)

    const bodyXShift = 7 // px
    const bodyYShift = 14.5 // px
    const body = document.createElementNS(this.context.root.namespaceURI, 'path')
    body.setAttribute('d', 'm' + (x + bodyXShift) + ', ' + (y + bodyYShift) + ' a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z')
    body.setAttribute('stroke', this.settings.POINTS_COLOR)
    body.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    body.setAttribute('fill', 'none')
    wrapper.appendChild(body)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))

    return wrapper
  }

  /*
 * Neptune path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  neptune(x: number, y: number): Element {
    // center symbol
    const xShift = 3 // px
    const yShift = -5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Pluto path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  pluto(x: number, y: number): Element {
    // center symbol
    const xShift = 5 // px
    const yShift = -5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const body = document.createElementNS(this.context.root.namespaceURI, 'path')
    body.setAttribute('d', 'm' + x + ', ' + y + ' a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0')
    body.setAttribute('stroke', this.settings.POINTS_COLOR)
    body.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    body.setAttribute('fill', 'none')
    wrapper.appendChild(body)

    const headXShift = -2.3 // px
    const headYShift = 0 // px
    const head = document.createElementNS(this.context.root.namespaceURI, 'path')
    head.setAttribute('d', 'm' + (x + headXShift) + ', ' + (y + headYShift) + ' a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z')
    head.setAttribute('stroke', this.settings.POINTS_COLOR)
    head.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    head.setAttribute('fill', 'none')
    wrapper.appendChild(head)

    return wrapper
  }

  /*
 * Chiron path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  chiron(x: number, y: number): Element {
    // center symbol
    const xShift = 3 // px
    const yShift = 5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const body = document.createElementNS(this.context.root.namespaceURI, 'path')
    body.setAttribute('d', 'm' + x + ', ' + y + ' a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z')
    body.setAttribute('stroke', this.settings.POINTS_COLOR)
    body.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    body.setAttribute('fill', 'none')
    wrapper.appendChild(body)

    const headXShift = 0 // px
    const headYShift = -13 // px
    const head = document.createElementNS(this.context.root.namespaceURI, 'path')
    head.setAttribute('d', 'm' + (x + headXShift) + ', ' + (y + headYShift) + '   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251')
    head.setAttribute('stroke', this.settings.POINTS_COLOR)
    head.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    head.setAttribute('fill', 'none')
    wrapper.appendChild(head)

    return wrapper
  }

  /*
 * Lilith path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  lilith(x: number, y: number): Element {
    // center symbol
    const xShift = 2 // px
    const yShift = 4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * NNode path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  nnode(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = 3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * SNode path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  snode(x: number, y: number): Element {
    // center symbol
    const xShift = 0
    const yShift = -5

    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' l1.3333282470703125,0.666656494140625l0.6666717529296875,0l1.3333282470703125,-0.666656494140625l0.6666717529296875,-1.333343505859375l0,-0.666656494140625l-0.6666717529296875,-1.333343505859375l-1.3333282470703125,-0.666656494140625l-0.6666717529296875,0l-1.3333282470703125,0.666656494140625l-0.6666717529296875,1.333343505859375l0,0.666656494140625l0.6666717529296875,1.333343505859375l2,2.666656494140625l0.6666717529296875,2l0,1.333343505859375l-0.6666717529296875,2l-1.3333282470703125,1.333343505859375l-2,0.666656494140625l-2.6666717529296875,0l-2,-0.666656494140625l-1.3333282470703125,-1.333343505859375l-0.6666717529296875,-2l0,-1.333343505859375l0.6666717529296875,-2l2,-2.666656494140625l0.666656494140625,-1.333343505859375l0,-0.666656494140625l-0.666656494140625,-1.333343505859375l-1.333343505859375,-0.666656494140625l-0.666656494140625,0l-1.333343505859375,0.666656494140625l-0.666656494140625,1.333343505859375l0,0.666656494140625l0.666656494140625,1.333343505859375l1.333343505859375,0.666656494140625l0.666656494140625,0l1.333343505859375,-0.666656494140625m8,6l-0.6666717529296875,1.333343505859375l-1.3333282470703125,1.33331298828125l-2,0.66668701171875l-2.6666717529296875,0l-2,-0.66668701171875l-1.3333282470703125,-1.33331298828125l-0.6666717529296875,-1.333343505859375')
    node.setAttribute('stroke', this.settings.POINTS_COLOR)
    node.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /*
 * Fortune path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  fortune(x: number, y: number): Element {
    // center symbol
    const xShift = -10
    const yShift = -8
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')

    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const path1 = document.createElementNS(this.context.root.namespaceURI, 'path')
    path1.setAttribute('d', 'M15.971322059631348,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,15.97132396697998A7.971322252863855,7.971322252863855,0,0,1,0.028678132221102715,8.000000953674316A7.971322252863855,7.971322252863855,0,0,1,8,0.028677448630332947A7.971322252863855,7.971322252863855,0,0,1,15.971322059631348,8.000000953674316Z')
    const path2 = document.createElementNS(this.context.root.namespaceURI, 'path')
    path2.setAttribute('d', 'M2.668839454650879,2.043858766555786C6.304587364196777,5.906839370727539,9.94033432006836,9.769822120666504,13.576082229614258,13.632804870605469')
    const path3 = document.createElementNS(this.context.root.namespaceURI, 'path')
    path3.setAttribute('d', 'm2.5541272163391113,13.747519493103027c3.635746955871582,-3.8629846572875977,7.271494388580322,-7.72596549987793,10.90724229812622,-11.588947772979736')
    const fortuneGroup = document.createElementNS(this.context.root.namespaceURI, 'g')
    fortuneGroup.setAttribute('transform', 'translate(' + x + ',' + y + ')')
    fortuneGroup.appendChild(path1)
    fortuneGroup.appendChild(path2)
    fortuneGroup.appendChild(path3)


    wrapper.setAttribute('stroke', this.settings.POINTS_COLOR)
    wrapper.setAttribute('stroke-width', this.settings.POINTS_STROKE.toString())
    wrapper.setAttribute('fill', 'none')
    wrapper.appendChild(fortuneGroup)


    return wrapper
  }

  /*
 * Aries symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  aries(x: number, y: number): Element {
    // center symbol
    const xShift = -9 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_ARIES))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    // Custom Aries path from your scaled SVG
    node.setAttribute('d', 'M11.5527,18.9793L8.48066,19L8.4787,17.2497C8.47747,15.6081 8.30674,13.7414 7.97213,11.7016C7.6363,9.68111 7.2259,8.01553 6.75244,6.75332C5.48026,3.3866 4.46075,3.02893 4.08125,3.03164C4.00496,3.03214 3.93406,3.04128 3.87077,3.05832C3.76602,3.08697 3.60608,3.15391 3.42578,3.4029C3.18905,3.7371 3.07204,4.1916 3.07253,4.7859C3.07351,5.65191 3.36568,6.56485 3.94069,7.49904L4.74285,8.80226L1.3372,8.82548L1.08943,8.3816C0.367725,7.08728 0.000984213,5.83988 2.96752e-06,4.674C-0.00122359,3.40932 0.377783,2.32841 1.12696,1.46116C1.90239,0.562795 2.92044,0.0885389 4.09131,0.0806347C5.92575,0.0677902 7.46924,1.2275 8.67838,3.52739C9.20899,4.53617 9.64663,5.71761 9.98933,7.06282C10.3222,5.74973 10.7552,4.57817 11.2863,3.55654C12.2651,1.67285 13.4718,0.523768 14.872,0.141399C15.2071,0.0502526 15.5552,0.00257998 15.907,0.000109891C17.0855,-0.00804139 18.0807,0.437315 18.8649,1.32383C19.6163,2.16514 19.9993,3.23888 20,4.51172C20.0012,5.67612 19.6404,6.93537 18.9275,8.25365L18.6822,8.70716L15.3307,8.73038L16.0483,7.4447C16.6329,6.39738 16.9287,5.4464 16.9277,4.61843C16.9272,4.01523 16.8056,3.53431 16.5661,3.18924C16.3431,2.87949 16.1214,2.83626 15.9165,2.83799C15.8498,2.83824 15.7851,2.84738 15.7183,2.86566C15.291,2.98224 14.4165,3.58544 13.3602,6.31389C12.8568,7.60674 12.4361,9.28713 12.0732,11.4524C11.7254,13.5587 11.5498,15.5206 11.5515,17.2813L11.5527,18.9793Z')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', this.settings.SIGNS_COLOR)

    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y - 4))

    return wrapper
  }

  /*
 * Taurus symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  taurus(x: number, y: number): Element {
    // center symbol
    const xShift = -9 // px
    const yShift = -11 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_TAURUS))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    // Custom Taurus path from your scaled SVG
    node.setAttribute('d', 'M14.4563,17.893L14.4329,17.9168C13.0656,19.2909 11.4335,19.9908 9.57908,19.9999C7.72519,20.0088 6.08742,19.3251 4.71059,17.9672C3.33067,16.6043 2.62718,14.9685 2.61945,13.1042C2.61379,11.8146 2.95226,10.6118 3.62509,9.52833C4.03286,8.87051 4.54496,8.28085 5.15519,7.77005C5.00476,7.65567 4.86283,7.53477 4.73042,7.40681C4.26908,6.95477 3.79665,6.28546 3.28018,5.35526L2.71734,4.3449C2.36341,3.71111 1.80546,2.95536 1.16097,2.95849L0.0115916,2.96398L0,0.094795L1.58883,0.0853938C3.15885,0.0780818 4.55062,1.10281 5.7273,3.13111L6.49905,4.48592C6.9385,5.23253 7.38079,5.75168 7.80813,6.01805C8.2226,6.2818 8.79729,6.41133 9.52318,6.40793C10.2488,6.40454 10.822,6.26953 11.2277,6.00603C11.6712,5.72348 12.0988,5.20328 12.528,4.44936L13.2977,3.09402C14.4509,1.05371 15.8414,0.0151463 17.3973,0.00861773L18.9858,0L19,2.8731L17.8542,2.87597C17.3336,2.87832 16.8035,3.36561 16.3046,4.27883L15.7492,5.29598C15.252,6.20894 14.7956,6.87198 14.3538,7.32246L14.3221,7.35458C14.1884,7.48541 14.0455,7.60971 13.8937,7.72671C14.5076,8.23149 15.0251,8.81463 15.4401,9.47036C16.1168,10.539 16.463,11.7389 16.4679,13.0363C16.4756,14.8901 15.7989,16.5244 14.4563,17.893ZM6.87642,10.5108C6.1616,11.2396 5.81617,12.0943 5.82004,13.1243C5.82442,14.1388 6.18273,14.98 6.91583,15.695C7.65281,16.4254 8.5178,16.7753 9.56543,16.7701C10.6025,16.7649 11.4636,16.4055 12.1975,15.6715L12.24,15.6292C12.9399,14.9157 13.2781,14.0842 13.274,13.0872C13.2699,12.0502 12.9123,11.1939 12.1802,10.4687C11.4533,9.74273 10.5888,9.39358 9.5358,9.39907C8.48869,9.40351 7.6237,9.76284 6.89008,10.4972L6.87642,10.5108Z')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', this.settings.SIGNS_COLOR)
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Gemini symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  gemini(x: number, y: number): Element {
    // center symbol
    const xShift = -6 // px
    const yShift = -6 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_GEMINI))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    // Custom Gemini path from your scaled SVG
    node.setAttribute('d', 'M18.9056,20L17.8019,19.7048C15.2557,19.0231 12.4476,18.6716 9.45495,18.6605C6.46058,18.6491 3.65168,18.9794 1.107,19.6422L0,19.9304L0.0148473,16.808L0.671651,16.6372C1.87478,16.3246 3.00368,16.0884 4.03897,15.9327L4.09559,4.03724C2.96971,3.88535 1.83603,3.64288 0.714683,3.31336L0.0797727,3.1269L0.0941167,0L1.20842,0.313371C3.45741,0.945412 6.25952,1.27216 9.53724,1.28452C12.8215,1.29714 15.6294,0.991333 17.8829,0.375692L19,0.070395L18.9852,3.19881L18.3475,3.37997C17.2186,3.70066 16.0799,3.9348 14.9527,4.07837L14.8961,15.9734C15.9274,16.1356 17.0364,16.3763 18.2637,16.703L18.9202,16.8779L18.9056,20ZM7.36174,15.6567C8.00797,15.6151 8.70529,15.5967 9.46955,15.5992C10.2336,15.6022 10.9306,15.6262 11.5766,15.6726L11.6305,4.31529C10.992,4.33825 10.2867,4.34834 9.52265,4.34557C8.75537,4.34254 8.05025,4.32715 7.41559,4.2999L7.36174,15.6567Z')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', this.settings.SIGNS_COLOR)
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Cancer symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  cancer(x: number, y: number): Element {
    // center symbol
    const xShift = 9 // px
    const yShift = -9 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_CANCER))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    // Custom Cancer path from your scaled SVG
    node.setAttribute('d', 'M0,13.7759L0.000414933,10.6001L1.02779,11.0687C3.96759,12.4098 6.83873,13.0893 9.56173,13.0893C10.6607,13.0895 11.632,13.0016 12.4658,12.8267C12.215,12.5874 12.0003,12.327 11.8231,12.0471C11.3881,11.3861 11.153,10.5599 11.153,9.63689C11.1528,8.42751 11.5924,7.37467 12.4596,6.50714C13.3312,5.64419 14.3876,5.20792 15.6019,5.20813C16.8139,5.20813 17.8598,5.64336 18.7104,6.50234C19.5575,7.35049 19.9992,8.41376 19.9998,9.61501C20,11.5235 18.8755,13.101 16.6575,14.3037C14.5907,15.4287 11.9739,15.9998 8.88124,16C6.20616,15.9994 3.36096,15.3167 0.424062,13.9704L0,13.7759ZM17.5062,9.10099C17.4181,8.77228 17.2492,8.48442 16.9894,8.22095C16.6042,7.82449 16.1465,7.63356 15.587,7.63335C15.0235,7.63335 14.5604,7.82533 14.1712,8.22053C13.7696,8.6222 13.5764,9.08661 13.5762,9.64419C13.5762,9.82929 13.5982,10.0058 13.6418,10.1688C13.7285,10.493 13.9015,10.78 14.1712,11.046C14.5756,11.4399 15.0476,11.6331 15.6098,11.6336C16.1671,11.6331 16.6247,11.4468 17.0079,11.0635C17.3905,10.6806 17.5768,10.2232 17.5768,9.66566C17.5768,9.46618 17.5529,9.27608 17.5062,9.10099ZM0.149998,7.54455C0.0506219,7.17311 0.000207467,6.7777 0.000207467,6.36978C-0.000414933,4.4715 1.12426,2.8988 3.3427,1.69567C5.41799,0.570297 8.03456,-0.000208385 11.119,5.7097e-08C13.8036,-0.000208385 16.6488,0.679937 19.5759,2.02189L20,2.21615V5.39406L18.9718,4.92381C16.0511,3.58812 13.1824,2.91068 10.4457,2.91068C9.34658,2.91068 8.37564,2.99823 7.54245,3.17123C7.78955,3.40802 8.00261,3.66441 8.18041,3.93997C8.62564,4.63054 8.85447,5.44888 8.85406,6.35623C8.85447,7.5604 8.41236,8.61324 7.54059,9.48536C6.67856,10.3477 5.6238,10.7848 4.40576,10.7848C3.20578,10.7848 2.15911,10.3508 1.29501,9.49494C0.726548,8.92069 0.342942,8.26618 0.149998,7.54455ZM6.35885,5.83116C6.27234,5.50745 6.0989,5.22043 5.82878,4.95383C5.42795,4.55279 4.96364,4.35935 4.40556,4.35935C3.85369,4.35915 3.39146,4.54779 2.99271,4.9359C2.61657,5.31172 2.43068,5.76884 2.43047,6.32684C2.43047,6.90631 2.61636,7.37196 3.01055,7.77155C3.40598,8.17259 3.85162,8.35935 4.41261,8.35915C4.98356,8.35894 5.43708,8.17113 5.84019,7.7678C6.23313,7.37467 6.42379,6.91068 6.42379,6.34831C6.424,6.16613 6.40201,5.99229 6.35885,5.83116Z')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', this.settings.SIGNS_COLOR)
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x - 18, y))
    return wrapper
  }

  /*
 * Leo symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  leo(x: number, y: number): Element {
    // center symbol
    const xShift = -3 // px
    const yShift = 4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_LEO))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    // Custom Leo path from your scaled SVG
    node.setAttribute('d', 'M13.0983,1.60725C14.1172,2.65217 14.6338,4.0267 14.6344,5.69291C14.6346,6.50251 14.5482,7.21315 14.378,7.80535C14.2304,8.35054 13.8864,9.21573 13.2988,10.5152L12.6993,11.8565C11.3142,14.9372 11.1648,15.8525 11.1648,16.1029C11.1648,16.478 11.2858,16.6533 11.3768,16.7525L11.4145,16.7941C11.494,16.8756 11.6189,16.9694 11.88,16.9691C12.1001,16.9691 12.5892,16.8598 13.3981,16.1247L14.0511,15.5315L16,17.7164L15.3483,18.3299C14.1704,19.4379 12.9883,20 11.8354,20C10.7945,19.9997 9.90373,19.6364 9.18823,18.9198L9.16771,18.8987C8.46387,18.1769 8.10675,17.2826 8.10701,16.2411C8.10701,15.0227 8.67358,13.1967 9.83889,10.6599L10.678,8.8256C11.4092,7.22017 11.5629,6.27187 11.5629,5.75915C11.5629,4.86877 11.3314,4.18852 10.8545,3.67969L10.8092,3.63216C10.3495,3.16074 9.74264,2.93139 8.95471,2.93165C8.20376,2.93139 7.62022,3.14567 7.17091,3.58671C6.74009,4.02462 6.53393,4.58176 6.53393,5.32902C6.53393,6.10226 6.79176,7.04718 7.29983,8.1373L7.64099,8.86352C8.28253,10.2245 8.58139,11.1965 8.58139,11.9214C8.58139,13.065 8.13841,14.1144 7.30084,14.9562C6.46124,15.8014 5.4484,16.2297 4.29044,16.2297C3.10867,16.2299 2.09127,15.8016 1.26712,14.9564C0.421699,14.0884 -0.000253159,13.0344 1.1395e-07,11.8087C1.1395e-07,10.6175 0.416634,9.58195 1.23825,8.73054C1.97679,7.95808 2.8592,7.52692 3.86368,7.4477C3.59445,6.66017 3.46224,5.93057 3.46224,5.24279C3.46224,3.74021 3.99766,2.47373 5.05431,1.47868C6.0945,0.497396 7.40443,0 8.94813,0C10.6235,0 12.0039,0.524928 13.0514,1.55946L13.0983,1.60725ZM3.18668,12.9754C3.48073,13.277 3.81555,13.4177 4.23953,13.4175C4.65389,13.4175 4.98669,13.2718 5.28707,12.9593C5.58897,12.6456 5.72954,12.2884 5.72954,11.8352C5.72979,11.3728 5.59024,11.01 5.28986,10.6934C4.99454,10.391 4.65414,10.2464 4.22535,10.2458C3.8115,10.2458 3.4787,10.3916 3.17857,10.704C2.88174,11.0165 2.74193,11.3731 2.74193,11.8217C2.74193,12.2889 2.88199,12.6539 3.18212,12.9702')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', this.settings.SIGNS_COLOR)
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x - 6, y - 13))
    return wrapper
  }

  /*
 * Virgo symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  virgo(x: number, y: number): Element {
    // center symbol
    const xShift = -9 // px
    const yShift = -5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_VIRGO))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Libra symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  libra(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = -8 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_LIBRA))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x - 6, y))
    return wrapper
  }

  /*
 * Scorpio symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  scorpio(x: number, y: number): Element {
    // center symbol
    const xShift = -9 // px
    const yShift = -4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_SCORPIO))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Sagittarius symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  sagittarius(x: number, y: number): Element {
    // center symbol
    const xShift = 7 // px
    const yShift = -9 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_SAGITTARIUS))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x - 12, y))
    return wrapper
  }

  /*
 * Capricorn symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  capricorn(x: number, y: number): Element {
    // center symbol
    const xShift = -9 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_CAPRICORN))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Aquarius symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  aquarius(x: number, y: number): Element {
    // center symbol
    const xShift = -8 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_AQUARIUS))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /*
 * Pisces symbol path
 * @private
 *
 * @param {int} x
 * @param {int} y
 *
 * @return {SVGPathElement} path
 */
  pisces(x: number, y: number): Element {
    // center symbol
    const xShift = -8 // px
    const yShift = -8 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getSignWrapperId(this.settings.SYMBOL_PISCES))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0')
    node.setAttribute('stroke', this.settings.SIGNS_COLOR)
    node.setAttribute('stroke-width', this.settings.SIGNS_STROKE.toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /**
 * Draw As symbol
 */
  ascendant(x: number, y: number): Element {
    // center symbol
    const xShift = 12 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0')
    node.setAttribute('stroke', this.settings.SYMBOL_AXIS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')

    wrapper.appendChild(node)

    return wrapper
  }

  /**
 * Draw Ds symbol
 */
  descendant(x: number, y: number): Element {
    // center symbol
    const xShift = 22 // px
    const yShift = -1 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0')
    node.setAttribute('stroke', this.settings.SYMBOL_AXIS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /**
 * Draw MC symbol
 */
  mediumCoeli(x: number, y: number): Element {
    // center symbol
    const xShift = 19 // px
    const yShift = -4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881')
    node.setAttribute('stroke', this.settings.SYMBOL_AXIS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  /**
 * Draw IC symbol
 */
  immumCoeli(x: number, y: number): Element {
    // center symbol
    const xShift = 19 // px
    const yShift = 2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm ' + x + ', ' + y + ' -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401')
    node.setAttribute('stroke', this.settings.SYMBOL_AXIS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.SYMBOL_AXIS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    return wrapper
  }

  number1(x: number, y: number): Element {
    // center symbol
    const xShift = 0 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_1))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number2(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_2))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number3(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_3))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' 0,-0.4545454 0.45454549,0 0,0.9090909 -0.90909089,0 0,-0.9090909 0.4545454,-0.9090909 0.45454549,-0.4545455 1.36363636,-0.4545454 1.36363635,0 1.3636364,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.4545455,0.4545454 -0.9090909,0.4545455 -1.36363635,0.4545454 m 2.27272725,-4.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.4545454,0.4545454 m -0.4545455,-3.6363636 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -0.90909095,0.4545454 m -0.9090909,0 0.9090909,0 1.36363635,0.4545455 0.4545455,0.45454542 0.4545454,0.90909091 0,1.36363637 -0.4545454,0.9090909 -0.9090909,0.4545455 -1.3636364,0.4545454 -1.3636364,0 -1.3636363,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.90909091 0.9090909,0 0,0.90909091 -0.4545455,0 0,-0.45454546 m 5,-1.81818182 0.4545455,0.90909091 0,1.36363637 -0.4545455,0.9090909 m -1.36363635,-4.0909091 0.90909095,0.4545455 0.4545454,0.90909088 0,1.81818182 -0.4545454,0.9090909 -0.45454549,0.4545455 -0.90909091,0.4545454')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number4(x: number, y: number): Element {
    // center symbol
    const xShift = 1 // px
    const yShift = -4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_4))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -2.28678383,7.7750651 0.91471356,0 m 2.74414057,-9.6044922 -0.9147135,1.8294271 -2.28678386,7.7750651 m 3.20149736,-9.6044922 -2.74414057,9.6044922 m 2.74414057,-9.6044922 -7.3177083,6.8603516 7.3177083,0')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number5(x: number, y: number): Element {
    // center symbol
    const xShift = -2 // px
    const yShift = -5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_5))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -2.27272725,4.5454545 m 2.27272725,-4.5454545 4.54545455,0 m -4.54545455,0.4545454 3.63636365,0 m -4.0909091,0.4545455 2.2727273,0 1.8181818,-0.4545455 0.9090909,-0.4545454 m -6.8181818,4.5454545 0.4545454,-0.4545454 1.3636364,-0.4545455 1.36363636,0 1.36363634,0.4545455 0.4545455,0.4545454 0.4545454,0.90909092 0,1.36363638 -0.4545454,1.3636364 -0.9090909,0.9090909 -1.81818185,0.4545454 -1.36363635,0 -0.9090909,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.9090909 0.9090909,0 0,0.9090909 -0.4545455,0 0,-0.45454545 m 5,-2.72727275 0.4545455,0.90909092 0,1.36363638 -0.4545455,1.3636364 -0.9090909,0.9090909 m -0.45454544,-5.4545455 0.90909094,0.4545455 0.4545454,0.9090909 0,1.8181818 -0.4545454,1.3636364 -0.90909094,0.9090909 -0.90909091,0.4545454')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number6(x: number, y: number): Element {
    // center symbol
    const xShift = 3 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_6))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' 0,-0.4545455 -0.4545455,0 0,0.9090909 0.9090909,0 0,-0.9090909 -0.4545454,-0.9090909 -0.909091,-0.4545454 -1.3636363,0 -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 1.36363637,0 1.36363633,-0.4545454 0.9090909,-0.9090909 0.4545455,-0.90909096 0,-1.36363636 -0.4545455,-0.90909088 -0.4545454,-0.4545455 -0.9090909,-0.4545454 -1.36363638,0 -0.90909092,0.4545454 -0.4545454,0.4545455 -0.4545455,0.90909088 m 1.36363636,-4.54545458 -0.90909086,1.3636364 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 4.0909091,-0.4545454 0.4545454,-0.90909096 0,-1.36363636 -0.4545454,-0.90909088 m -0.9090909,-5 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 1.36363637,0 0.90909093,-0.4545454 0.4545454,-0.4545455 0.4545455,-1.36363636 0,-1.81818182 -0.4545455,-0.90909092 -0.4545454,-0.4545454')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number7(x: number, y: number): Element {
    // center symbol
    const xShift = -4 // px
    const yShift = -4 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_7))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -0.9090909,2.7272727 m 6.8181818,-2.7272727 -0.4545454,1.3636363 -0.909091,1.3636364 -1.8181818,2.2727273 -0.90909088,1.36363633 -0.45454546,1.36363637 -0.45454545,1.8181818 m 0.90909091,-3.63636362 -0.90909091,1.81818182 -0.45454546,1.8181818 m 4.09090905,-6.8181818 -2.72727268,2.72727272 -0.90909091,1.36363637 -0.45454546,0.90909091 -0.45454545,1.8181818 0.90909091,0 m -1.36363641,-8.1818182 1.36363641,-1.3636363 0.90909091,0 2.27272728,1.3636363 m -3.63636365,-0.9090909 1.36363637,0 2.27272728,0.9090909 m -4.5454546,0 0.90909095,-0.4545454 1.36363637,0 2.27272728,0.4545454 0.9090909,0 0.4545455,-0.4545454 0.4545454,-0.9090909')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number8(x: number, y: number): Element {
    // center symbol
    const xShift = -1 // px
    const yShift = -5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_8))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -1.3631244,0.4543748 -0.4543748,0.4543748 -0.4543748,0.9087496 0,1.3631244 0.4543748,0.9087496 0.9087496,0.4543748 1.3631244,0 1.3631244,-0.4543748 0.9087496,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 -0.9087496,-0.4543748 -1.8174992,0 m 0.9087496,0 -2.271874,0.4543748 m 0,0.4543748 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.4543748 m -0.4543748,0 1.3631244,0.4543748 m 0.4543748,0 1.8174992,-0.4543748 m 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 m 0.4543748,0 -1.8174992,-0.4543748 m -0.9087496,0 -0.9087496,0.9087496 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.9087496 m 1.3631244,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.8174992 -0.4543748,-0.9087496 m -2.7262488,4.543748 -1.8174992,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 1.3631244,0.4543748 1.8174992,0 1.8174992,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 -0.4543748,-0.45437484 -0.9087496,-0.4543748 m -0.9087496,0 -2.271874,0.4543748 m 0.4543748,0 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 m -0.4543748,0 2.271874,0.4543748 2.7262488,-0.4543748 m 0,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 m 0,-0.45437484 -1.3631244,-0.4543748 m -0.9087496,0 -0.9087496,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 0.4543748,0.4543748 m 1.8174992,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.81749916 -0.4543748,-0.90874964 -0.4543748,-0.4543748')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number9(x: number, y: number): Element {
    // center symbol
    const xShift = 1 // px
    const yShift = -2 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_9))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const node = document.createElementNS(this.context.root.namespaceURI, 'path')
    node.setAttribute('d', 'm' + x + ', ' + y + ' -0.4545455,0.9090909 -0.4545454,0.4545455 -0.9090909,0.45454542 -1.36363638,0 -0.90909092,-0.45454542 -0.4545454,-0.4545455 -0.4545455,-0.9090909 0,-1.3636364 0.4545455,-0.9090909 0.90909086,-0.9090909 1.36363637,-0.4545454 1.36363637,0 0.9090909,0.4545454 0.4545455,0.4545455 0.4545454,1.3636363 0,1.3636364 -0.4545454,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 -0.9090909,0.9090909 -1.36363638,0.4545454 -1.36363632,0 -0.909091,-0.4545454 -0.4545454,-0.9090909 0,-0.90909096 0.9090909,0 0,0.90909096 -0.4545455,0 0,-0.4545455 m 1.3636364,-3.1818182 -0.4545454,-0.9090909 0,-1.3636364 0.4545454,-0.9090909 m 4.0909091,-0.4545454 0.4545455,0.9090909 0,1.8181818 -0.4545455,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 m -1.81818178,-2.72727278 -0.45454546,-0.45454542 -0.45454546,-0.9090909 0,-1.8181819 0.45454546,-1.3636363 0.45454546,-0.4545455 0.90909091,-0.4545454 m 1.36363637,0 0.4545454,0.4545454 0.4545455,0.9090909 0,2.2727273 -0.4545455,1.81818182 -0.4545454,1.36363637 -0.4545455,0.90909091 -0.90909087,1.3636364 -0.90909091,0.4545454')
    node.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    node.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    node.setAttribute('fill', 'none')
    wrapper.appendChild(node)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number10(x: number, y: number): Element {
    // center symbol
    const xShift = -3 // px
    const yShift = -3.5 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_10))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const one = document.createElementNS(this.context.root.namespaceURI, 'path')
    one.setAttribute('d', 'm' + x + ', ' + y + ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915')
    one.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    one.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    one.setAttribute('fill', 'none')
    wrapper.appendChild(one)

    const numberXShift = 6.5 // px
    const numberYShift = -1.5 // px
    const zero = document.createElementNS(this.context.root.namespaceURI, 'path')
    zero.setAttribute('d', 'm' + (x + numberXShift) + ', ' + (y + numberYShift) + ' -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 0.90909092,0 1.36363638,-0.4545454 0.9090909,-0.9090909 0.9090909,-1.36363641 0.4545455,-1.36363637 0.4545454,-1.81818182 0,-1.3636364 -0.4545454,-1.3636363 -0.4545455,-0.4545455 -0.9090909,-0.4545454 -0.9090909,0 m -1.36363638,0.9090909 -0.90909092,0.9090909 -0.4545454,0.9090909 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 3.1818182,0 0.9090909,-0.9090909 0.4545454,-0.90909091 0.4545455,-1.36363637 0.4545455,-1.81818182 0,-1.8181818 -0.4545455,-0.9090909 m -1.8181818,-0.9090909 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 0.90909092,0 0.90909091,-0.4545454 0.90909087,-1.3636364 0.4545455,-0.90909091 0.4545454,-1.36363637 0.4545455,-1.81818182 0,-2.2727273 -0.4545455,-0.9090909 -0.4545454,-0.4545454')
    zero.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    zero.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    zero.setAttribute('fill', 'none')
    wrapper.appendChild(zero)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number11(x: number, y: number): Element {
    // center symbol
    const xShift = -3 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_11))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const one = document.createElementNS(this.context.root.namespaceURI, 'path')
    one.setAttribute('d', 'm' + x + ', ' + y + ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915')
    one.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    one.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    one.setAttribute('fill', 'none')
    wrapper.appendChild(one)

    const numberXShift = 6 // px
    const numberYShift = 0 // px
    const one2 = document.createElementNS(this.context.root.namespaceURI, 'path')
    one2.setAttribute('d', 'm' + (x + numberXShift) + ', ' + (y + numberYShift) + ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915')
    one2.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    one2.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    one2.setAttribute('fill', 'none')
    wrapper.appendChild(one2)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  number12(x: number, y: number): Element {
    // center symbol
    const xShift = -3 // px
    const yShift = -3 // px
    x = Math.round(x + (xShift * this.settings.SYMBOL_SCALE))
    y = Math.round(y + (yShift * this.settings.SYMBOL_SCALE))

    const wrapper = document.createElementNS(this.context.root.namespaceURI, 'g')
    wrapper.setAttribute('id', this.getHouseIdWrapper(this.settings.SYMBOL_CUSP_12))
    wrapper.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')

    const one = document.createElementNS(this.context.root.namespaceURI, 'path')
    one.setAttribute('d', 'm' + x + ', ' + y + ' -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915')
    one.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    one.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    one.setAttribute('fill', 'none')
    wrapper.appendChild(one)

    const numberXShift = 4 // px
    const numberYShift = 1 // px
    const two = document.createElementNS(this.context.root.namespaceURI, 'path')
    two.setAttribute('d', 'm' + (x + numberXShift) + ', ' + (y + numberYShift) + ' 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455')
    two.setAttribute('stroke', this.settings.CUSPS_FONT_COLOR)
    two.setAttribute('stroke-width', (this.settings.CUSPS_STROKE * this.settings.SYMBOL_SCALE).toString())
    two.setAttribute('fill', 'none')
    wrapper.appendChild(two)

    if (this.settings.ADD_CLICK_AREA) wrapper.appendChild(this.createRectForClick(x, y))
    return wrapper
  }

  /**
 * Draw circular sector
 *
 * @param {int} x - circle x center position
 * @param {int} y - circle y center position
 * @param {int} radius - circle radius in px
 * @param {int} a1 - angleFrom in degree
 * @param {int} a2 - angleTo in degree
 * @param {int} thickness - from outside to center in px
 *
 * @return {SVGElement} segment
 *
 * @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
 */
  segment(x: number, y: number, radius: number, a1: number, a2: number, thickness: number, lFlag?: number, sFlag?: number): Element {
    // @see SVG Path arc: https://www.w3.org/TR/SVG/paths.html#PathData
    const LARGE_ARC_FLAG = lFlag || 0
    const SWEET_FLAG = sFlag || 0

    a1 = ((this.settings.SHIFT_IN_DEGREES - a1) % 360) * Math.PI / 180
    a2 = ((this.settings.SHIFT_IN_DEGREES - a2) % 360) * Math.PI / 180

    const segment = document.createElementNS(this.context.root.namespaceURI, 'path')
    segment.setAttribute('d', 'M ' + (x + thickness * Math.cos(a1)) + ', ' + (y + thickness * Math.sin(a1)) + ' l ' + ((radius - thickness) * Math.cos(a1)) + ', ' + ((radius - thickness) * Math.sin(a1)) + ' A ' + radius + ', ' + radius + ',0 ,' + LARGE_ARC_FLAG + ', ' + SWEET_FLAG + ', ' + (x + radius * Math.cos(a2)) + ', ' + (y + radius * Math.sin(a2)) + ' l ' + ((radius - thickness) * -Math.cos(a2)) + ', ' + ((radius - thickness) * -Math.sin(a2)) + ' A ' + thickness + ', ' + thickness + ',0 ,' + LARGE_ARC_FLAG + ', ' + 1 + ', ' + (x + thickness * Math.cos(a1)) + ', ' + (y + thickness * Math.sin(a1)))
    segment.setAttribute('fill', 'none')
    return segment
  }

  /**
 * Draw line in circle
 *
 * @param {int} x1
 * @param {int} y2
 * @param {int} x2
 * @param {int} y2
 * @param {String} color - HTML rgb
 *
 * @return {SVGElement} line
 */
  line(x1: number, y1: number, x2: number, y2: number): Element {
    const line = document.createElementNS(this.context.root.namespaceURI, 'line')
    line.setAttribute('x1', x1.toString())
    line.setAttribute('y1', y1.toString())
    line.setAttribute('x2', x2.toString())
    line.setAttribute('y2', y2.toString())
    return line
  }

  /**
 * Draw a circle
 *
 * @param {int} cx
 * @param {int} cy
 * @param {int} radius
 *
 * @return {SVGElement} circle
 */
  circle(cx: number, cy: number, radius: number): Element {
    const circle = document.createElementNS(this.context.root.namespaceURI, 'circle')
    circle.setAttribute('cx', cx.toString())
    circle.setAttribute('cy', cy.toString())
    circle.setAttribute('r', radius.toString())
    circle.setAttribute('fill', 'none')
    return circle
  }

  /**
 * Draw a text
 *
 * @param {String} text
 * @param {int} x
 * @param {int} y
 * @param {String} size - etc. "13px"
 * @param {String} color - HTML rgb
 *
 * @return {SVGElement} text
 */
  text(txt: string, x: number, y: number, size: string, color: string): Element {
    const text = document.createElementNS(this.context.root.namespaceURI, 'text')
    text.setAttribute('x', x.toString())
    text.setAttribute('y', y.toString())
    text.setAttribute('font-size', size)
    text.setAttribute('fill', color)
    text.setAttribute('font-family', 'serif')
    text.setAttribute('dominant-baseline', 'central')
    text.appendChild(document.createTextNode(txt))
    text.setAttribute('transform', 'translate(' + (-x * (this.settings.SYMBOL_SCALE - 1)) + ',' + (-y * (this.settings.SYMBOL_SCALE - 1)) + ') scale(' + this.settings.SYMBOL_SCALE + ')')
    return text
  }
}

export default SVG
