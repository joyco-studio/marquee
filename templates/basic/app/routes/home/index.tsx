import { useRef, useState } from 'react'
import { Marquee, useMarquee } from '@joycostudio/marquee/react'
import { Input } from './components/input'
import { Button } from './components/button'
import { Slider } from './components/slider'
import { cn, rangeRemap } from '@/lib/utils'
import { useLenis } from '@/lib/scroll'
import Logo from '@/components/logo'

const DEFAULT_SPEED = 300

const MarqueeContent = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex')}>
      {Array.from({ length: 10 }).map((_, index) => (
        <span className={cn('font-semibold uppercase whitespace-nowrap text-7xl', className)} key={index}>
          @joycostudio/marquee | JOYCO |&nbsp;
        </span>
      ))}
    </div>
  )
}

const ScrollBoundMarquee = ({ inverted }: { inverted?: boolean }) => {
  const [ref, marquee] = useMarquee({ speed: DEFAULT_SPEED, speedFactor: 1, direction: inverted ? -1 : 1 })
  const lastSign = useRef<number>(1)

  useLenis(({ velocity }) => {
    if (!marquee) return
    const sign = Math.sign(velocity)
    if (sign === 0) return
    lastSign.current = sign
    marquee.setSpeedFactor((1 * sign + velocity / 5) * (inverted ? -1 : 1))
  })

  return (
    <Marquee instance={[ref, marquee]}>
      <MarqueeContent className="text-[100px]" />
    </Marquee>
  )
}

const Hero = () => {
  return (
    <div className="flex flex-col items-center text-foreground my-em-[150]">
      <p className="font-mono font-medium text-em-[20/16]">THE ALL IN ONE MARQUEE</p>
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
        className="w-full max-w-full lg:max-w-em-[1000]"
      >
        <Marquee speed={75} direction={1} play={true}>
          <div className="flex">
            {Array.from({ length: 4 }).map((_, index) => (
              <span
                className={cn('font-semibold uppercase whitespace-nowrap text-em-[96/16] leading-[1] px-em-[16]')}
                key={index}
              >
                @joycostudio/marquee
              </span>
            ))}
          </div>
        </Marquee>
      </div>

      <div className="flex h-em-[40] w-em-[400] bg-foreground rounded-em-[12] mt-em-[40]"></div>
    </div>
  )
}

const ConfigMarquee = () => {
  const [pxPerSecond, setPxPerSecond] = useState(DEFAULT_SPEED)
  const [speedFactor, setSpeedFactor] = useState(100)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [play, setPlay] = useState(true)
  const toggleDirection = () => {
    setDirection((prev) => (prev === 1 ? -1 : 1))
  }

  return (
    <div className="">
      <div className="flex flex-col items-center text-foreground my-em-[150]">
        <div
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
          className="w-full max-w-full"
        >
          <Marquee speed={75} direction={1} play={true}>
            <div className="flex opacity-50">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  className={cn(
                    'font-medium font-mono uppercase whitespace-nowrap text-em-[24/16] leading-[1] px-em-[16]'
                  )}
                  key={index}
                >
                  Performant marquee animations built on top of Web Animations API
                </span>
              ))}
            </div>
          </Marquee>
          <Marquee
            rootClassName="mt-em-[-16]"
            speed={pxPerSecond}
            speedFactor={rangeRemap(speedFactor, 0, 100, 0, 1)}
            direction={direction}
            play={play}
          >
            <div className="flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="flex items-center gap-x-em-[48]" key={index}>
                  <span className={cn('font-semibold uppercase whitespace-nowrap text-em-[164/16] leading-[1]')}>
                    THE ONLY
                  </span>
                  <Logo className="size-em-[120/16] mt-em-[12]" />
                  <span className={cn('font-semibold uppercase whitespace-nowrap text-em-[164/16] leading-[1]')}>
                    MARQUEE
                  </span>
                  <Logo className="size-em-[120/16] mt-em-[12]" />
                  <span className={cn('font-semibold uppercase whitespace-nowrap text-em-[164/16] leading-[1]')}>
                    YOU WILL EVER NEED
                  </span>
                </div>
              ))}
            </div>
          </Marquee>
        </div>

        <div className="flex h-em-[40] w-em-[400] bg-foreground rounded-em-[12] mt-em-[40]"></div>
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
          <Button className="w-full" onClick={() => setPlay((prev) => !prev)}>
            {play ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>
    </div>
  )
}
export default function Home() {
  return (
    <div className="">
      <Hero />
      <ConfigMarquee />
      <div className="h-[400vh]">
        <div className="h-screen py-12 sticky min-h-max items-center left-0 top-0 w-full gap-y-10 flex flex-col justify-between">
          <ScrollBoundMarquee inverted />
          <ScrollBoundMarquee />
          <ScrollBoundMarquee inverted />
          <ScrollBoundMarquee />
          <ScrollBoundMarquee inverted />
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
