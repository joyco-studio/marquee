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

const Star = () => (
  <svg
    className="mx-em-[48/116] translate-y-[7%] w-em-[87/116]"
    viewBox="0 0 86 87"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M56.9097 27.5281L43.7907 0.0351563L30.6717 27.5281L0.470276 31.5093L22.5637 52.482L17.0172 82.4354L43.7907 67.9043L70.5641 82.4354L65.0176 52.482L87.111 31.5093L56.9097 27.5281Z"
      fill="currentColor"
    />
  </svg>
)

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
        <Select.Trigger className="w-em-[100] px-em-[12] h-full flex items-center justify-between text-background font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 border-r-2 border-background">
          <Select.Value />
          <CaretDownIcon className="size-em-[20] ml-em-[4]" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="bg-foreground rounded-em-[6] p-em-[6] overflow-hidden w-[--radix-select-trigger-width]"
            position="popper"
            sideOffset={4}
            align="start"
          >
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
          'flex-1 h-em-[48] flex flex-col relative overflow-hidden',
          'before:absolute before:z-10 before:inset-x-0 before:top-0 before:h-em-[12] before:bg-gradient-to-b before:from-foreground before:to-transparent',
          'after:absolute after:z-10 after:inset-x-0 after:bottom-0 after:h-em-[12] after:bg-gradient-to-t after:from-foreground after:to-transparent'
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
        <div className="relative w-em-[20] h-em-[20]">
          <div className={cn('absolute inset-0 transition-opacity duration-200', copied ? 'opacity-0' : 'opacity-100')}>
            <CopyIcon className="size-em-[20]" />
          </div>
          <div className={cn('absolute inset-0 transition-opacity duration-200', copied ? 'opacity-100' : 'opacity-0')}>
            <CheckIcon className="size-em-[20]" />
          </div>
        </div>
      </IconButton>
    </div>
  )
}

const MarqueeContent = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center text-foreground bg-background')}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className={cn(
            'leading-none h-em-[131/116] translate-y-[-3%] font-semibold flex uppercase whitespace-nowrap items-center text-7xl',
            className
          )}
          key={index}
        >
          <span>Leave that shiny star</span> <Star /> <span> on Github</span> <Star />
        </div>
      ))}
    </div>
  )
}

