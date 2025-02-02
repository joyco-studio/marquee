/* This is the core of the marquee library. Leveraging just JS it will animate the marquee. We will then build the implementation in React. */

import { pxPerSecond } from './helpers'

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
  private velocity: number
  private direction: 1 | -1
  public animation: Animation | undefined
  private childWidth: number | undefined
  private clonedChild: HTMLElement | undefined

  /**
   * @param {HTMLElement} root - The container that will contain the marquee.
   * @param {Object} options - The options for the marquee.
   * @param {number} [options.velocity=1] - The velocity of the marquee in pixels per second.
   */
  constructor(root: HTMLElement, { velocity = 10 / 1, direction = 1 }: { velocity?: number; direction?: 1 | -1 } = {}) {
    this.root = root
    this.velocity = velocity
    this.direction = direction
  }

  addChild(child: HTMLElement) {
    this.root.appendChild(child)
    // Clone the child for continuous movement
    this.clonedChild = child.cloneNode(true) as HTMLElement
    this.root.appendChild(this.clonedChild)
    this.childWidth = child.offsetWidth
    this.start(this.direction)
  }

  play() {
    if (!this.childWidth) return

    if (this.animation) {
      this.animation.play()
      return
    }
  }

  start(direction: 1 | -1) {
    if (!this.childWidth) return

    this.animation = this.root.animate(
      {
        transform: ['translateX(0)', `translateX(${direction * -50}%)`],
      },
      {
        duration: pxPerSecond(this.childWidth, this.velocity),
        easing: 'linear',
        iterations: Infinity,
      }
    )
  }

  setSpeedFactor(v: number) {
    if (!this.animation) return
    this.animation.playbackRate = v
  }

  pause() {
    this.animation?.pause()
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
