import { Link } from 'react-router'
import Logo from './logo'
import { isDevelopment } from '@/lib/constants'

export const links = [
  {
    label: 'X',
    to: 'https://x.com/joyco_studio',
  },
  {
    label: 'github',
    to: 'https://github.com/joyco-studio/marquee',
  },
  {
    label: 'discord',
    to: 'https://discord.gg/UJtQFJ3X3z',
  },
  isDevelopment
    ? {
        label: 'Test Page',
        to: '/test',
      }
    : undefined,
]

const checkIsAbsoluteUrl = (url: string) => {
  return url.startsWith('http')
}

export default function Header() {
  return (
    <div className="flex items-center px-em-[32] h-em-[64] bg-foreground text-background fixed top-0 left-1/2 -translate-x-1/2 rounded-b-em-[24] z-50">
      <Link to="/">
        <Logo className="text-background h-em-[20] mr-em-[20]" />
      </Link>

      <div className="flex items-center gap-x-em-[20] font-mono uppercase text-em-[16/16] leading-[1]">
        {links.map((link) => {
          if (!link) return null
          const isAbsoluteUrl = checkIsAbsoluteUrl(link.to)
          return (
            <Link
              key={link.label}
              to={link.to}
              target={isAbsoluteUrl ? '_blank' : undefined}
              rel={isAbsoluteUrl ? 'noopener noreferrer' : undefined}
              className="underline underline-offset-2"
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
