import { type ComponentProps } from "solid-js"

// The ECS microchip mark (.packages/identity/mark.svg), drawn in the theme's icon colours.
const Chip = () => (
  <>
    <g stroke="var(--icon-strong-base)" stroke-width="10" stroke-linecap="round">
      <line x1="224" y1="160" x2="224" y2="64" />
      <line x1="224" y1="352" x2="224" y2="448" />
      <line x1="160" y1="224" x2="64" y2="224" />
      <line x1="352" y1="224" x2="448" y2="224" />
      <line x1="256" y1="160" x2="256" y2="64" />
      <line x1="256" y1="352" x2="256" y2="448" />
      <line x1="160" y1="256" x2="64" y2="256" />
      <line x1="352" y1="256" x2="448" y2="256" />
      <line x1="288" y1="160" x2="288" y2="64" />
      <line x1="288" y1="352" x2="288" y2="448" />
      <line x1="160" y1="288" x2="64" y2="288" />
      <line x1="352" y1="288" x2="448" y2="288" />
    </g>
    <g fill="var(--icon-strong-base)">
      <circle cx="224" cy="48" r="13" />
      <circle cx="224" cy="464" r="13" />
      <circle cx="48" cy="224" r="13" />
      <circle cx="464" cy="224" r="13" />
      <circle cx="256" cy="48" r="13" />
      <circle cx="256" cy="464" r="13" />
      <circle cx="48" cy="256" r="13" />
      <circle cx="464" cy="256" r="13" />
      <circle cx="288" cy="48" r="13" />
      <circle cx="288" cy="464" r="13" />
      <circle cx="48" cy="288" r="13" />
      <circle cx="464" cy="288" r="13" />
      <rect x="160" y="160" width="192" height="192" rx="12" />
    </g>
    <rect x="192" y="192" width="128" height="128" rx="6" fill="var(--icon-weak-base)" />
  </>
)

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Chip />
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
      <Chip />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g transform="scale(0.08203125)">
        <Chip />
      </g>
      <g transform="translate(54 0)">
        <path d="M12 36H6V24H12V36ZM24 36H18V24H24V36Z" fill="var(--icon-weak-base)" />
        <path d="M0 6H30V36H24V12H18V24H12V12H6V36H0V6Z" fill="var(--icon-strong-base)" />
        <path d="M54 30H42V18H54V30Z" fill="var(--icon-weak-base)" />
        <path d="M54 12H42V30H54V12ZM60 36H36V6H60V36Z" fill="var(--icon-strong-base)" />
        <path d="M84 30H72V18H84V30Z" fill="var(--icon-weak-base)" />
        <path d="M84 12H72V30H84V12ZM66 6H84V12H90V30H84V36H66V6Z" fill="var(--icon-strong-base)" />
      </g>
    </svg>
  )
}
