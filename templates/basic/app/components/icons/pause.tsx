import type { SVGProps } from 'react'

const PauseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeWidth={2.667}
      d="M6.667 5.333H12v21.334H6.667V5.333ZM20 5.333h5.333v21.334H20V5.333Z"
    />
  </svg>
)
export default PauseIcon
