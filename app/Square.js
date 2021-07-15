import AutoBind from 'auto-bind'
import { Color, Geometry, Mesh, Program, Text, Plane, Texture, Vec2 } from 'ogl'

import fragment from 'shaders/square-fragment.glsl'
import vertex from 'shaders/square-vertex.glsl'
import { map, isOdd } from 'utils/math'

import rectangle from 'images/rectangle.jpg'

export default class {
  constructor({ gl, plane, renderer, scene, viewport, index }) {
    AutoBind(this)
    this.extra = 0

    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.scene = scene
    this.index = index
    this.viewport = viewport
    this.isOddR
    this.isOddL

    this.checkOdd()
    this.createShader()
    this.createMesh()
  }

  checkOdd() {
    if (isOdd(this.index) === 0) {
      this.oddL = 1
      this.oddR = 1
    } else {
      this.oddL = 0.2
      this.oddR = 0.35
    }
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    })

    this.program = new Program(this.gl, {
      depthTest: true,
      depthWrite: true,
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

    image.src = rectangle
    image.onload = _ => {
      texture.image = image

      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight]
    }
  }

  createMesh() {
    const geometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })

    geometry.computeBoundingBox()

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    if (isOdd(this.index) === 0) {
      this.mesh.position.x = this.mesh.scale.x * 7;
    } else {
      this.mesh.position.x = -this.mesh.scale.x * 7;
    }
    this.mesh.scale.x = 10
    this.mesh.scale.y = 12

    this.scene.addChild(this.mesh)
  }

  update(scroll, direction, y, heightTotal) {

    this.mesh.position.y = y - scroll.current - this.extra
    this.mesh.rotation.x = map(this.mesh.position.y, -heightTotal, heightTotal, Math.PI / 2, -Math.PI / 2)

    this.speed = scroll.current - scroll.last

    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed
    this.program.uniforms.uScrollY.value = Math.abs(this.mesh.position.y)

    const planeOffset = this.mesh.scale.y / 2
    const viewportOffset = this.viewport.width

    this.isBefore = this.mesh.position.y + planeOffset < -viewportOffset
    this.isAfter = this.mesh.position.y - planeOffset > viewportOffset

    if (direction === 'right' && this.isBefore) {
      this.extra -= heightTotal

      this.isBefore = false
      this.isAfter = false
    }

    if (direction === 'left' && this.isAfter) {
      this.extra += heightTotal

      this.isBefore = false
      this.isAfter = false
    }
  }

}
