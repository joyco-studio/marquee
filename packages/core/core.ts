/* This is the core of the marquee library. Leveraging just JS it will animate the marquee. We will then build the implementation in React. */

import { pxPerSecond, warn } from './helpers'

/* 
  On initialization this component should receive both the marquee root and the marquee content.
  The root is the container that will contain the marquee.
  The content is the content that will be animated.
*/

/* 
  I like this API: https://www.npmjs.com/package/react-fast-marquee
*/

class Marquee {
  private root: HTMLElement
  private speed: number
  private direction: 1 | -1
  private speedFactor: number = 1
  private initialized: boolean = false
  public animation: Animation | undefined
  private childWidth: number | undefined
  private clonedChild: HTMLElement | undefined
  public playing: boolean = false

  /**
   * @param {HTMLElement} root - The container that will contain the marquee.
   * @param {Object} options - The options for the marquee.
   * @param {number} [options.speed=1] - The speed of the marquee in pixels per second.
   */
  constructor(root: HTMLElement, { speed = 10 / 1, direction = 1 }: { speed?: number; direction?: 1 | -1 } = {}) {
    this.root = root
    this.speed = speed
    this.direction = direction
  }

  initialize(child: HTMLElement) {
    if (this.initialized) {
      warn('Marquee already initialized')
      return
    }
    this.root.appendChild(child)
    // Clone the child for continuous movement
    this.clonedChild = child.cloneNode(true) as HTMLElement
    this.root.appendChild(this.clonedChild)
    this.childWidth = child.offsetWidth
    this.playing = true
    this.start(this.direction)
    this.initialized = true
  }

  play() {
    if (!this.childWidth) return

    if (this.animation) {
      this.animation.play()
      this.playing = true
      return
    }
  }

  start(direction: 1 | -1, startProgress?: number) {
    if (!this.childWidth) return

    // If there's an existing animation, cancel it
    this.animation?.cancel()

    const initialX = direction === 1 ? 0 : -50
    const finalX = direction === 1 ? -50 : 0

    this.animation = this.root.animate(
      {
        transform: [`translateX(${initialX}%)`, `translateX(${finalX}%)`],
      },
      {
        duration: pxPerSecond(this.childWidth, this.speed),
        easing: 'linear',
        iterations: Infinity,
      }
    )
    this.animation.playbackRate = this.speedFactor

    this.playing = true

    // If startProgress is provided, set the animation to start from that point
    if (startProgress !== undefined && this.animation.effect) {
      const timing = this.animation.effect.getTiming()
      const duration = typeof timing.duration === 'number' ? timing.duration : 0
      this.animation.currentTime = duration * startProgress
    }
  }

  setDirection(direction: 1 | -1) {
    if (direction === this.direction) return
    this.direction = direction
    this.start(direction)
  }

  setSpeed(newspeed: number) {
    if (!this.animation || !this.childWidth || !this.animation.effect) return

    const timing = this.animation.effect.getTiming()
    const currentDuration = typeof timing.duration === 'number' ? timing.duration : 0
    const currentTime = typeof this.animation.currentTime === 'number' ? this.animation.currentTime : 0
    const progress = currentDuration > 0 ? (currentTime % currentDuration) / currentDuration : 0

    // Update speed
    this.speed = newspeed

    // Restart animation from the same progress point
    this.start(this.direction, progress)
  }

  setSpeedFactor(v: number) {
    if (!this.animation) return
    this.speedFactor = v
    this.animation.playbackRate = v
  }

  pause() {
    this.animation?.pause()
    this.playing = false
  }

  destroy() {
    // Cancel the animation
    this.animation?.cancel()
    this.animation = undefined

    // Remove the cloned child if it exists
    if (this.clonedChild && this.clonedChild.parentNode === this.root) {
      this.root.removeChild(this.clonedChild)
    }
    this.clonedChild = undefined

    // Clear the root element
    this.root.innerHTML = ''
  }
}

export { Marquee }
