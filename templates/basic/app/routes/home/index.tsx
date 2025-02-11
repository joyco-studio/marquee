import { useRef, useState } from 'react'
import { Marquee, useMarquee } from '@joycostudio/marquee/react'

import { useLenis } from '@/lib/scroll'
import Logo from '@/components/logo'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/icon-button'
import ArrowLeftIcon from '@/components/icons/arrow-left'
import ArrowRightIcon from '@/components/icons/arrow-right'
import PauseIcon from '@/components/icons/pause'
import PlayIcon from '@/components/icons/play'
import DoubleCaretRightIcon from '@/components/icons/double-caret-right'
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
  const [speedFactor, setSpeedFactor] = useState(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [play, setPlay] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  const labelClassName = cn('font-mono text-background font-medium uppercase text-em-[16/16]')

  return (
    <div className="my-em-[150] flex flex-col items-center">
      <div className="w-full flex flex-col items-center text-foreground py-em-[40] bg-foreground/10">
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
            speedFactor={speedFactor}
            direction={direction}
            play={play}
          >
            <div className="flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="flex items-center gap-x-em-[48] px-em-[24]" key={index}>
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
                  <Logo className="size-em-[120/16] mt-em-[12]" />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>

      <div className="relative flex mx-auto gap-em-[40] mt-em-[-24] items-center justify-center bg-foreground p-em-[32] rounded-em-[12]">
        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>State</p>
          <IconButton size="large" variant={play ? 'outline' : 'filled'} onClick={() => setPlay(!play)}>
            {play ? <PauseIcon className="size-em-[32]" /> : <PlayIcon className="size-em-[32]" />}
          </IconButton>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Direction</p>
          <div className="flex gap-2">
            <IconButton size="large" variant={direction === 1 ? 'filled' : 'outline'} onClick={() => setDirection(1)}>
              <ArrowLeftIcon className="size-em-[32]" />
            </IconButton>
            <IconButton size="large" variant={direction === -1 ? 'filled' : 'outline'} onClick={() => setDirection(-1)}>
              <ArrowRightIcon className="size-em-[32]" />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Speed (px/s)</p>
          <div
            className="relative w-em-[300] border-2 border-background h-em-[64] bg-background/10 rounded-em-[6] cursor-pointer flex items-center"
            onMouseDown={(e) => {
              setIsDragging(true)
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = x / rect.width
              setPxPerSecond(Math.round(percentage * 1000))
            }}
            onMouseMove={(e) => {
              if (!isDragging) return
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const percentage = Math.max(0, Math.min(1, x / rect.width))
              setPxPerSecond(Math.round(percentage * 1000))
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <IconButton
              variant="filled"
              className="cursor-grab absolute"
              style={{ left: `${(pxPerSecond / 1000) * 100}%` }}
            >
              <DoubleCaretRightIcon className="size-em-[32]" />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Speed Factor</p>
          <div className="flex gap-2">
            {[0.25, 0.5, 1].map((factor) => (
              <IconButton
                key={factor}
                size="large"
                variant={speedFactor === factor ? 'filled' : 'outline'}
                onClick={() => setSpeedFactor(factor)}
              >
                <span className="text-sm font-medium">{factor}x</span>
              </IconButton>
            ))}
          </div>
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
