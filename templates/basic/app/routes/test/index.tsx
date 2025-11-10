import { Marquee } from '@joycostudio/marquee/react'

export default function Test() {
  return (
    <div className="h-screen flex items-center">
      <Marquee speed={100} direction={1} marqueeClassName="py-em-[24] bg-foreground/10">
        <h1 className="text-8xl font-bold uppercase">
          This page is to test how the marquee behaves when the component is unmounted.
        </h1>
      </Marquee>
    </div>
  )
}
