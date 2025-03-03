# <img src="https://raw.githubusercontent.com/joyco-studio/marquee/main/static/JOYCO.png" alt="JOYCO Logo" height="36" width="36" align="top" />&nbsp;&nbsp;JOYCO Marquee

<img src="https://raw.githubusercontent.com/joyco-studio/marquee/main/static/banner.png" alt="banner" />

```bash
pnpm add @joycostudio/marquee
```

## 🤔 Why Marquee?

JOYCO Marquee leverages the Web Animations API (WAAPI) to create smooth, performant animations. While CSS animations are great for simple use cases, we chose to build on top of the JavaScript-based Web Animations API for several key advantages:

- **Precise Control**: The Web Animations API provides programmatic control over animation playback, allowing features like dynamic speed adjustment and direction changes without recreating the animation.
- **Performance**: By using the browser's native animation engine, we achieve smooth performance off the main thread.
- **Runtime Flexibility**: Unlike CSS animations, we can modify animation parameters (speed, direction) on the fly.

## 📖 Documentation

#### Basic Usage

```tsx
import { Marquee } from '@joycostudio/marquee/react'

function App() {
  return (
    <Marquee speed={1} speedFactor={1} direction={1} play={true}>
      <div>Your content here</div>
    </Marquee>
  )
}
```

#### Props

- `speed` (number): Base speed of the marquee animation
- `speedFactor` (number): Multiplier for the base speed
- `direction` (1 | -1): Direction of movement (1 for right-to-left, -1 for left-to-right)
- `play` (boolean, optional): Controls whether the marquee is playing or paused (default: true)
- `rootClassName` (string, optional): Class name for the root container
- `marqueeClassName` (string, optional): Class name for the marquee element
- `children` (ReactNode): The content to be scrolled

#### Custom Hook

For more control, you can use the `useMarquee` hook. This is particularly useful when you need to:

- Share the same marquee instance configuration across multiple elements
- Have more granular control over the marquee instance, like controlling its `speedFactor`.

Let's make an example with [lenis](https://github.com/darkroomengineering/lenis) from darkroom.engineering.

```tsx
import { useMarquee, Marquee } from '@joycostudio/marquee/react'
import { useLenis } from 'lenis'

const ScrollVelocityBoundMarquee = ({ inverted }: { inverted?: boolean }) => {
  const [ref, marquee] = useMarquee({ speed: 100, speedFactor: 1, direction: inverted ? -1 : 1 })
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
```

Notice how we are using the same `<Marquee>` component, but instead, we are just passing an `instance` prop that expects to receive the return type of the `useMarquee` hook. It will just serve as a shell to add the necessary html and styles to make the marquee work.

The `useMarquee` hook returns a tuple containing:

- `rootRef`: A ref to attach to your container element
- `marquee`: A marquee instance with the following methods:
  - `play()`: Start the marquee animation
  - `pause()`: Pause the marquee animation
  - `setSpeed(speed: number)`: Update the base speed
  - `setSpeedFactor(factor: number)`: Update the speed multiplier
  - `setDirection(direction: 1 | -1)`: Change the scroll direction
  - `destroy()`: Clean up the marquee (automatically called on unmount)

#### Plain HTML Usage

For vanilla JavaScript applications, you can use the core package directly via CDN:

```html
<body>
  <main>
    <div id="marquee-wrapper">
      <div id="marquee-root">
        <div style="white-space: nowrap">
          Hey there! | Hey there! | Hey there! | Hey there! | Hey there! | Hey there! | Hey there! | Hey there! |&nbsp;
        </div>
      </div>
    </div>
  </main>

  <script type="module">
    import { Marquee } from 'https://cdn.jsdelivr.net/npm/@joycostudio/marquee/dist/core.min.mjs'

    const marqueeChildElm = document.getElementById('marquee-root')

    const marqueeInstance = new Marquee(marqueeChildElm, {
      speed: 500,
      direction: 1,
      speedFactor: 1,
    })

    marqueeInstance.initialize(marqueeChildElm.children[0])
    marqueeInstance.play()
  </script>
</body>
```

> Check the live example: https://stackblitz.com/edit/joyco-marquee-static?file=index.html

#### Notes

- The marquee component only supports a single child element. Wrap multiple elements in a container if needed.
- The marquee automatically handles cleanup on unmount.
- The component provides built-in styles for proper overflow handling and content positioning.
- You are responsible for making the marquee cover the full width of it's render area. This library **DOES NOT** auto-fill that space.

<br/>

## Can I use it in [place the latest top-notch high-performance new tech framework here]?

This library is not strictly bound to React, it has a core package and a React implementation of that core functionality. So feel free to create you own implementation in your favorite framework. And if your heart is big enough, leave a PR for the community. The rebels will thank your service 🫡.

<br/>

## 🤖 Automatic Workflows

This template comes with two GitHub Actions workflows (currently disabled for convenience):

1. **Release Workflow** (`.github/workflows/release.yml`): Automates the release process using Changesets. When enabled, it will automatically create release pull requests and publish to npm when changes are pushed to the main branch.

2. **Publish Any Commit** (`.github/workflows/publish-any-commit.yml`): A utility workflow that can build and publish packages for any commit or pull request.

<br/>

## 🦋 Version Management

This library uses [Changesets](https://github.com/changesets/changesets) to manage versions and publish releases. Here's how to use it:

### Adding a changeset

When you make changes that need to be released:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages you want to include in the changeset
2. Choose whether it's a major/minor/patch bump
3. Provide a summary of the changes

### Creating a release

To create a new version and update the changelog:

```bash
# 1. Create new versions of packages
pnpm version:package

# 2. Release (builds and publishes to npm)
pnpm release
```

Remember to commit all changes after creating a release.
