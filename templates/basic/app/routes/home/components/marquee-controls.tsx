import { IconButton } from '@/components/icon-button'
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon } from '@/components/icons'

import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useEffect, useState } from 'react'

interface MarqueeControlsProps {
  onPlayChange?: (play: boolean) => void
  onDirectionChange?: (direction: 1 | -1) => void
  onSpeedChange?: (speed: number) => void
  onSpeedFactorChange?: (factor: number) => void
  defaultPlay?: boolean
  defaultDirection?: 1 | -1
  defaultSpeed?: number
  defaultSpeedFactor?: number
}

export const MarqueeControls = ({
  onPlayChange,
  onDirectionChange,
  onSpeedChange,
  onSpeedFactorChange,
  defaultPlay = true,
  defaultDirection = 1,
  defaultSpeed = 300,
  defaultSpeedFactor = 1,
}: MarqueeControlsProps) => {
  const [play, setPlay] = useState(defaultPlay)
  const [direction, setDirection] = useState<1 | -1>(defaultDirection)
  const [speed, setSpeed] = useState(defaultSpeed)
  const [speedFactor, setSpeedFactor] = useState(defaultSpeedFactor)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    onPlayChange?.(play)
  }, [play, onPlayChange])

  useEffect(() => {
    onDirectionChange?.(direction)
  }, [direction, onDirectionChange])

  useEffect(() => {
    onSpeedChange?.(speed)
  }, [speed, onSpeedChange])

  useEffect(() => {
    onSpeedFactorChange?.(speedFactor)
  }, [speedFactor, onSpeedFactorChange])

  return (
    <div className="flex flex-col gap-8 p-8 bg-foreground/5 rounded-xl">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Playback</p>
        <IconButton active={play} onClick={() => setPlay(!play)}>
          {play ? <PauseIcon /> : <PlayIcon />}
        </IconButton>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Direction</p>
        <ToggleGroup.Root
          type="single"
          value={direction === 1 ? 'right' : 'left'}
          onValueChange={(value: string | undefined) => {
            if (!value) return
            setDirection(value === 'right' ? 1 : -1)
          }}
          className="flex gap-2"
        >
          <ToggleGroup.Item asChild value="left">
            <IconButton active={direction === -1}>
              <ArrowLeftIcon />
            </IconButton>
          </ToggleGroup.Item>
          <ToggleGroup.Item asChild value="right">
            <IconButton active={direction === 1}>
              <ArrowRightIcon />
            </IconButton>
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Speed (px/s)</p>
        <div
          className="relative h-10 bg-foreground/10 rounded-lg cursor-pointer"
          onMouseDown={(e) => {
            setIsDragging(true)
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = x / rect.width
            setSpeed(Math.round(percentage * 1000))
          }}
          onMouseMove={(e) => {
            if (!isDragging) return
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const percentage = Math.max(0, Math.min(1, x / rect.width))
            setSpeed(Math.round(percentage * 1000))
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          <div
            className="absolute inset-y-0 left-0 bg-foreground rounded-lg transition-all"
            style={{
              width: `${(speed / 1000) * 100}%`,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h3l3 3v3H3L0 3z' fill='%23000' fill-opacity='.1'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-4 bg-background border-2 border-foreground rounded-full transition-all"
            style={{ left: `${(speed / 1000) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Speed Factor</p>
        <ToggleGroup.Root
          type="single"
          value={String(speedFactor)}
          onValueChange={(value: string | undefined) => {
            if (!value) return
            setSpeedFactor(Number(value))
          }}
          className="flex gap-2"
        >
          {[0.25, 0.5, 1].map((factor) => (
            <ToggleGroup.Item asChild key={factor} value={String(factor)}>
              <IconButton active={speedFactor === factor}>
                <span className="text-sm font-medium">{factor}x</span>
              </IconButton>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>
    </div>
  )
}
