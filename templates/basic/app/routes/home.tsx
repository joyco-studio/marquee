import { useEffect, useRef, useState } from 'react'
import { useMarquee } from '@joycostudio/marquee/react'

export function meta() {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

const DEFAULT_SPEED = 300

const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0)
  const lastScrollRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const lastScrollEventRef = useRef(Date.now())
  const rafRef = useRef<number>(null)

  useEffect(() => {
    const onScroll = () => {
      const currentTime = Date.now()
      const timeDelta = currentTime - lastTimeRef.current
      const currentScroll = window.scrollY
      const scrollDelta = currentScroll - lastScrollRef.current

      // Calculate velocity (pixels per millisecond)
      const instantVelocity = scrollDelta / Math.max(1, timeDelta)

      // Smooth out the velocity using exponential moving average
      setVelocity((prevVelocity) => {
        const smoothingFactor = 0.1 // Adjust this value between 0 and 1 for different smoothing levels
        return prevVelocity * (1 - smoothingFactor) + instantVelocity * smoothingFactor
      })

      lastScrollRef.current = currentScroll
      lastTimeRef.current = currentTime
      lastScrollEventRef.current = currentTime
    }

    const decayVelocity = () => {
      const currentTime = Date.now()
      const timeSinceLastScroll = currentTime - lastScrollEventRef.current

      // Only start decay after 50ms of no scroll events
      if (timeSinceLastScroll > 50) {
        setVelocity((prevVelocity) => {
          // Apply exponential decay
          const decayFactor = 0.95
          const newVelocity = prevVelocity * decayFactor

          // Stop RAF when velocity is negligible
          if (Math.abs(newVelocity) < 0.0001) {
            return 0
          }
          return newVelocity
        })
      }

      rafRef.current = requestAnimationFrame(decayVelocity)
    }

    window.addEventListener('scroll', onScroll)
    rafRef.current = requestAnimationFrame(decayVelocity)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return velocity
}

const MarqueeContent = () => {
  return (
    <div className="flex">
      {Array.from({ length: 10 }).map((_, index) => (
        <span className="font-semibold uppercase whitespace-nowrap text-7xl" key={index}>
          @joycostudio/marquee | JOYCO |&nbsp;
        </span>
      ))}
    </div>
  )
}

const ScrollBoundMarquee = ({ inverted }: { inverted?: boolean }) => {
  const velocity = useScrollVelocity()
  const [marqueeRootRef, marquee] = useMarquee({ speed: DEFAULT_SPEED, speedFactor: 1, direction: 1 })

  useEffect(() => {
    if (!marquee) return
    const v = velocity * (inverted ? -1 : 1)
    const sign = Math.sign(v)

    if (sign === 0) return

    const cappedV = Math[sign === -1 ? 'min' : 'max'](v, sign * 1)
    marquee.setSpeedFactor(cappedV)
  }, [velocity])

  return (
    <div className="flex min-w-max" ref={marqueeRootRef}>
      <MarqueeContent />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConfigMarquee = () => {
  const sliderInputRef = useRef<HTMLInputElement>(null)
  const velocityInputRef = useRef<HTMLInputElement>(null)
  const [marqueeRootRef, marquee] = useMarquee({ speed: DEFAULT_SPEED, speedFactor: 1, direction: 1 })

  useEffect(() => {
    if (!marquee) return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        marquee.setDirection(1)
        console.log('forward')
      } else {
        marquee.setDirection(-1)
        console.log('backward')
      }
    }

    const onInput = () => {
      if (!sliderInputRef.current) return
      const v = -1 + Number(sliderInputRef.current.value) / 50
      marquee.setSpeedFactor(v)
      console.log(v)
    }

    const onVelocityChange = () => {
      if (!velocityInputRef.current) return
      const v = Number(velocityInputRef.current.value)
      marquee.setSpeed(v)
      console.log(v)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    sliderInputRef.current?.addEventListener('input', onInput)
    velocityInputRef.current?.addEventListener('input', onVelocityChange)

    return () => {
      window.removeEventListener('wheel', onWheel)
      sliderInputRef.current?.removeEventListener('input', onInput)
      velocityInputRef.current?.removeEventListener('input', onVelocityChange)
      marquee.destroy()
    }
  }, [])

  const handlePlayStop = () => {
    if (!marquee) return
    if (marquee.playing) {
      marquee.pause()
    } else {
      marquee.play()
    }
  }

  return (
    <div>
      <div className="flex min-w-max" ref={marqueeRootRef}>
        <MarqueeContent />
      </div>
      <div className="flex gap-x-4 items-center justify-center mt-20">
        <input
          type="number"
          defaultValue={DEFAULT_SPEED}
          min="1"
          className="w-20 border border-zinc-500 bg-zinc-900"
          ref={velocityInputRef}
        />

        <input type="range" defaultValue={1} min="1" max="100" className="thumb-slider-input" ref={sliderInputRef} />

        <button onClick={handlePlayStop}>Play/Pause</button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="h-[400vh] bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="h-screen fixed inset-0 flex flex-col justify-between">
        <ScrollBoundMarquee inverted />
        <ScrollBoundMarquee />
        <ScrollBoundMarquee inverted />
        <ScrollBoundMarquee />
        <ScrollBoundMarquee inverted />
        <ScrollBoundMarquee />
        <ScrollBoundMarquee inverted />
        <ScrollBoundMarquee />
      </div>
    </div>
  )
}