const ScrollBoundMarquee = ({ inverted, className }: { inverted?: boolean; className?: string }) => {
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
    <Marquee rootClassName={cn('', className)} instance={[ref, marquee]}>
      <MarqueeContent className={cn('text-em-[116/16] font-sans')} />
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

      <div className="relative flex mx-auto md:flex-row flex-col gap-em-[40] mt-em-[-24] items-center justify-center bg-foreground p-em-[32] rounded-em-[12]">
        <div className="flex gap-em-[40] md:contents">
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
              className="absolute font-mono font-medium -translate-x-1/2 left-1/2 text-background/80"
              value={Math.round(speedFactor * 100)}
              suffix="%"
            />
            <Slider.Root
              className="relative flex items-center w-full select-none touch-none"
              value={[speedFactor]}
              onValueChange={([value]) => setSpeedFactor(value)}
              max={1}
              min={0}
              step={0.01}
              defaultValue={[1]}
            >
              <Slider.Track className="relative h-full opacity-0 grow">
                <Slider.Range className="absolute h-full opacity-0" />
              </Slider.Track>
              <Slider.Thumb asChild>
                <IconButton
                  variant="filled"
                  className="transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 active:scale-95"
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

const SocialBlock = ({
  leftText,
  rightText,
  icon,
  href,
}: {
  leftText: string
  rightText: string
  icon: React.ReactNode
  href: string
}) => {
  return (
    <a className="contents" href={href} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col whitespace-nowrap">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-em-[8/16] items-center">
          <p className="text-right">{leftText}</p>
          {icon}
          <p className="text-left">{rightText}</p>
        </div>
      </div>
    </a>
  )
}

const Pattern = () => {
  return (
    <div className="relative w-full bg-background -z-1">
      <img className="w-full translate-y-[1%]" style={{ aspectRatio: 1920 / 400 }} src="/full-w-halftone.png" />
    </div>
  )
}

export default function Home() {
  return (
    <div className="">
      <Hero />
      <ConfigMarquee />
      <div className="h-[400vh] text-primary bg-foreground">
        <Pattern />
        <div className="sticky top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-screen py-12 font-mono uppercase min-h-max gap-y-10">
          <div className="absolute inset-0 overflow-x-clip">
            <div className="absolute py-em-[10/16] rotate-[10deg] left-1/2 -translate-x-1/2 z-10">
              <ScrollBoundMarquee className="w-[120vw]" inverted />
            </div>

            <div className="absolute bottom-0 py-em-[10/16] rotate-[-30deg] left-1/2 -translate-x-1/2 z-10">
              <ScrollBoundMarquee className="w-[120vw]" inverted />
            </div>

            <div className="absolute bottom-0 py-em-[10/16] rotate-[15deg] left-1/2 -translate-x-1/2 z-10">
              <ScrollBoundMarquee className="w-[120vw]" />
            </div>
          </div>

          <div className="relative font-medium leading-none">
            <p className="text-center text-em-[16/16]">
              We’re always cooking, so <br />
              if you don’t want to lose a thing
            </p>
            <div className="flex flex-col whitespace-nowrap gap-y-em-[24/24] text-em-[24] mt-em-[40/24]">
              <SocialBlock
                href="https://github.com/joyco-studio/marquee"
                leftText="LEAVE THAT"
                rightText="F*%# STAR"
                icon={
                  <svg className="w-em-[48/24]" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_133_6578)">
                      <path
                        d="M30.8103 15.1266L24.0005 0.855469L17.1907 15.1266L1.51367 17.1931L12.982 28.0797L10.1029 43.628L24.0005 36.0851L37.8981 43.628L35.019 28.0797L46.4873 17.1931L30.8103 15.1266Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_133_6578">
                        <rect width="48" height="48" fill="white" transform="translate(0 0.5)" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              />
              <SocialBlock
                href="https://github.com/joyco-studio"
                leftText="FOLLOW US"
                rightText="ON GITHUB"
                icon={
                  <svg className="w-em-[48/24]" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M24 4.40137C35.05 4.40137 44 13.3514 44 24.4014C43.9989 28.5919 42.6838 32.6765 40.2396 36.0804C37.7954 39.4843 34.3454 42.036 30.375 43.3764C29.375 43.5764 29 42.9514 29 42.4264C29 41.7514 29.025 39.6014 29.025 36.9264C29.025 35.0514 28.4 33.8514 27.675 33.2264C32.125 32.7264 36.8 31.0264 36.8 23.3514C36.8 21.1514 36.025 19.3764 34.75 17.9764C34.95 17.4764 35.65 15.4264 34.55 12.6764C34.55 12.6764 32.875 12.1264 29.05 14.7264C27.45 14.2764 25.75 14.0514 24.05 14.0514C22.35 14.0514 20.65 14.2764 19.05 14.7264C15.225 12.1514 13.55 12.6764 13.55 12.6764C12.45 15.4264 13.15 17.4764 13.35 17.9764C12.075 19.3764 11.3 21.1764 11.3 23.3514C11.3 31.0014 15.95 32.7264 20.4 33.2264C19.825 33.7264 19.3 34.6014 19.125 35.9014C17.975 36.4264 15.1 37.2764 13.3 34.2514C12.925 33.6514 11.8 32.1764 10.225 32.2014C8.55 32.2264 9.55 33.1514 10.25 33.5264C11.1 34.0014 12.075 35.7764 12.3 36.3514C12.7 37.4764 14 39.6264 19.025 38.7014C19.025 40.3764 19.05 41.9514 19.05 42.4264C19.05 42.9514 18.675 43.5514 17.675 43.3764C13.6916 42.0505 10.2268 39.5039 7.77223 36.098C5.31762 32.692 3.9978 28.5996 4 24.4014C4 13.3514 12.95 4.40137 24 4.40137Z"
                      fill="black"
                    />
                  </svg>
                }
              />
              <SocialBlock
                href="https://discord.gg/wTKYm92KCQ"
                leftText="JOIN OUR"
                rightText="DISCORD"
                icon={
                  <svg className="w-em-[48/24]" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M39.2722 10.5458C36.3813 9.21536 33.3295 8.27147 30.1947 7.73828C29.7657 8.50919 29.3775 9.30235 29.0318 10.1145C25.6926 9.60861 22.2968 9.60861 18.9576 10.1145C18.6117 9.30244 18.2236 8.50928 17.7948 7.73828C14.6579 8.27597 11.6041 9.2221 8.71035 10.5528C2.96551 19.0973 1.40818 27.4295 2.18685 35.6435C5.55117 38.1423 9.3168 40.0427 13.3201 41.2621C14.2215 40.0433 15.0191 38.7503 15.7045 37.3969C14.4027 36.9081 13.1462 36.3051 11.9496 35.5948C12.2645 35.3652 12.5725 35.1286 12.8702 34.899C16.352 36.545 20.1523 37.3985 23.9999 37.3985C27.8476 37.3985 31.6478 36.545 35.1297 34.899C35.4308 35.146 35.7388 35.3826 36.0502 35.5948C34.8513 36.3062 33.5925 36.9104 32.2884 37.4004C32.973 38.7532 33.7707 40.0451 34.6729 41.2621C38.6795 40.0476 42.4481 38.1481 45.813 35.647C46.7266 26.1214 44.2522 17.8657 39.2722 10.5458ZM16.6908 30.5919C14.5209 30.5919 12.7283 28.6124 12.7283 26.1771C12.7283 23.7418 14.4586 21.7448 16.6839 21.7448C18.9092 21.7448 20.688 23.7418 20.6499 26.1771C20.6119 28.6124 18.9022 30.5919 16.6908 30.5919ZM31.309 30.5919C29.1357 30.5919 27.3499 28.6124 27.3499 26.1771C27.3499 23.7418 29.0803 21.7448 31.309 21.7448C33.5377 21.7448 35.3027 23.7418 35.2646 26.1771C35.2266 28.6124 33.5204 30.5919 31.309 30.5919Z"
                      fill="black"
                    />
                  </svg>
                }
              />
            </div>

            <p className="text-center text-em-[16/16] opacity-50 mt-em-[40/16]">Made by Rebels</p>

            <svg
              className="pointer-events-none -z-1 absolute left-1/2 -translate-x-1/2 translate-y-[65%] bottom-0 w-em-[606/16]"
              viewBox="0 0 606 291"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.1">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M153.765 86.8295C150.057 84.2049 146.168 81.4525 144.383 79.488L144.37 79.5154C143.7 78.7778 143.402 77.657 143.09 76.4822C142.648 74.822 142.178 73.0542 140.591 72.108C138.285 70.7389 136.767 71.2067 135.55 71.5819C134.917 71.777 134.366 71.947 133.827 71.8205C132.21 71.436 130.28 70.0219 128.215 68.5086C125.278 66.3571 122.068 64.005 119.094 64.1256L118.286 63.2903L109.318 29.6627C109.09 27.3567 109.197 24.0333 109.312 20.4848V20.4842C109.521 14.0251 109.754 6.82029 108.031 3.64782C105.498 -1.03485 98.1728 -1.18547 95.1469 3.05907C90.0149 10.2633 89.8609 34.2069 89.7593 50.0164V50.0173C89.7326 54.1584 89.7096 57.7414 89.6016 60.3192C89.123 71.9931 88.4769 83.663 87.8306 95.3355C87.2937 105.034 86.7567 114.733 86.3155 124.439C85.1578 124.627 85.1906 124.33 85.2442 123.846C85.2685 123.626 85.2972 123.367 85.2201 123.097C83.4719 116.893 82.2131 109.666 80.9184 102.233C78.4816 88.2423 75.917 73.5189 69.7208 63.4957C68.2831 61.1681 64.2029 59.484 61.4782 60.0179C60.8081 60.1452 60.4217 60.5404 60.1075 60.8618C59.9146 61.0592 59.7488 61.2288 59.5613 61.2913C58.9973 61.4861 58.5169 61.5991 58.0878 61.6999C56.798 62.0031 55.9711 62.1975 54.728 64.1803C51.5489 69.2482 49.0289 93.8152 48.1722 102.167L48.101 102.86C47.5147 108.614 47.1605 114.39 46.8065 120.162L46.8065 120.163C46.5405 124.501 46.2745 128.837 45.9103 133.161L6.34032 87.8402C3.73884 85.6084 -0.0675495 86.6627 0.00091069 90.291C5.98433 108.611 10.7218 127.287 15.2812 146.018C17.4758 154.99 19.4222 164.165 21.3705 173.349C24.09 186.168 26.813 199.004 30.2192 211.329C30.3495 211.801 30.4843 212.31 30.6264 212.847C32.3051 219.191 34.9937 229.351 43.1993 226.801C48.5939 225.13 47.4986 216.901 46.8414 212.725C45.8119 206.158 43.6845 198.416 41.7491 191.372L41.7487 191.371C41.2389 189.516 40.7425 187.709 40.2829 185.985C35.0441 166.308 28.7163 146.923 22.3958 127.561C20.3907 121.418 18.3863 115.278 16.4177 109.131L39.0095 138.117C40.1283 139.219 41.5841 141.612 43.1163 144.129C45.3156 147.744 47.6723 151.616 49.4155 152.302C52.948 153.685 54.8786 151.221 55.5906 148.03C56.6725 143.158 57.3502 137.77 58.0261 132.395C58.5563 128.18 59.0854 123.973 59.8077 120.03C61.0513 113.242 62.5772 106.502 64.1006 99.7721L64.1007 99.7719L64.1031 99.761C64.5916 97.6031 65.0799 95.4463 65.5584 93.2896L66.3662 93.8373L82.4133 145.087L63.2034 153.302L62.5324 156.615C62.7515 156.944 63.0117 157.259 63.3677 157.437C65.7338 158.601 72.2759 155.839 77.3118 153.712C79.4445 152.812 81.3071 152.026 82.468 151.7C83.7688 153.466 76.4025 183.493 75.225 187.847C75.051 188.493 74.738 189.381 74.3766 190.406C72.5187 195.676 69.3813 204.574 77.2788 203.004C81.4616 202.165 86.4073 188.036 87.895 183.786L87.9449 183.643C91.343 173.94 93.7738 163.929 96.2004 153.934C96.883 151.123 97.5653 148.313 98.2687 145.511L118.505 136.954C120.114 143.382 121.762 149.806 123.41 156.234L123.411 156.235C131.822 189.033 140.253 221.909 143.63 255.705C143.715 256.566 143.685 257.433 143.654 258.301C143.615 259.393 143.577 260.488 143.767 261.578C144.548 265.96 149.23 266.85 150.134 261.661C151.832 251.843 150.545 236.933 149.641 226.773C148.544 214.273 146.493 201.791 144.454 189.381C144.026 186.772 143.597 184.165 143.179 181.562C145.399 179.837 147.654 178.15 149.909 176.464C155.759 172.089 161.608 167.713 166.866 162.653C180.243 149.756 194.291 132.873 181.872 114.047L202.082 110.227C197.659 115.69 181.105 136.474 196.975 137.487C200.997 137.746 206.409 136.94 211.761 136.143C215.774 135.545 219.753 134.952 223.085 134.818C233.176 134.407 244.691 134.886 254.645 136.57C257.59 137.071 261.29 138.13 265.082 139.215C270.723 140.829 276.569 142.501 280.441 142.485C282.44 142.485 285.836 141.458 287.301 140.034C289.875 137.529 291.217 132.586 289.943 129.231C289.045 126.871 284.82 122.96 281.183 119.593C279.334 117.881 277.637 116.31 276.607 115.156C275.102 113.473 273.203 110.874 271.185 108.111C267.588 103.186 263.609 97.7384 260.793 96.028C256.398 93.3581 250.51 96.0828 250.154 101.299C249.913 104.833 253.507 110.766 256.321 115.412C257.346 117.104 258.267 118.625 258.863 119.797C259.041 120.375 250.531 120.187 245.98 120.087C244.596 120.057 243.578 120.034 243.281 120.044C227.809 120.605 212.666 123.96 197.714 127.711C196.605 126.684 206.751 110.911 209.202 109.446C211.282 108.19 215.288 107.886 219.145 107.594C221.761 107.396 224.307 107.203 226.139 106.721C229.726 105.777 233.341 102.532 232.642 98.5337C231.798 93.683 226.63 95.116 223.154 96.0797C222.852 96.1633 222.563 96.2434 222.291 96.3155C216.816 97.7786 211.317 99.677 205.798 101.582L205.797 101.582C199.489 103.76 193.155 105.946 186.801 107.502C203.478 90.7703 217.143 71.0126 226.125 49.0917C227.38 49.676 227.314 51.1111 227.251 52.5067C227.224 53.1062 227.197 53.6983 227.275 54.2125C228.398 61.8253 232.519 79.9536 238.311 84.9375C241.898 88.0182 247.224 86.9228 248.676 82.2949C250.16 77.5654 251.475 76 253.257 73.8782C254.204 72.7506 255.283 71.4658 256.59 69.4655C258.315 66.8229 261.971 61.1955 257.124 59.8126C254.361 59.0176 251.743 62.795 249.572 65.9264C248.752 67.1096 247.996 68.2006 247.32 68.9178C247.185 69.0597 247.087 69.222 246.999 69.3653C246.758 69.7607 246.606 70.0111 246.033 69.2875C245.797 66.7835 245.244 64.3475 244.692 61.9101C244.316 60.2559 243.941 58.6008 243.664 56.9235C242.966 52.6487 242.646 48.3532 242.328 44.0779L242.328 44.0774C242.067 40.5612 241.806 37.0586 241.337 33.5923C240.378 26.4725 239.612 22.6661 233.902 17.956C230.616 15.245 227.124 16.532 225.139 19.9824C222.573 24.4353 220.368 30.3741 218.208 36.1899C216.795 39.9951 215.401 43.7476 213.939 46.9968C204.355 68.2879 192.662 89.2505 176.437 106.16C175.771 106.458 172.699 103.161 170.592 100.899L170.592 100.899C169.794 100.043 169.135 99.3349 168.796 99.0266C166.058 96.5346 163.142 94.0564 160.307 91.6739C158.672 90.3028 156.259 88.5951 153.765 86.8295ZM141.505 173.552C143.455 173.487 143.127 172.164 142.804 170.858C142.685 170.377 142.566 169.898 142.562 169.486C142.546 167.849 142.544 166.225 142.541 164.608C142.533 159.304 142.525 154.081 142.042 148.729C140.978 137.117 138.663 125.457 136.355 113.836C134.801 106.011 133.25 98.2044 132.088 90.4417C131.513 88.5334 128.225 86.2638 125.674 84.5028C124.82 83.9135 124.049 83.3812 123.489 82.9384L141.505 173.552ZM111.824 130.505C110.687 131.162 100.432 136.912 99.9939 136.42V136.406L105.717 84.0064L115.849 127.396C115.665 128.421 113.806 129.427 112.494 130.136C112.246 130.27 112.018 130.393 111.824 130.505ZM152.119 105.873C155.474 108.652 159.513 112.28 162.58 115.347L162.566 115.361C173.013 125.822 176.628 130.505 168.344 144.457C164.155 151.522 157.678 158.56 151.859 164.283C153.366 148.77 151.521 133.281 149.683 117.84C149.098 112.933 148.515 108.031 148.039 103.134C148.379 102.743 151.332 105.214 152.033 105.801L152.119 105.873Z"
                  fill="#181617"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M515.039 128.251C515.923 128.376 515.939 128.327 516.077 127.921C516.111 127.82 516.153 127.696 516.218 127.547C517.248 125.249 518.074 122.549 518.913 119.804C519.714 117.185 520.528 114.523 521.544 112.13C526.747 99.8618 540.042 75.9691 555.117 75.2572C563.497 74.8601 568.316 81.3775 569.905 88.9081C572.418 100.781 568.601 112.396 564.917 123.609C564.446 125.042 563.977 126.469 563.524 127.889C561.662 130.573 557.801 129.094 557.157 126.205C556.714 124.204 558.03 119.298 559.308 114.534L559.308 114.534C560.242 111.05 561.156 107.643 561.347 105.503C561.662 101.861 561.771 87.402 556.705 86.8817C553.981 87.3883 551.078 89.6886 549.12 91.6328C538.194 102.545 522.927 139.021 529.089 153.726C530.938 158.145 533.848 157.394 537.604 156.425C537.852 156.361 538.103 156.296 538.358 156.232C541.407 155.462 544.581 154.08 547.82 152.668C556.163 149.034 564.944 145.209 573.15 151.166C585.116 159.847 577.257 179.7 570.589 189.545C565.701 196.76 556.582 203.237 549.654 194.296C547.751 191.845 542.329 181.85 549.079 182.274C550.806 182.382 552.101 184.231 553.328 185.985C554.747 188.011 556.077 189.911 557.883 188.846C561.251 186.861 565.852 175.442 566.632 171.375C569.077 158.561 561.211 162.517 554.084 166.101C552.43 166.933 550.816 167.744 549.38 168.322L549.186 168.4C542.383 171.129 535.18 174.02 527.815 171.375L527.213 172.484C527.874 175.33 528.632 178.172 529.39 181.018C530.657 185.772 531.927 190.537 532.758 195.35C532.796 195.57 532.836 195.793 532.877 196.021C532.922 196.272 532.969 196.528 533.017 196.787C533.843 201.297 534.887 206.994 531.95 210.411C528.692 214.204 522.667 214.752 519.011 211.014C518.754 210.748 518.477 210.258 518.175 209.725C517.545 208.611 516.806 207.306 515.917 207.454C503.074 214.902 486.903 223.323 474.594 210.11C473.732 216.956 471.897 223.542 469.693 230.059C470.273 230.968 471.013 231.845 471.761 232.732C473.854 235.213 476.004 237.762 474.854 241.232L471.87 242.067C471.551 241.843 470.98 241.119 470.315 240.276L470.315 240.275C468.953 238.548 467.198 236.321 466.406 236.864C465.667 238.153 464.998 239.513 464.327 240.875L464.327 240.876C463.409 242.741 462.489 244.611 461.381 246.312C457 253.076 447.306 263.605 441.487 269.561C430.711 280.583 411.145 296.425 394.852 288.99C390.005 286.772 385.144 280.665 387.622 275.216C389.034 272.115 392.082 271.589 395.122 271.065L395.122 271.065C396.593 270.811 398.062 270.557 399.343 270.013C407.01 266.74 418.31 256.678 426.412 249.464C428.004 248.046 429.473 246.738 430.766 245.613C432.448 244.15 434.185 242.683 435.938 241.203L435.939 241.202L435.94 241.202C439.694 238.032 443.518 234.803 447.019 231.415C447.121 231.316 447.23 231.219 447.34 231.122C447.915 230.608 448.512 230.075 448.374 229.224C426.855 227.186 407.702 235.433 388.613 243.652C381.162 246.861 373.721 250.064 366.153 252.651C352.721 257.238 335.196 261.099 325.515 247.503C318.509 237.676 321.094 228.751 323.976 218.805C324.27 217.79 324.568 216.763 324.858 215.724L324.874 215.665C325.086 214.884 325.255 214.264 324.16 214.478L285.63 243.792C287.068 251.214 289.19 258.566 291.395 265.796C291.811 267.157 292.592 269.141 293.42 271.242L293.42 271.243L293.42 271.243L293.42 271.244L293.421 271.245C294.798 274.742 296.303 278.567 296.475 280.405C296.748 283.349 294.188 284.061 292.038 282.76C290.779 281.993 285.959 272.053 285.014 269.999C283.578 266.862 282.36 263.603 281.147 260.356L281.147 260.355C279.898 257.012 278.655 253.683 277.182 250.515C275.484 251.612 273.619 253.272 271.636 255.036C265.721 260.3 258.761 266.494 252.085 261.428C248.196 258.47 248.963 254.157 250.784 250.31C252.853 245.931 255.515 241.613 258.202 237.256C261.74 231.519 265.32 225.714 267.639 219.612C267.015 216.092 266.297 212.586 265.58 209.081L265.579 209.078C263.729 200.042 261.879 191.009 261.642 181.726C261.06 182.091 260.473 182.915 259.854 183.784C258.449 185.755 256.881 187.956 254.837 185.533C252.872 183.19 255.063 179.264 256.426 176.823C256.496 176.696 256.565 176.574 256.631 176.455C257.03 175.733 258.119 174.322 259.108 173.04L259.109 173.039L259.109 173.039C260.052 171.817 260.905 170.711 260.985 170.431C261.37 169.09 261.423 167.263 261.479 165.328C261.598 161.274 261.73 156.748 264.955 155.246C265.366 155.054 269.474 154.945 269.72 155.082C270.59 155.579 271.315 157.415 271.927 158.962L271.927 158.963C272.26 159.804 272.559 160.56 272.828 160.969C286.014 154.781 296.557 161.161 297.679 175.455C298.898 191.215 293.449 208.138 287.315 222.405C287.057 223 286.696 223.599 286.328 224.21C285.483 225.612 284.602 227.074 284.85 228.676C287.857 226.372 290.85 224.046 293.843 221.719L293.848 221.715C301.007 216.151 308.168 210.585 315.534 205.304C316.479 204.63 318.063 203.623 319.967 202.412L319.971 202.41L319.972 202.409L319.975 202.408C326.848 198.039 337.881 191.026 338.085 187.436C338.139 186.441 338.063 185.823 337.999 185.304C337.872 184.268 337.793 183.629 338.906 181.165C341.257 175.946 344.745 170.377 348.335 164.643C354.55 154.719 361.072 144.303 362.539 134.366C362.68 133.422 362.657 132.412 362.633 131.411V131.409C362.602 130.086 362.571 128.778 362.922 127.657C364.401 122.919 368.823 123.07 372.178 126.109C376.18 129.738 379.059 135.733 381.819 141.482L381.819 141.482C383.507 144.997 385.15 148.419 386.979 151.152L404.902 128.957C408.64 126.246 413.268 128.15 411.529 133.133C409.199 137.097 406.647 140.94 404.097 144.782L404.096 144.783C401.536 148.639 398.977 152.494 396.646 156.465C395.986 157.591 395.249 159.253 394.495 160.951C393.416 163.38 392.306 165.882 391.347 166.994C390.443 168.048 387.431 169.705 386.02 169.595C382.173 169.308 380.037 167.487 378.216 164.283C376.385 161.051 374.859 157.39 373.331 153.727C371.947 150.405 370.561 147.081 368.947 144.073H367.851C364.236 154.151 359.65 164.036 354.775 173.58C354.619 173.885 354.069 174.791 353.367 175.949L353.367 175.949L353.366 175.95C351.545 178.952 348.699 183.644 349.025 183.931C352.173 184.23 355.106 183.255 358.072 182.268C359.582 181.766 361.101 181.26 362.662 180.919C367.29 179.905 372.849 178.796 377.408 180.385C380.229 181.37 382.022 184.054 379.845 186.642C378.926 187.727 373.606 189.126 369.248 190.273C367.115 190.834 365.212 191.334 364.168 191.708C361.471 192.666 350.079 197.445 348.778 199.252C347.998 202.108 346.737 205.468 345.399 209.031L345.398 209.032C342.324 217.222 338.844 226.492 339.865 233.208C341.018 240.805 352.996 237.402 359.549 235.54L359.551 235.539C360.308 235.324 360.993 235.129 361.58 234.975C368.634 233.113 375.582 230.718 382.538 228.32C395.486 223.858 408.461 219.385 422.195 218.325C422.174 217.332 421.738 217.239 421.114 217.107C420.517 216.98 419.748 216.817 419.005 215.792C417.964 214.355 417.293 211.917 417.279 210.151C416.668 209.981 416.468 210.177 416.221 210.418C416.131 210.506 416.035 210.601 415.91 210.685C414.584 211.597 413.22 212.843 411.801 214.14C408.722 216.953 405.379 220.008 401.575 220.42C395.208 221.105 390.019 215.286 391.306 209.056C392.5 203.263 398.426 198.596 403.96 194.239L403.96 194.239C406.928 191.901 409.784 189.653 411.734 187.368L408.544 168.651C407.449 167.596 393.839 176.195 392.196 177.701C391.823 178.043 391.488 178.542 391.138 179.064C390.061 180.668 388.842 182.485 385.938 180.604C381.803 177.934 388.923 171.403 391.059 169.458C400.575 160.832 421.414 148.756 434.477 150.098C438.721 150.536 443.24 152.946 445.375 156.684C449.315 163.59 446.705 170.758 444.222 177.577C443.978 178.247 443.735 178.914 443.5 179.577C453.016 178.235 461.792 180.973 468.611 187.765C467.529 177.331 469.72 151.7 480.14 146.593C489.491 142.006 495.31 151.015 497.953 158.71C498.706 160.928 501.472 169.869 501.417 171.635C501.234 177.55 495.831 178.605 490.528 179.64C487.495 180.232 484.495 180.817 482.522 182.302C482.522 186.327 483.576 200.567 488.259 201.717C492.169 202.685 504.362 196.653 510.097 193.817L510.108 193.811C510.775 193.481 511.355 193.195 511.823 192.968L512.138 192.42C506.88 164.776 501.622 136.351 498.665 108.323C498.532 107.053 498.386 105.726 498.237 104.359C497.373 96.4626 496.364 87.2491 496.68 80.0357C496.94 74.1207 502.293 73.395 504.142 78.8308L515.039 128.251ZM485.023 161.287C485.046 160.969 485.056 160.832 486.055 160.997H486.041L489.299 170.485L482.782 173.005C482.385 172.594 484.343 162.996 484.918 161.763C485.002 161.58 485.014 161.418 485.023 161.287ZM415.308 165.337C416.307 163.858 429.137 161.955 431.451 162.626C431.704 165.146 430.268 167.348 428.931 169.4C428.75 169.677 428.57 169.952 428.397 170.225C427.521 171.594 420.21 181.069 418.895 180.097C418.793 179.124 418.115 177.06 417.361 174.768L417.361 174.767C416.089 170.898 414.603 166.377 415.308 165.337ZM276.991 199.076C276.752 199.623 276.501 200.198 275.827 200.307L275.841 200.293C275.584 196.938 275.061 193.569 274.538 190.197C273.917 186.191 273.294 182.179 273.116 178.18C273.109 178.055 273.102 177.922 273.094 177.783L273.093 177.762V177.762C273.006 176.233 272.879 173.981 273.116 172.744C273.54 170.513 281.797 167.706 282.81 172.306C283.905 177.263 279.62 193.912 277.182 198.663C277.115 198.793 277.053 198.934 276.991 199.076ZM426.234 201.388C432.094 196.486 451.359 187.559 457.493 194.46V194.446C458.342 195.391 459.916 199.43 460.149 200.799C461.313 207.481 458.712 215.505 455.48 221.338L454.248 221.502C444.595 218.079 433.313 216.942 423.263 218.312C423.068 217.319 423.859 217.076 424.738 216.806C425.337 216.622 425.977 216.426 426.371 215.97C428.414 213.599 427.608 209.662 426.886 206.135C426.524 204.366 426.184 202.701 426.234 201.388Z"
                  fill="#181617"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M194.455 192.666L194.729 193.748C203.834 192.365 226.796 192.037 224.358 206.454C222.921 214.971 208.106 223.104 201.041 226.801C192.716 231.155 178.052 238.507 169.316 240.945C169.244 240.965 169.173 240.985 169.103 241.006C169.048 241.021 168.994 241.037 168.94 241.053C168.811 241.091 168.685 241.128 168.56 241.165C166.581 241.753 165.115 242.189 163.128 240.616C155.786 234.829 169.719 228.485 174.882 226.134C175.079 226.044 175.263 225.96 175.433 225.883C175.593 225.809 175.741 225.741 175.875 225.678C174.398 224.097 173.595 221.868 172.859 219.823C172.823 219.725 172.788 219.627 172.753 219.53C172.425 218.626 172.007 217.021 171.566 215.323C170.885 212.704 170.147 209.865 169.59 209.042C169.302 208.613 168.733 208.326 168.089 208.002C166.925 207.416 165.517 206.706 165.086 204.811C164.487 202.173 165.144 200.557 165.751 199.066C166.129 198.134 166.488 197.252 166.509 196.199C166.533 194.957 166.135 193.512 165.723 192.013C165.171 190.011 164.594 187.913 164.962 186.081C164.593 185.707 163.403 186.015 161.935 186.395C159.099 187.128 155.23 188.13 154.255 184.999C153.475 182.493 156.227 180.905 158.034 179.974C165.483 176.14 188.882 169.595 196.769 170.924C201.26 171.677 204.724 175.716 204.3 180.344C203.916 184.52 198.015 190.667 194.455 192.639V192.666ZM186.267 181.74L171.521 184.191C170.928 184.561 171.039 184.751 171.197 185.021C171.262 185.131 171.334 185.255 171.37 185.41C171.577 186.251 171.888 187.07 172.198 187.89C172.586 188.913 172.974 189.938 173.164 191.01C173.821 191.489 185.213 183.424 186.267 181.74ZM179.188 205.783L184.35 222.679C186.813 221.486 189.321 220.383 191.829 219.279C196.574 217.193 201.317 215.106 205.751 212.41L206.173 212.154C211.895 208.68 220.603 203.392 207.859 202.47C199.959 201.896 191.634 203.46 183.71 204.949L183.71 204.949L183.709 204.949L183.708 204.949C182.184 205.235 180.676 205.519 179.188 205.783Z"
                  fill="#181617"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M566.58 34.1562C566.418 30.7182 566.249 27.1414 564.537 25.7604V25.7878C562.606 24.2269 558.567 24.4871 557.855 27.2666L548.983 60.4424C548.49 64.4768 549.112 64.6382 550.574 65.0173C551.141 65.1644 551.835 65.3443 552.638 65.796C553.838 66.4694 555.064 67.1068 556.293 67.7459C560.086 69.7182 563.909 71.7062 567.084 74.819C567.665 75.3859 568.282 76.1795 568.944 77.0313C570.809 79.4301 573.034 82.2912 575.833 81.8567C576.237 81.7951 576.589 81.5656 576.947 81.3327C577.305 81.1001 577.668 80.864 578.092 80.7887C578.666 80.6822 579.235 80.701 579.815 80.7203C580.576 80.7455 581.354 80.7714 582.186 80.5149C584.98 79.659 589.297 70.6178 592.252 64.4277L592.253 64.4262C593.221 62.3977 594.044 60.6756 594.618 59.6482C595.591 57.908 597.426 55.2942 599.315 52.6034C601.944 48.8581 604.678 44.9635 605.339 43.0672C606.393 40.0139 605.325 37.2755 601.793 38.4119C599.607 39.1146 596.57 41.313 593.61 43.4563C591.379 45.0718 589.191 46.6559 587.444 47.5445C587.275 47.6289 587.108 47.7181 586.941 47.8072L586.94 47.8082C586.134 48.2391 585.336 48.6664 584.349 48.5303L590.894 30.2925C590.374 27.1023 587.211 26.623 584.5 27.6636C583.404 28.0842 579.817 30.9956 576.208 33.9249L576.208 33.9253L576.207 33.9258C572.061 37.2908 567.887 40.6792 567.426 40.3425C566.802 38.8711 566.693 36.5474 566.58 34.1566V34.1562ZM578.886 41.9855C572.601 56.5265 577.996 61.8527 591.442 52.8981L591.455 52.8844L578.078 75.2709C577.481 75.4109 576.075 73.5201 574.989 72.0598L574.988 72.0592C574.482 71.3782 574.045 70.7909 573.793 70.5471C569.137 66.0561 560.908 61.1954 554.323 62.1676L560.607 45.2579C563.982 52.8428 570.79 47.8387 575.901 44.0826C576.989 43.2823 578.001 42.5386 578.886 41.9855Z"
                  fill="#181617"
                />
                <path
                  d="M241.775 224.692C237.544 228.197 231.917 226.061 230.082 221.173C229.154 218.719 229.884 213.188 230.48 208.668C230.729 206.784 230.954 205.076 231.027 203.839C231.136 201.991 231.657 191.188 231.301 190.462C224.475 185.685 218.681 179.696 212.889 173.709C209.699 170.411 206.51 167.115 203.15 164.023C201.178 159.71 204.327 157.136 208.668 158.505L231.027 174.36L232.656 174.634C232.701 173.829 232.674 173.014 232.646 172.2C232.615 171.283 232.584 170.365 232.656 169.458C232.767 168.113 232.859 166.475 232.959 164.713C233.23 159.932 233.552 154.241 234.422 151.029C235.819 145.867 241.405 144.676 242.994 150.385C242.934 160.424 243.529 170.483 244.123 180.528C244.615 188.857 245.107 197.177 245.225 205.468C245.227 205.6 245.229 205.737 245.232 205.878L245.235 206.08C245.315 211.153 245.479 221.591 241.748 224.692H241.775Z"
                  fill="#181617"
                />
                <path
                  d="M52.7564 239.069C57.2337 233.647 51.1407 227.677 45.2395 228.8V228.786C43.035 229.21 37.7499 233.879 37.2981 236.18C35.7509 244.176 49.0869 243.519 52.7564 239.069Z"
                  fill="#181617"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
