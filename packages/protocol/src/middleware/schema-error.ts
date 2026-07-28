import { HttpApiMiddleware } from "effect/unstable/httpapi"
import { InvalidRequestError } from "../errors"

export class SchemaErrorMiddleware extends HttpApiMiddleware.Service<SchemaErrorMiddleware>()(
  "@mod/HttpApiSchemaError",
  { error: InvalidRequestError },
) {}
