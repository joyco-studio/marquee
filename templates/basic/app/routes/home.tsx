import { useEffect, useRef } from 'react'
import { Marquee as ReactMarquee, useMarquee } from '@joycostudio/marquee/react'

export function meta() {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

const DEFAULT_SPEED = 300

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

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const sliderInputRef = useRef<HTMLInputElement>(null)
  const velocityInputRef = useRef<HTMLInputElement>(null)
  const [marqueeRootRef, marquee] = useMarquee({ speed: DEFAULT_SPEED, speedFactor: 1, direction: 1 })

  useEffect(() => {
    if (!rootRef.current) return
    if (!rootRef.current.firstChild) return
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

  const handleInitialize = () => {
    if (!marquee || !rootRef.current) return
    marquee.initialize(rootRef.current.firstChild as HTMLElement)
  }

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
      <ReactMarquee rootClassName="my-[10vh]" speed={DEFAULT_SPEED} speedFactor={1} direction={1}>
        <MarqueeContent />
      </ReactMarquee>

      <div className="my-[10vh] flex min-w-max" ref={marqueeRootRef}>
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

        <button onClick={handleInitialize}>Initialize</button>
        <button onClick={handlePlayStop}>Play/Pause</button>
      </div>
    </div>
  )
}
