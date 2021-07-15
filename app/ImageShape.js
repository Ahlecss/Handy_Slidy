import { Mesh, Program, Texture, Vec2 } from 'ogl'

import fragment from 'shaders/image-fragment.glsl'
import vertex from 'shaders/image-vertex.glsl'

import { map, isOdd } from 'utils/math'

import Subtitle from './Subtitle'
import Title from './Title'
import Dash from './Dash'
import Square from './Square'
import Circle from './Circle'

export default class {
  constructor({ geometry, gl, image, index, length, renderer, scene, screen, title, subtitle, viewport }) {
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
    this.squares = []
    this.circles = []

    this.createShader()
    this.createMesh()
    this.createTitle()

    this.onResize()
  }

  createShader() {
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
        uScrollY: { value: 1 },
        uResolution: { value: new Vec2(this.viewport.width * 100, this.viewport.height * 100) },
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

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.plane.setParent(this.scene)

    this.newPlane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.newPlane.setParent(this.scene)
  }

  createTitle() {
    
    const title = new Title({
      gl: this.gl,
      plane: this.newPlane,
      renderer: this.renderer,
      viewport: this.viewport,
      title: this.title,
      index: this.index
    })
    this.titles.push(title)

    const subtitles = new Subtitle({
      gl: this.gl,
      plane: this.newPlane,
      renderer: this.renderer,
      viewport: this.viewport,
      subtitle: this.subtitle,
      index: this.index
    })
    this.subtitles.push(subtitles)

    const dash = new Dash({
      gl: this.gl,
      plane: this.newPlane,
      renderer: this.renderer,
      viewport: this.viewport,
      title: this.title,
      index: this.index
    })
    this.dashes.push(dash)
    
    const square = new Square({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      viewport: this.viewport,
      title: this.title,
      scene: this.scene,
      index: this.index
    })
    this.squares.push(square)

    const circle = new Circle({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      viewport: this.viewport,
      title: this.title,
      scene: this.scene,
      index: this.index
    })
    this.circles.push(circle);
  }
  
  update(scroll, direction) {
    /*
    // influencia idea
    const angle = (2 * Math.PI) / this.length

    let aa = this.index * angle * 10
    console.log(aa);

    let step = this.index/this.length * Math.PI*2

    this.plane.position.x = (Math.cos(step) * 100)
    this.plane.position.y = ( Math.cos(this.index * Math.PI) * 20)
    this.plane.position.z = (Math.sin(step) * 100)

    this.plane.rotation.x = -aa - Math.PI / 2
    console.log(this.plane.rotation.x)
    */
    this.plane.position.y = this.y - scroll.current - this.extra
    this.newPlane.position.y = this.y - scroll.current - this.extra
    //this.plane.position.y = Math.cos((this.plane.position.x / this.widthTotal) * Math.PI) * 75 - 74.5
    this.plane.rotation.x = map(this.plane.position.y, -this.heightTotal, this.heightTotal, Math.PI / 2, -Math.PI / 2)
    this.newPlane.rotation.x = map(this.newPlane.position.y, -this.heightTotal, this.heightTotal, Math.PI / 2, -Math.PI / 2)

    this.speed = scroll.current - scroll.last

    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed
    this.program.uniforms.uScrollY.value = Math.abs(this.plane.position.y)

    const planeOffset = this.plane.scale.y / 2
    const viewportOffset = this.viewport.width

    this.isBefore = this.plane.position.y + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.y - planeOffset > viewportOffset

    if (direction === 'right' && this.isBefore) {
      this.extra -= this.heightTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += this.heightTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (isOdd(this.index) === 0) {
      this.plane.position.x = this.plane.scale.x;
      this.newPlane.position.x = this.newPlane.scale.x;
    } else {
      this.plane.position.x = -this.plane.scale.x;
      this.newPlane.position.x = -this.newPlane.scale.x;
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
    if (this.squares) {
      this.squares.forEach(square => square.update(scroll, direction, this.y, this.heightTotal))
    }
    if (this.circles) {
      this.circles.forEach(circle => circle.update())
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen
    }

    if (viewport) {
      this.viewport = viewport

      this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      this.newPlane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
    }

    this.scale = this.screen.height / 1500

    this.plane.scale.y = this.viewport.height * (900 * this.scale) / this.screen.height
    this.plane.scale.x = this.viewport.width * (700 * this.scale) / this.screen.width

    this.newPlane.scale.y = this.viewport.height * (900 * this.scale) / this.screen.height
    this.newPlane.scale.x = this.viewport.width * (700 * this.scale) / this.screen.width

    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.newPlane.program.uniforms.uPlaneSizes.value = [this.newPlane.scale.x, this.newPlane.scale.y]

    this.padding = 2

    this.height = this.plane.scale.y + this.padding
    this.heightTotal = this.height * this.length

    this.y = this.height * this.index
  }
}
