import { Controller, Get, interfaces } from "inversify-hapijs-utils";
import { loggingHandler, securityHandler } from "../middleware";
import { injectable } from "inversify";
import TYPES from "../constants/type";

@injectable()
@Controller("/bar", TYPES.loggingMiddleware)
export class BarController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "bar";
    }
}
