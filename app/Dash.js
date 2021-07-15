import { Color, Mesh, Plane, Program, Vec2 } from 'ogl'

import AutoBind from 'auto-bind'

import fragment from 'shaders/dash-fragment.glsl'
import vertex from 'shaders/dash-vertex.glsl'

import { isOdd } from 'utils/math'


import { random } from 'utils/math'

export default class {
  constructor({ gl, plane, renderer, viewport, title, index }) {
    AutoBind(this)

    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.viewport = viewport
    this.title = title
    this.index = index

    this.createShader()
    this.createMesh()
  }

  createShader() {
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      transparent: true,
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color('#ffffff') },
        uResolution: { value: new Vec2(this.viewport.width * 100, this.viewport.height * 100) },
      },
      transparent: true
    })
  }

  createMesh() {
    const geometry = new Plane(this.gl)

    geometry.computeBoundingBox()

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.mesh.position.y = -this.plane.scale.y * - 0.1 - 0.2
    this.mesh.scale.x = 0.1
    this.mesh.scale.y = 0.0075

    if (isOdd(this.index)) {
      this.mesh.position.x = this.plane.scale.x * 0.35
    } else {
      this.mesh.position.x = -this.plane.scale.x * 2.65
    }

    this.mesh.setParent(this.plane)
  }

  update() {
    //this.mesh.rotation.x = this.plane.rotation.x

  }
}
