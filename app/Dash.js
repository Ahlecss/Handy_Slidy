import { Color, Mesh, Plane, Program } from 'ogl'

import AutoBind from 'auto-bind'

import fragment from 'shaders/dash-fragment.glsl'
import vertex from 'shaders/dash-vertex.glsl'

import { isOdd } from 'utils/math'


import { random } from 'utils/math'

export default class {
  constructor ({ gl, plane, renderer, title, index }) {
    AutoBind(this)

    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.title = title
    this.index = index

    this.createShader()
    this.createMesh()
  }

  createShader () {
}

createMesh() {
    const program = new Program(this.gl, {
        vertex,
        fragment,
        uniforms: {
          uColor: { value: new Color('#ffffff') },
        },
        transparent: true
      })
      const geometry = new Plane(this.gl)
  
      geometry.computeBoundingBox()
  
      this.mesh = new Mesh(this.gl, { geometry, program })
      this.mesh.position.y = -this.plane.scale.y * 0.3
      this.mesh.scale.x = 0.1
      this.mesh.scale.y = 0.0075

      if(isOdd(this.index)){
        this.mesh.position.x = this.plane.scale.x * 0.60
    } else {
        this.mesh.position.x = -this.plane.scale.x * 2.95
      }

      this.mesh.setParent(this.plane)
  }

  update () {
    this.mesh.rotation.x = this.plane.rotation.x * 10

  }
}
