import { Color, Mesh, Plane, Program, Vec2 } from 'ogl'

import fragment from 'shaders/background-fragment.glsl'
import vertex from 'shaders/background-vertex.glsl'

import { random } from 'utils/math'

export default class {
  constructor({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.geometry = new Plane(this.gl)
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color('#ffffff') },
        uResolution: { value: new Vec2(this.viewport.width * 100, this.viewport.height * 100) },
        uTime: { value: 1 * Math.random() }
      },
      transparent: true
    })
    /*
    Not needed finaly
          this.scene.addChild(mesh)
        }*/
  }

  update(scroll, direction) {
    this.program.uniforms.uTime.value += 0.004
  }
}
