import type { SVGProps } from 'react'

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth={2}
      d="M9.85 8.089v1m0-4v-2h2m8 0h2v2m-7-2h2m5 5v2m0 3v2h-2m-3 0h-1m0-6h-12v12h12v-12Z"
    />
  </svg>
)
export default CopyIcon
