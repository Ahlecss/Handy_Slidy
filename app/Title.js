import AutoBind from 'auto-bind'
import { Color, Geometry, Mesh, Program, Text, Texture } from 'ogl'

import fragment from 'shaders/text-fragment.glsl'
import vertex from 'shaders/text-vertex.glsl'
import { isOdd } from 'utils/math'

import font from 'fonts/freight.json'
import src from 'fonts/freight.png'

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
        tMap: { value: texture }
      }
    })
  }

  createMesh () {
    const title = new Text({
      align: 'center',
      font,
      letterSpacing: -0.05,
      size: 0.08,
      text: this.title,
      wordSpacing: 0,
    })

    const geometry = new Geometry(this.gl, {
      position: { size: 3, data: title.buffers.position },
      uv: { size: 2, data: title.buffers.uv },
      id: { size: 1, data: title.buffers.id },
      index: { data: title.buffers.index }
    })

    geometry.computeBoundingBox()

    this.mesh = new Mesh(this.gl, { geometry, program: this.program })
    this.mesh.position.y = -this.plane.scale.y * 0.5 - 0.085
    if(isOdd(this.index)){
      this.mesh.position.x = -this.plane.scale.x * 0.2
    } else {
      this.mesh.position.x = -this.plane.scale.x * 0.8
    }
    this.mesh.rotation.x = this.plane.rotation.x
    this.mesh.setParent(this.plane)
  }
}
