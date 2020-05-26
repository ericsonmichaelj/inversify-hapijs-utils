import { Controller, Get, interfaces } from "inversify-hapijs-utils";
// import { loggingHandler, securityHandler } from "../middleware";
import { injectable } from "inversify";
import CONSTANTS from "../constants";

@injectable()
@Controller("/bar", CONSTANTS.loggingMiddleware)
export class BarController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "bar";
    }
}
