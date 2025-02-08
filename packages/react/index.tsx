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

export type ReactMarqueeConfigProps = {
  children: React.ReactNode
  rootClassName?: string
  marqueeClassName?: string
} & MarqueeOptions

const marqueeRootStyles = {
  overflowX: 'clip',
  overflowY: 'visible',
  maxWidth: '100%',
} satisfies React.CSSProperties

const marqueeInstanceStyles = {
  minWidth: 'max-content',
  display: 'flex',
} satisfies React.CSSProperties

const ReactMarqueeConfig = ({
  children,
  speed,
  speedFactor,
  direction,
  play = true,
  rootClassName,
  marqueeClassName,
}: ReactMarqueeConfigProps) => {
  const [rootRef, marquee] = useMarquee({ speed, speedFactor, direction, play })

  useEffect(() => {
    if (!marquee) return
    marquee.setSpeed(speed)
    marquee.setSpeedFactor(speedFactor)
    marquee.setDirection(direction)
  }, [speed, speedFactor, direction])

  return (
    <div style={marqueeRootStyles} className={rootClassName}>
      <div style={marqueeInstanceStyles} className={marqueeClassName} ref={rootRef}>
        {children}
      </div>
    </div>
  )
}

type ReactMarqueeInstanceProps = {
  children: React.ReactNode
  rootClassName?: string
  marqueeClassName?: string
  instance: ReturnType<typeof useMarquee>
}

const ReactMarqueeInstance = ({ children, rootClassName, marqueeClassName, instance }: ReactMarqueeInstanceProps) => {
  return (
    <div style={marqueeRootStyles} className={rootClassName}>
      <div style={{ minWidth: 'max-content', display: 'flex' }} className={marqueeClassName} ref={instance[0]}>
        {children}
      </div>
    </div>
  )
}

type ReactMarqueeProps = ReactMarqueeInstanceProps | ReactMarqueeConfigProps

const ReactMarquee: React.FC<ReactMarqueeProps> = (props) => {
  if ('instance' in props) {
    return <ReactMarqueeInstance {...props} />
  }
  return <ReactMarqueeConfig {...props} />
}

export { ReactMarquee as Marquee, useMarquee }
