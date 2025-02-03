import { useEffect, useRef, useState } from 'react'
import { Marquee } from '../core'
import { error } from '../core/helpers'

type MarqueeOptions = {
  speed: number
  speedFactor: number
  direction: 1 | -1
  play?: boolean
}

const useMarquee = <T extends HTMLDivElement>({ speed, speedFactor, direction, play = true }: MarqueeOptions) => {
  const rootRef = useRef<T>(null)
  const [marquee, setMarquee] = useState<Marquee | null>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const marquee = new Marquee(rootRef.current, { speed, direction, speedFactor })
    setMarquee(marquee)

    const children = rootRef.current.children

    if (children.length === 0) return
    if (children.length > 1) {
      error('Marquee does not support multiple children. Wrap it up in a single element.')
    }

    marquee.initialize(children[0] as HTMLElement)
  }, [])

  useEffect(() => {
    if (!marquee) return
    if (play) marquee.play()
    else marquee.pause()
  }, [play])

  useEffect(() => {
    return () => marquee?.destroy()
  }, [])

  return [rootRef, marquee] as const
}

export type MarqueeProps = {
  children: React.ReactNode
  rootClassName?: string
  marqueeClassName?: string
} & MarqueeOptions

const ReactMarquee = ({
  children,
  speed,
  speedFactor,
  direction,
  play = true,
  rootClassName,
  marqueeClassName,
}: MarqueeProps) => {
  const [rootRef, marquee] = useMarquee({ speed, speedFactor, direction, play })

  useEffect(() => {
    if (!marquee) return
    marquee.setSpeed(speed)
    marquee.setSpeedFactor(speedFactor)
    marquee.setDirection(direction)
  }, [speed, speedFactor, direction])

  return (
    <div style={{ overflowX: 'clip', overflowY: 'visible', maxWidth: '100%' }} className={rootClassName}>
      <div style={{ minWidth: 'max-content', display: 'flex' }} className={marqueeClassName} ref={rootRef}>
        {children}
      </div>
    </div>
  )
}

export { ReactMarquee as Marquee, useMarquee }
