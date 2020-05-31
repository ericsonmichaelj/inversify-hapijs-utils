import { Controller, Get, interfaces } from "inversify-hapijs-utils";
import { injectable } from "inversify";
import TYPES from "../constants/type";

@injectable()
@Controller("/bar", TYPES.securityMiddleware)
export class BarController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "bar";
    }
}
