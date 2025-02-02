import { useEffect, useRef } from 'react'
import { Marquee } from '@joycostudio/marquee'

export function meta() {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null)
  const sliderInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const marquee = new Marquee(rootRef.current, { velocity: 300, direction: 1 })
    if (!rootRef.current.firstChild) return
    marquee.addChild(rootRef.current.firstChild as HTMLElement)

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // marquee.setDirection(1)
        console.log('forward')
      } else {
        // marquee.setDirection(-1)
        console.log('backward')
      }
    }

    const onInput = () => {
      if (!sliderInputRef.current) return
      const v = 1 + Number(sliderInputRef.current.value) / 100
      marquee.setSpeedFactor(v)
      console.log(v)
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    sliderInputRef.current?.addEventListener('input', onInput)

    return () => {
      window.removeEventListener('wheel', onWheel)
      sliderInputRef.current?.removeEventListener('input', onInput)
    }
  }, [])

  return (
    <div className="py-[10vh] overflow-hidden">
      <div className="flex min-w-max" ref={rootRef}>
        <div className="flex">
          {Array.from({ length: 20 }).map((_, index) => (
            <span className="px-10" key={index}>
              child
            </span>
          ))}
        </div>
      </div>
      <div className="thumb-slider mt-20 mx-auto max-w-max">
        <input type="range" defaultValue={1} min="1" max="100" className="thumb-slider-input" ref={sliderInputRef} />
      </div>
    </div>
  )
}
