import { Renderer, Camera, Transform, Plane } from 'ogl'
import NormalizeWheel from 'normalize-wheel'

import debounce from 'lodash/debounce'

import { lerp } from 'utils/math'

import Image1 from 'images/1.jpg'
import Image2 from 'images/2.jpg'
import Image3 from 'images/3.jpg'
import Image4 from 'images/4.jpg'
import Image5 from 'images/5.jpg'
import Image6 from 'images/6.jpg'

import ImageShape from './ImageShape'
import Background from './Background'

export default class App {
  constructor () {
    document.documentElement.classList.remove('no-js')

    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0
    }

    this.onCheckDebounce = debounce(this.onCheck, 200)

    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()

    this.createGeometry()
    this.createImages()
    this.createBackground()

    this.update()

    this.addEventListeners()

    this.createPreloader()
  }

  createPreloader () {
    Array.from(this.imagesList).forEach(({ image: source }) => {
      const image = new Image()

      this.loaded = 0

      image.src = source
      image.onload = _ => {
        this.loaded += 1

        if (this.loaded === this.imagesList.length) {
          document.documentElement.classList.remove('loading')
          document.documentElement.classList.add('loaded')
        }
      }
    })
  }

  createRenderer () {
    this.renderer = new Renderer()

    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 1)

    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }

  createScene () {
    this.scene = new Transform()
  }

  createGeometry () {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }

  createImages () {
    this.imagesList = [
      { image: Image1, title: 'Abstracted Shapes', subtitle: 'By Danny Ivan' },
      { image: Image2, title: 'Anemone', subtitle: 'By Leith Ben Abdessalem' },
      { image: Image3, title: 'Fragments', subtitle: 'By Stu Ballinger' },
      { image: Image4, title: 'Experimental Imagery', subtitle: 'By Danny Ivan' },
      { image: Image5, title: 'High Visceral', subtitle: 'By Psychedelic Porn Crumpets' },
      { image: Image6, title: 'Dream Drop', subtitle: 'By Stu Ballinger' },
    ]

    this.images = this.imagesList.map(({ image, title, subtitle }, index) => {
      const img = new ImageShape({
        geometry: this.planeGeometry,
        gl: this.gl,
        image,
        index,
        length: this.imagesList.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        title,
        subtitle,
        totalImage: this.imagesList.length,
        viewport: this.viewport
      })

      return img
    })
  }

  createBackground () {
    this.background = new Background({
      gl: this.gl,
      scene: this.scene,
      viewport: this.viewport
    })
  }

  // Events

  onTouchDown (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientX : event.clientX
  }

  onTouchMove (event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const distance = (this.start - x) * 0.01

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {
    this.isDown = false

    this.onCheck()
  }

  onWheel (event) {
    const normalized = NormalizeWheel(event)
    const speed = normalized.pixelY

    this.scroll.target += speed * 0.005

    this.onCheckDebounce()
  }

  onCheck () {
    const { height } = this.images[0]
    const itemIndex = Math.round(Math.abs(this.scroll.target) / height)
    const item = height * itemIndex

    if (this.scroll.target < 0) {
      this.scroll.target = -item
    } else {
      this.scroll.target = item
    }
  }

  // Resize

  onResize () {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }

    if (this.images) {
      this.images.forEach(image => image.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
    }
  }

  // Update

  update () {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    if (this.scroll.current > this.scroll.last) {
      this.direction = 'right'
    } else {
      this.direction = 'left'
    }

    if (this.images) {
      this.images.forEach(image => image.update(this.scroll, this.direction))
    }

    if (this.background) {
      this.background.update(this.scroll, this.direction)
    }

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })

    this.scroll.last = this.scroll.current

    window.requestAnimationFrame(this.update.bind(this))
  }

  // Listeners

  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))

    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('wheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}

new App()
