import { ComponentProps } from "solid-js"

// ECS Microchip Mark
export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center chip */}
      <rect
        x="160"
        y="160"
        width="192"
        height="192"
        rx="8"
        fill="var(--icon-base, #5A5858)"
        stroke="var(--icon-strong-base, #1A1A1A)"
        stroke-width="6"
      />
      <rect
        x="176"
        y="176"
        width="160"
        height="160"
        rx="4"
        fill="white"
        stroke="var(--icon-strong-base, #1A1A1A)"
        stroke-width="6"
      />
      {/* Top legs */}
      <line x1="224" y1="160" x2="224" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="224" y1="160" x2="224" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="224" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="224" cy="48" r="8" fill="white" />
      <line x1="256" y1="160" x2="256" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="256" y1="160" x2="256" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="256" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="256" cy="48" r="8" fill="white" />
      <line x1="288" y1="160" x2="288" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="288" y1="160" x2="288" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="288" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="288" cy="48" r="8" fill="white" />
      {/* Bottom legs */}
      <line x1="224" y1="352" x2="224" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="224" y1="352" x2="224" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="224" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="224" cy="464" r="8" fill="white" />
      <line x1="256" y1="352" x2="256" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="256" y1="352" x2="256" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="256" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="256" cy="464" r="8" fill="white" />
      <line x1="288" y1="352" x2="288" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="288" y1="352" x2="288" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="288" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="288" cy="464" r="8" fill="white" />
      {/* Left legs */}
      <line x1="160" y1="224" x2="56" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="224" x2="56" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="224" r="8" fill="white" />
      <line x1="160" y1="256" x2="56" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="256" x2="56" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="256" r="8" fill="white" />
      <line x1="160" y1="288" x2="56" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="288" x2="56" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="288" r="8" fill="white" />
      {/* Right legs */}
      <line x1="352" y1="224" x2="456" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="224" x2="456" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="224" r="8" fill="white" />
      <line x1="352" y1="256" x2="456" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="256" x2="456" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="256" r="8" fill="white" />
      <line x1="352" y1="288" x2="456" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="288" x2="456" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="288" r="8" fill="white" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center chip */}
      <rect
        x="160"
        y="160"
        width="192"
        height="192"
        rx="8"
        fill="var(--icon-base, #5A5858)"
        stroke="var(--icon-strong-base, #1A1A1A)"
        stroke-width="6"
      />
      <rect
        x="176"
        y="176"
        width="160"
        height="160"
        rx="4"
        fill="white"
        stroke="var(--icon-strong-base, #1A1A1A)"
        stroke-width="6"
      />
      {/* Top legs */}
      <line x1="224" y1="160" x2="224" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="224" y1="160" x2="224" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="224" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="224" cy="48" r="8" fill="white" />
      <line x1="256" y1="160" x2="256" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="256" y1="160" x2="256" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="256" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="256" cy="48" r="8" fill="white" />
      <line x1="288" y1="160" x2="288" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="288" y1="160" x2="288" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="288" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="288" cy="48" r="8" fill="white" />
      {/* Bottom legs */}
      <line x1="224" y1="352" x2="224" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="224" y1="352" x2="224" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="224" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="224" cy="464" r="8" fill="white" />
      <line x1="256" y1="352" x2="256" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="256" y1="352" x2="256" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="256" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="256" cy="464" r="8" fill="white" />
      <line x1="288" y1="352" x2="288" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="288" y1="352" x2="288" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="288" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="288" cy="464" r="8" fill="white" />
      {/* Left legs */}
      <line x1="160" y1="224" x2="56" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="224" x2="56" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="224" r="8" fill="white" />
      <line x1="160" y1="256" x2="56" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="256" x2="56" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="256" r="8" fill="white" />
      <line x1="160" y1="288" x2="56" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="160" y1="288" x2="56" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="48" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="48" cy="288" r="8" fill="white" />
      {/* Right legs */}
      <line x1="352" y1="224" x2="456" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="224" x2="456" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="224" r="8" fill="white" />
      <line x1="352" y1="256" x2="456" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="256" x2="456" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="256" r="8" fill="white" />
      <line x1="352" y1="288" x2="456" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
      <line x1="352" y1="288" x2="456" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
      <circle cx="464" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
      <circle cx="464" cy="288" r="8" fill="white" />
    </svg>
  )
}

// MOD Text Logo with ECS Mark
export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 100"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      {/* ECS Microchip Mark - scaled down and positioned */}
      <g transform="translate(10, 10) scale(0.15)">
        {/* Center chip */}
        <rect
          x="160"
          y="160"
          width="192"
          height="192"
          rx="8"
          fill="var(--icon-base, #5A5858)"
          stroke="var(--icon-strong-base, #1A1A1A)"
          stroke-width="6"
        />
        <rect
          x="176"
          y="176"
          width="160"
          height="160"
          rx="4"
          fill="white"
          stroke="var(--icon-strong-base, #1A1A1A)"
          stroke-width="6"
        />
        {/* Top legs */}
        <line x1="224" y1="160" x2="224" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="224" y1="160" x2="224" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="224" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="224" cy="48" r="8" fill="white" />
        <line x1="256" y1="160" x2="256" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="256" y1="160" x2="256" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="256" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="256" cy="48" r="8" fill="white" />
        <line x1="288" y1="160" x2="288" y2="56" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="288" y1="160" x2="288" y2="56" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="288" cy="48" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="288" cy="48" r="8" fill="white" />
        {/* Bottom legs */}
        <line x1="224" y1="352" x2="224" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="224" y1="352" x2="224" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="224" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="224" cy="464" r="8" fill="white" />
        <line x1="256" y1="352" x2="256" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="256" y1="352" x2="256" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="256" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="256" cy="464" r="8" fill="white" />
        <line x1="288" y1="352" x2="288" y2="456" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="288" y1="352" x2="288" y2="456" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="288" cy="464" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="288" cy="464" r="8" fill="white" />
        {/* Left legs */}
        <line x1="160" y1="224" x2="56" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="160" y1="224" x2="56" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="48" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="48" cy="224" r="8" fill="white" />
        <line x1="160" y1="256" x2="56" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="160" y1="256" x2="56" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="48" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="48" cy="256" r="8" fill="white" />
        <line x1="160" y1="288" x2="56" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="160" y1="288" x2="56" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="48" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="48" cy="288" r="8" fill="white" />
        {/* Right legs */}
        <line x1="352" y1="224" x2="456" y2="224" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="352" y1="224" x2="456" y2="224" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="464" cy="224" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="464" cy="224" r="8" fill="white" />
        <line x1="352" y1="256" x2="456" y2="256" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="352" y1="256" x2="456" y2="256" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="464" cy="256" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="464" cy="256" r="8" fill="white" />
        <line x1="352" y1="288" x2="456" y2="288" stroke="var(--icon-strong-base, #1A1A1A)" stroke-width="16" stroke-linecap="round" />
        <line x1="352" y1="288" x2="456" y2="288" stroke="white" stroke-width="8" stroke-linecap="round" />
        <circle cx="464" cy="288" r="12" fill="var(--icon-strong-base, #1A1A1A)" />
        <circle cx="464" cy="288" r="8" fill="white" />
      </g>
      {/* MOD Text */}
      <text x="90" y="65" font-family="system-ui, sans-serif" font-size="48" font-weight="bold" fill="var(--icon-strong-base, #1A1A1A)">MOD</text>
    </svg>
  )
}
