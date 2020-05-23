import { Controller, Get, interfaces } from "inversify-hapijs-utils";
// import { loggingHandler, securityHandler } from "../middleware";
import { injectable } from "inversify";
import TYPES from "../constants/type";

@injectable()
@Controller("/baz")
export class BazController implements interfaces.Controller {
    @Get("/logging", TYPES.loggingMiddleware)
    public indexLogged(): string {
        return "baz";
    }
    @Get("/")
    public index(): string {
        return "baz";
    }
}
