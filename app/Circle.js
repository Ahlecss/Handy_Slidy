import AutoBind from 'auto-bind'
import { Color, Geometry, Mesh, Program, Text, Plane, Texture, Vec2 } from 'ogl'

import fragment from 'shaders/circle-fragment.glsl'
import vertex from 'shaders/circle-vertex.glsl'
import { isOdd } from 'utils/math'

export default class {
  constructor({ gl, plane, renderer, scene, viewport, index }) {
    AutoBind(this)

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
    this.program = new Program(this.gl, {
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      fragment,
      vertex,
      uniforms: {
        uColor: { value: new Color('#ffffff') },
        uResolution: { value: new Vec2(200, 200) },
        uOddL: { value: this.oddL },
        uOddR: { value: this.oddR },
        //uTime: { value: 1 * Math.random() },
        uScrollY: { value: 1 },
      },
      transparent: true
    })
  }

  createMesh() {
    console.log('create square')
    const geometry = new Plane(this.gl)

    //geometry.computeBoundingBox()

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    //this.mesh.position.y = -this.plane.scale.y 
    //this.mesh.position.z = -50;
    /*if (isOdd(this.index) === 0) {
      this.mesh.position.x = this.plane.scale.x;
    } else {
      this.mesh.position.x = this.plane.scale.x;
    }*/
    //this.mesh.rotation.x = this.plane.rotation.x

    this.mesh.scale.x = 50
    this.mesh.scale.y = 50
    this.mesh.x = 10
    this.mesh.y = 10
    console.log(this.mesh.position.x)
    this.scene.addChild(this.mesh)
  }

  update() {
    this.program.uniforms.uOddL.value = this.oddL
    this.program.uniforms.uOddR.value = this.oddR
    this.program.uniforms.uScrollY.value = this.plane.position.y
    //console.log(this.plane.position.y)
  }

}
