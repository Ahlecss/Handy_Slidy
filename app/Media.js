import { Mesh, Program, Texture } from 'ogl'

import fragment from 'shaders/image-fragment.glsl'
import vertex from 'shaders/image-vertex.glsl'

import { map, isOdd } from 'utils/math'

import Subtitle from './Subtitle'
import Title from './Title'
import Dash from './Dash'
import Square from './Square'

export default class {
  constructor ({ geometry, gl, image, index, length, renderer, scene, screen, title, subtitle, viewport }) {
    this.extra = 0

    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.title = title
    this.subtitle = subtitle
    this.viewport = viewport
    this.titles = []
    this.subtitles = []
    this.dashes = []

    this.createShader()
    this.createMesh()
    this.createTitle()

    this.onResize()
  }
  
  createShader () {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    })
    
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() }
      },
      transparent: true
    })
    
    const image = new Image()
    
    image.src = this.image
    image.onload = _ => {
      texture.image = image
      
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
    }
  }
  
  createMesh () {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    
    this.plane.setParent(this.scene)
  }
  
  createTitle () {

    const title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      title: this.title,
      index: this.index
    })
    this.titles.push(title)

    const subtitles = new Subtitle({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      subtitle: this.subtitle,
      index: this.index
    })
    this.subtitles.push(subtitles)
    
    const dash = new Dash({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      title: this.title,
      index: this.index
    })
    this.dashes.push(dash)

    /*const square = new Square({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      title: this.title,
      index: this.index
    })*/


  }
  
  update (scroll, direction) {
    this.plane.position.y = this.y - scroll.current - this.extra
    //this.plane.position.y = Math.cos((this.plane.position.x / this.widthTotal) * Math.PI) * 75 - 74.5
    this.plane.rotation.x = map(this.plane.position.y, -this.widthTotal, this.widthTotal, Math.PI, -Math.PI)
    
    this.speed = scroll.current - scroll.last

    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed
    
    const planeOffset = this.plane.scale.y / 2
    const viewportOffset = this.viewport.width

    this.isBefore = this.plane.position.y + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.y - planeOffset > viewportOffset

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }

    if(isOdd(this.index) === 0){
      this.plane.position.x = 8;
    } else {
      this.plane.position.x = -8;
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (this.titles) {
      this.titles.forEach(title => title.update())
    }

    if (this.subtitles) {
      this.subtitles.forEach(subtitle => subtitle.update())
    }

    if (this.dashes) {
      this.dashes.forEach(dash => dash.update())
    }
  }

  /**
   * Events.
   */
  onResize ({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen
    }

    if (viewport) {
      this.viewport = viewport

      this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
    }

    this.scale = this.screen.height / 1500

    this.plane.scale.y = this.viewport.height * (900 * this.scale) / this.screen.height
    this.plane.scale.x = this.viewport.width * (700 * this.scale) / this.screen.width

    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]

    this.padding = 5

    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length

    this.y = this.width * this.index
  }
}