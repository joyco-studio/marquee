import { pxPerSecond, warn } from './helpers'

const INITIALIZATION_WARNING = 'Marquee not initialized!'
const NO_PROGRESS_WARNING = 'There is no detected progress!'

type MarqueeOptions = {
  speed?: number
  speedFactor?: number
  direction?: 1 | -1
  autoClone?: boolean
  onReady?: () => void
}

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
  private onReady?: () => void
  private resizeObserver: ResizeObserver | undefined
  private originalChild: HTMLElement | undefined
  private autoClone: boolean
  /**
   * @param {HTMLElement} root - The container that will contain the marquee.
   * @param {Object} options - The options for the marquee.
   * @param {number} [options.speed=1] - The speed of the marquee in pixels per second.
   */
  constructor(root: HTMLElement, { speed = 10 / 1, speedFactor = 1, direction = 1, autoClone = true, onReady }: MarqueeOptions = {}) {
    this.root = root
    this.speed = speed
    this.speedFactor = speedFactor
    this.direction = direction
    this.onReady = onReady
    this.autoClone = autoClone
  }

  initialize(child: HTMLElement) {
    if (this.initialized) {
      warn('Marquee already initialized!')
      return
    }
    this.originalChild = child
    
    if (this.autoClone) {
      this.clonedChild = child.cloneNode(true) as HTMLElement
      this.root.appendChild(this.clonedChild)
    }
    
    this.childWidth = child.offsetWidth
    this.playing = true
    this.start(this.direction)
    this.setupResizeObserver()
    this.initialized = true
    this.onReady?.()
  }

  play() {
    if (!this.childWidth) {
      warn('Marquee not initialized!')
      return
    }

    if (this.animation) {
      this.animation.play()
      this.playing = true
      return
    }
  }

  start(direction: 1 | -1, startProgress?: number) {
    if (!this.childWidth) return

    this.animation?.cancel()

    const duration = pxPerSecond(this.childWidth, this.speed)
    const keyframes =
      direction === 1
        ? [{ transform: 'translate3d(0%,0,0)' }, { transform: 'translate3d(-50%,0,0)' }]
        : [{ transform: 'translate3d(-50%,0,0)' }, { transform: 'translate3d(0%,0,0)' }]

    this.animation = this.root.animate(keyframes, {
      duration,
      easing: 'linear',
      iterations: Infinity,
    })

    if (!this.playing) {
      this.animation.pause()
    } else {
      this.playing = true
    }

    this.animation.playbackRate = this.speedFactor

    // If startProgress is provided, set the animation to start from that point
    if (startProgress !== undefined && this.animation.effect) {
      this.animation.currentTime = duration * startProgress
    }
  }

  setDirection(direction: 1 | -1) {
    if (direction === this.direction) return

    this.setSpeedFactor(this.speedFactor * direction)
  }

  setSpeed(newSpeed: number) {
    if (!this.animation || !this.childWidth || !this.animation.effect) {
      warn(INITIALIZATION_WARNING)
      return
    }

    if (this.speed === newSpeed) return

    const timing = this.animation.effect.getComputedTiming()

    this.speed = newSpeed

    this.start(this.direction, timing.progress ?? undefined)
  }

  setSpeedFactor(newSpeedFactor: number) {
    if (!this.animation || !this.animation.effect) {
      warn(INITIALIZATION_WARNING)
      return
    }

    const speedWithDirection = this.speedFactor * this.direction

    if (speedWithDirection === newSpeedFactor) return

    const sign = Math.sign(newSpeedFactor)
    const hasChangedSign = sign !== Math.sign(speedWithDirection)

    if (!hasChangedSign) {
      this.direction = sign === 1 ? 1 : -1
      this.speedFactor = Math.abs(newSpeedFactor)
      this.animation.playbackRate = this.speedFactor
      return
    }

    const timing = this.animation.effect.getComputedTiming()

    if (!timing.progress) {
      warn(NO_PROGRESS_WARNING)
      return
    }

    const nextProgress = hasChangedSign ? 1 - timing.progress : timing.progress

    this.direction = sign === 1 ? 1 : -1
    this.speedFactor = Math.abs(newSpeedFactor)

    this.start(this.direction, nextProgress)
  }

  pause() {
    this.animation?.pause()
    this.playing = false
  }

  /**
   * Manually update the child size and restart animation if needed.
   * This is automatically handled via ResizeObserver, but can be called manually if needed.
   */
  updateSize() {
    this.updateChildSize()
  }

  private setupResizeObserver() {
    if (!this.originalChild) return

    this.resizeObserver = new ResizeObserver(() => {
      this.updateChildSize()
    })

    this.resizeObserver.observe(this.originalChild)
  }

  private updateChildSize() {
    if (!this.originalChild || !this.initialized || !this.animation || !this.animation.effect) return

    const newWidth = this.originalChild.offsetWidth

    if (newWidth !== this.childWidth) {
      const currentProgress = this.animation.effect.getComputedTiming()
      this.childWidth = newWidth

      if (this.clonedChild && this.clonedChild.parentNode === this.root) {
        this.root.removeChild(this.clonedChild)
      }

      if (this.autoClone) {
        this.clonedChild = this.originalChild.cloneNode(true) as HTMLElement
        this.root.appendChild(this.clonedChild)
      }

      this.start(this.direction, currentProgress.progress ?? undefined)
    }
  }

  destroy() {
    // Cancel the animation
    this.animation?.cancel()
    this.animation = undefined

    // Disconnect resize observer
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined

    // Remove the cloned child if it exists
    if (this.clonedChild && this.clonedChild.parentNode === this.root) {
      this.root.removeChild(this.clonedChild)
    }
    this.clonedChild = undefined
    this.originalChild = undefined
  }
}

const MarqueeConfig = {
  disableWarnings: false,
}

export { Marquee, MarqueeConfig }
