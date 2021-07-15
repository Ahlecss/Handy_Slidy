import { Color, Mesh, Plane, Program, Vec2 } from 'ogl'

import fragment from 'shaders/background-fragment.glsl'
import vertex from 'shaders/background-vertex.glsl'

import { random } from 'utils/math'

export default class {
  constructor ({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    console.log(this.viewport)

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
    this.meshes = []

    for (let i = 0; i < 1; i++) {
      let mesh = new Mesh(this.gl, {
        geometry: this.geometry,
        program: this.program,
      })

      const scale = random(0.75, 1)

      //mesh.scale.x = 3 * scale
      //mesh.scale.y = 3 * scale

      mesh.scale.x = 50
      mesh.scale.y = 50

      mesh.speed = random(0.75, 1)

      mesh.xExtra = 0

      // mesh.x = mesh.position.x = random(-this.viewport.width * 0.5, this.viewport.width * 0.5)
      // mesh.y = mesh.position.y = random(-this.viewport.height * 0.5, this.viewport.height * 0.5)
      mesh.x = 1
      mesh.y = 1

      //mesh.rotation.x = 0.3;

      this.meshes.push(mesh)

      this.scene.addChild(mesh)
    }*/
  }

  update (scroll, direction) {
    this.program.uniforms.uTime.value += 0.004
/*
    this.meshes.forEach(mesh => {
      mesh.position.y = mesh.y - scroll.current * mesh.speed - mesh.xExtra

      const viewportOffset = this.viewport.width * 0.5
      const widthTotal = this.viewport.width + mesh.scale.x

      mesh.isBefore = mesh.position.x < -viewportOffset
      mesh.isAfter = mesh.position.x > viewportOffset

      if (direction === 'right' && mesh.isBefore) {
        mesh.xExtra -= widthTotal

        mesh.isBefore = false
        mesh.isAfter = false
      }

      if (direction === 'left' && mesh.isAfter) {
        mesh.xExtra += widthTotal

        mesh.isBefore = false
        mesh.isAfter = false
      }

      mesh.position.y += 0.05 * mesh.speed

      if (mesh.position.y > this.viewport.height * 0.5 + mesh.scale.y) {
        mesh.position.y -= this.viewport.height + mesh.scale.y
      }
    })*/
  }
}
