import { useEffect, useRef, useState } from 'react'
import { useMarquee } from '@joycostudio/marquee/react'
import { Input } from './components/input'
import { Button } from './components/button'
import { Slider } from './components/slider'
import { rangeRemap } from '@/lib/utils'

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
  const [marqueeRootRef, marquee] = useMarquee({ speed: DEFAULT_SPEED, speedFactor: 1, direction: 1 })
  const velocity = useScrollVelocity()

  useEffect(() => {
    if (!marquee) return
    const v = velocity * (inverted ? -1 : 1)
    const sign = Math.sign(v)

    if (sign === 0) return

    const cappedV = Math[sign === -1 ? 'min' : 'max'](v, sign * 1)
    marquee.setSpeedFactor(cappedV)
  }, [velocity])

  return (
    <div className="w-full overflow-hidden max-w-full">
      <div className="flex min-w-max" ref={marqueeRootRef}>
        <MarqueeContent />
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="w-full flex justify-center items-center h-20">
      <svg className="h-8" viewBox="0 0 378 271" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path
            d="M143.917 89.923C168.749 89.923 188.879 69.7931 188.879 44.9615C188.879 20.1299 168.749 0 143.917 0C119.086 0 98.9556 20.1299 98.9556 44.9615C98.9556 69.7931 119.086 89.923 143.917 89.923Z"
            fill="#FAFAFA"
          />
          <path
            d="M341.138 89.9326C324.481 89.9326 309.922 101.168 305.775 117.279C292.058 170.488 241.177 199.444 188.84 198.735C136.513 199.444 85.6222 170.488 71.9058 117.279C67.7583 101.168 53.1894 89.9326 36.5419 89.9326C13.4865 89.9326 -3.774 111.015 0.699161 133.63C18.7738 224.97 103.802 270.631 188.831 270.669C273.859 270.641 358.887 224.97 376.962 133.63C381.435 111.015 364.175 89.9326 341.119 89.9326H341.138Z"
            fill="#FAFAFA"
          />
        </g>
      </svg>
    </div>
  )
}

const ConfigMarquee = () => {
  const [pxPerSecond, setPxPerSecond] = useState(DEFAULT_SPEED)
  const [speedFactor, setSpeedFactor] = useState(100)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [marqueeRootRef, marquee] = useMarquee({ speed: pxPerSecond, speedFactor: 1, direction: 1 })

  useEffect(() => {
    if (!marquee) return
    marquee.setSpeed(pxPerSecond)
    marquee.setSpeedFactor(rangeRemap(speedFactor, 0, 100, 0, 1))
    marquee.setDirection(direction)
  }, [pxPerSecond, speedFactor, direction])

  const handlePlayStop = () => {
    if (!marquee) return
    if (marquee.playing) {
      marquee.pause()
    } else {
      marquee.play()
    }
  }

  const toggleDirection = () => {
    setDirection((prev) => (prev === 1 ? -1 : 1))
  }

  return (
    <div className="w-full">
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
        className="w-full overflow-hidden max-w-full"
      >
        <div className="flex min-w-max" ref={marqueeRootRef}>
          <MarqueeContent />
        </div>
      </div>

      <div className="flex mx-auto max-w-[300px] flex-col gap-y-12 gap-x-4 items-center justify-center mt-24">
        <div className="w-full space-y-2">
          <p className="text-muted-foreground font-semibold">Speed (px/s)</p>
          <Input
            placeholder="Speed"
            className="w-32"
            defaultValue={DEFAULT_SPEED}
            onBlur={(e) => setPxPerSecond(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
          />
        </div>

        <div className="w-full space-y-2">
          <p className="text-muted-foreground font-semibold">Speed Factor</p>
          <Slider onValueChange={([v]) => setSpeedFactor(v)} defaultValue={[speedFactor]} max={100} step={1} />
        </div>

        <div className="w-full space-y-2">
          <p className="text-muted-foreground font-semibold">Direction</p>
          <Button className="w-full" onClick={toggleDirection}>
            {direction === 1 ? 'Forward' : 'Backward'}
          </Button>
        </div>

        <div className="w-full space-y-2">
          <p className="text-muted-foreground font-semibold">Playstate</p>
          <Button className="w-full" onClick={handlePlayStop}>
            Play/Pause
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="h-[400vh] bg-gradient-to-b from-background to-[#000000]">
      <Header />
      <div className="h-screen flex items-center justify-center">
        <ConfigMarquee />
      </div>
      <div className="h-[400vh]">
        <div className="h-screen py-12 sticky min-h-max items-center left-0 top-0 w-full gap-y-10 flex flex-col justify-between">
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
      <div className="h-screen flex items-center w-full justify-center">
        <div className="max-w-max mx-auto">
          <div className="px-4 py-4 bg-foreground/10 rounded-xl">
            <pre>pnpm add @joycostudio/marquee</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
