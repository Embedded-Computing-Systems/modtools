import { createUniqueId, type ComponentProps } from "solid-js"

export function WordmarkV2(props: Pick<ComponentProps<"svg">, "class">) {
  const mask = createUniqueId()
  const maskGradient = createUniqueId()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 129"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g opacity="0.6">
        <g mask={`url(#${mask})`}>
          <g opacity="0.16">
            <path
              opacity="0.7"
              d="M231 18H249.4615V110.143H231V18ZM249.4615 18H286.3846V36.4286H249.4615V18ZM258.6923 36.4286H277.1538V73.2857H258.6923V36.4286ZM286.3846 18H304.8462V110.143H286.3846V18Z"
              fill="currentColor"
            />
            <path
              opacity="0.7"
              d="M378.3846 36.4286H341.4615V91.7143H378.3846V36.4286ZM396.8462 110.143H323V18H396.8462V110.143Z"
              fill="currentColor"
            />
            <path
              opacity="0.7"
              d="M415 18H433.4615V110.143H415V18ZM433.4615 18H470.3846V36.4286H433.4615V18ZM470.3846 36.4286H488.8462V91.7143H470.3846V36.4286ZM433.4615 91.7143H470.3846V110.143H433.4615V91.7143Z"
              fill="currentColor"
            />
          </g>
        </g>
      </g>
      <defs>
        <mask id={mask} style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="720" height="129">
          <rect width="720" height="129" fill={`url(#${maskGradient})`} />
        </mask>
        <linearGradient id={maskGradient} x1="360" y1="68" x2="360" y2="129" gradientUnits="userSpaceOnUse">
          <stop stop-color="white" stop-opacity="0.7" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
