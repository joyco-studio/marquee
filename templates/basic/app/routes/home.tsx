import { useEffect, useRef, useState } from 'react'
import { Marquee } from '@joycostudio/marquee'

export function meta() {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

const DEFAULT_VELOCITY = 300

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const sliderInputRef = useRef<HTMLInputElement>(null)
  const velocityInputRef = useRef<HTMLInputElement>(null)
  const [marquee, setMarquee] = useState<Marquee | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    if (!rootRef.current.firstChild) return

    const marquee = new Marquee(rootRef.current, { speed: DEFAULT_VELOCITY, direction: 1 })

    setMarquee(marquee)

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
      const v = 1 + Number(sliderInputRef.current.value) / 100
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
    <div className="py-[10vh] overflow-hidden">
      <div className="flex min-w-max" ref={rootRef}>
        <div className="flex bg-gradient-to-r from-red-transparent to-red-500">
          {Array.from({ length: 20 }).map((_, index) => (
            <span className="px-10 font-semibold" key={index}>
              CHILD
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-x-4 items-center justify-center mt-20">
        <input
          type="number"
          defaultValue={DEFAULT_VELOCITY}
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
