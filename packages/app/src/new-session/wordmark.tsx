import { Logo } from "@modtools-ai/ui/logo"
import "./wordmark.css"

// MOD keeps a still wordmark: upstream's interactive one (the lodger, the pin board and the
// brick breaker) is built on the geometry of its own letters. The interface is upstream's,
// so the new-session view is unchanged; without the lodger the view stays in its flat mode.

/** The lodger curled up as the brick breaker ball. Positions are the ball's centre, relative to the new session panel. */
export type LodgerBall = {
  radius: () => number
  at: () => { x: number; y: number }
  place: (
    x: number,
    y: number,
    pose: { look: number; lookAngle: number; stretch: number; angle: number; squint: number; curl: number },
  ) => void
  blink: () => void
  /** Uncurls and hops back to its perch beside the pin board. */
  done: () => void
}

export function NewSessionWordmark(props: {
  ref: (element: HTMLDivElement) => void
  pins?: boolean
  sound?: () => boolean
  onOpen?: () => void
  onClose?: () => void
  onFlat?: () => void
  onPlay?: (ball: LodgerBall) => void
}) {
  return (
    <div
      data-component="new-session-wordmark"
      aria-hidden="true"
      class="pointer-events-none mx-auto w-full max-w-[720px] text-v2-background-bg-inverse"
    >
      <div ref={props.ref} data-slot="wordmark-box" class="relative mx-auto aspect-[144/42] w-[46%]">
        <Logo class="block aspect-[144/42] w-full opacity-[0.16]" />
        <Logo class="wordmark-shimmer absolute inset-0 aspect-[144/42] w-full" />
      </div>
    </div>
  )
}
