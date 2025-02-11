import { useRef, useState } from 'react'
import { Marquee, useMarquee } from '@joycostudio/marquee/react'
import * as Slider from '@radix-ui/react-slider'
import * as Select from '@radix-ui/react-select'
import NumberFlow from '@number-flow/react'
import { useLenis } from '@/lib/scroll'
import Logo from '@/components/logo'
import { cn } from '@/lib/cn'
import { IconButton } from '@/components/icon-button'
import ArrowLeftIcon from '@/components/icons/arrow-left'
import ArrowRightIcon from '@/components/icons/arrow-right'
import PauseIcon from '@/components/icons/pause'
import PlayIcon from '@/components/icons/play'
import DoubleCaretRightIcon from '@/components/icons/double-caret-right'
import CopyIcon from '@/components/icons/copy'
import CheckIcon from '@/components/icons/check'
import CaretDownIcon from '@/components/icons/caret-down'
const DEFAULT_SPEED = 300

const PACKAGE_MANAGERS = {
  npm: { display: 'install @joycostudio/marquee', command: 'npm install @joycostudio/marquee' },
  pnpm: { display: 'add @joycostudio/marquee', command: 'pnpm add @joycostudio/marquee' },
  yarn: { display: 'add @joycostudio/marquee', command: 'yarn add @joycostudio/marquee' },
  bun: { display: 'add @joycostudio/marquee', command: 'bun add @joycostudio/marquee' },
} as const

const InstallCommand = () => {
  const [packageManager, setPackageManager] = useState<keyof typeof PACKAGE_MANAGERS>('pnpm')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(PACKAGE_MANAGERS[packageManager].command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const options = Object.entries(PACKAGE_MANAGERS)
  const selectedIndex = options.findIndex(([key]) => key === packageManager)

  return (
    <div className="flex h-em-[48] bg-foreground rounded-em-[6] mt-em-[40] items-center gap-em-[12]">
      <Select.Root
        value={packageManager}
        onValueChange={(value: string) => setPackageManager(value as keyof typeof PACKAGE_MANAGERS)}
      >
        <Select.Trigger className="w-em-[100] px-em-[12] h-full flex items-center justify-between text-background font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/2 border-r-2 border-background">
          <Select.Value />
          <CaretDownIcon className="size-em-[20] ml-em-[4]" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="bg-foreground rounded-em-[6] p-em-[6]">
            <Select.Viewport>
              {Object.keys(PACKAGE_MANAGERS).map((pm) => (
                <Select.Item
                  key={pm}
                  value={pm}
                  className="text-background font-mono text-sm px-em-[8] py-em-[4] rounded-em-[4] outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer data-[highlighted]:bg-background/10"
                >
                  <Select.ItemText>{pm}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <div
        className={cn(
          'h-em-[48] flex flex-col relative overflow-hidden before:absolute',
          'before:inset-x-0 before:top-0 before:h-em-[8] before:bg-gradient-to-b before:from-foreground before:to-transparent',
          'after:absolute after:inset-x-0 after:bottom-0 after:h-em-[8] after:bg-gradient-to-t after:from-foreground after:to-transparent'
        )}
      >
        <div
          className="relative transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateY(-${selectedIndex * (100 / options.length)}%)`,
          }}
        >
          {options.map(([key, value]) => (
            <div key={key} className="font-mono text-background text-em-[14/16] h-em-[48] flex items-center">
              {value.display}
            </div>
          ))}
        </div>
      </div>
      <IconButton
        variant="outline"
        onClick={handleCopy}
        className="border-0 border-l-2 !rounded-l-none !rounded-r-em-[6] text-background hover:bg-background/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      >
        {copied ? <CheckIcon className="size-em-[20]" /> : <CopyIcon className="size-em-[20]" />}
      </IconButton>
    </div>
  )
}

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

      <InstallCommand />
    </div>
  )
}

const ConfigMarquee = () => {
  const [pxPerSecond, setPxPerSecond] = useState(DEFAULT_SPEED)
  const [speedFactor, setSpeedFactor] = useState(0.2)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [play, setPlay] = useState(true)

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
          <IconButton
            size="large"
            variant={play ? 'outline' : 'filled'}
            onClick={() => setPlay(!play)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            {play ? <PauseIcon className="size-em-[32]" /> : <PlayIcon className="size-em-[32]" />}
          </IconButton>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Direction</p>
          <div className="flex gap-2">
            <IconButton
              size="large"
              variant={direction === 1 ? 'filled' : 'outline'}
              onClick={() => setDirection(1)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <ArrowLeftIcon className="size-em-[32]" />
            </IconButton>
            <IconButton
              size="large"
              variant={direction === -1 ? 'filled' : 'outline'}
              onClick={() => setDirection(-1)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <ArrowRightIcon className="size-em-[32]" />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Speed Factor</p>
          <div className="relative w-em-[350] border-2 border-background h-em-[64] rounded-em-[6] flex items-center px-em-[6] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, 
                  rgba(3, 68, 220, ${0.05 + speedFactor * 0.2}) 0%,
                  rgba(3, 68, 220, ${0.05 + speedFactor * 0.5}) 100%
                )`,
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 372 64"
              fill="none"
              preserveAspectRatio="repeat"
            >
              <g opacity={speedFactor * 0.2 + 0.05}>
                <path
                  d="M39.7082 64L71.5414 32.1667L39.7082 0.333496M-16 64L15.8333 32.1667L-16 0.333496"
                  stroke="#0344DC"
                  strokeWidth="15.9166"
                  strokeLinecap="square"
                />
                <path
                  d="M157.094 64L188.927 32.1667L157.094 0.333496M101.385 64L133.219 32.1667L101.385 0.333496"
                  stroke="#0344DC"
                  strokeWidth="15.9166"
                  strokeLinecap="square"
                />
                <path
                  d="M274.479 64L306.312 32.1667L274.479 0.333496M218.771 64L250.604 32.1667L218.771 0.333496"
                  stroke="#0344DC"
                  strokeWidth="15.9166"
                  strokeLinecap="square"
                />
                <path
                  d="M391.865 64L423.698 32.1667L391.865 0.333496M336.157 64L367.99 32.1667L336.157 0.333496"
                  stroke="#0344DC"
                  strokeWidth="15.9166"
                  strokeLinecap="square"
                />
              </g>
            </svg>
            <NumberFlow
              className="absolute left-1/2 -translate-x-1/2 font-mono text-background/80 font-medium"
              value={Math.round(speedFactor * 100)}
              suffix="%"
            />
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full"
              value={[speedFactor]}
              onValueChange={([value]) => setSpeedFactor(value)}
              max={1}
              min={0}
              step={0.01}
              defaultValue={[1]}
            >
              <Slider.Track className="relative grow h-full opacity-0">
                <Slider.Range className="absolute h-full opacity-0" />
              </Slider.Track>
              <Slider.Thumb asChild>
                <IconButton
                  variant="filled"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 active:scale-95 transition-transform"
                >
                  <DoubleCaretRightIcon className="size-em-[28] text-foreground" />
                </IconButton>
              </Slider.Thumb>
            </Slider.Root>
          </div>
        </div>

        <div className="flex flex-col gap-em-[8] items-center">
          <p className={labelClassName}>Speed (px/s)</p>
          <div className="flex gap-2">
            {[100, 300, 500].map((speed) => (
              <IconButton
                key={speed}
                size="large"
                variant={pxPerSecond === speed ? 'filled' : 'outline'}
                onClick={() => setPxPerSecond(speed)}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <span className="text-sm font-medium">{speed}</span>
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
      <InstallCommand />
    </div>
  )
}
