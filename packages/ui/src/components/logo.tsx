import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path data-slot="logo-logo-mark-shadow" d="M12 16H4V8H12V16Z" fill="var(--icon-weak-base)" />
      <path data-slot="logo-logo-mark-o" d="M12 4H4V16H12V4ZM16 20H0V0H16V20Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 80H20V40H60V80Z" fill="var(--icon-base)" />
      <path d="M60 20H20V80H60V20ZM80 100H0V0H80V100Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 90 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g>
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
