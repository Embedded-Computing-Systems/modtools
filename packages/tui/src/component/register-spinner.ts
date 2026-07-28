import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registerModSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
