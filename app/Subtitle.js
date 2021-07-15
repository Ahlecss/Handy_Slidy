import AutoBind from 'auto-bind'
import { Color, Geometry, Mesh, Program, Text, Plane, Texture, Vec2 } from 'ogl'

import fragment from 'shaders/text-fragment.glsl'
import vertex from 'shaders/text-vertex.glsl'
import { isOdd } from 'utils/math'

import font from 'fonts/inter-medium.json'
import src from 'fonts/inter-medium.png'

export default class {
  constructor ({ gl, plane, renderer, viewport, subtitle, index }) {
    AutoBind(this)

    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.subtitle = subtitle
    this.viewport = viewport
    this.index = index

    this.createShader()
    this.createMesh()
  }

  createShader () {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    const textureImage = new Image()

    textureImage.src = src
    textureImage.onload = _ => texture.image = textureImage

    const vertex100 = `${vertex}`

    const fragment100 = `
      #extension GL_OES_standard_derivatives : enable

      precision highp float;

      ${fragment}
    `

    const vertex300 = `#version 300 es

      #define attribute in
      #define varying out

      ${vertex}
    `

    const fragment300 = `#version 300 es

      precision highp float;

      #define varying in
      #define texture2D texture
      #define gl_FragColor FragColor

      out vec4 FragColor;

      ${fragment}
    `

    let fragmentShader = fragment100
    let vertexShader = vertex100

    if (this.renderer.isWebgl2) {
      fragmentShader = fragment300
      vertexShader = vertex300
    }

    this.program = new Program(this.gl, {
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        uColor: { value: new Color('#ffffff') },
        uResolution: { value: new Vec2(this.viewport.width * 100, this.viewport.height * 100) },
        tMap: { value: texture }
      }
    })
  }

  createMesh () {
    const subtitle = new Text({
      align: 'left',
      font,
      size: 0.04,
      //size: 0.05,
      text: this.subtitle,
      wordSpacing: 0,
    })

    const geometry = new Geometry(this.gl, {
      position: { size: 3, data: subtitle.buffers.position },
      uv: { size: 2, data: subtitle.buffers.uv },
      id: { size: 1, data: subtitle.buffers.id },
      index: { data: subtitle.buffers.index }
    })

    geometry.computeBoundingBox()

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.mesh.position.y = -this.plane.scale.y * -0.2 - 0.15
    if(isOdd(this.index)){
      this.mesh.position.x = this.plane.scale.x * 0.3
    } else {
      this.mesh.position.x = -this.plane.scale.x * 2.7
    }
    this.mesh.setParent(this.plane)
  }

  update () {
    //this.mesh.rotation.x = this.plane.rotation.x 
  }
}
