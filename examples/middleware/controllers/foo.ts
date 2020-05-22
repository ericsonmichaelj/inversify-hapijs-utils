import { Controller, Get, interfaces } from "inversify-hapijs-utils";
import { loggingHandler, securityHandler } from "../middleware";
import { injectable } from "inversify";

@injectable()
@Controller("/foo", loggingHandler, securityHandler)
export class FooController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "foo";
    }
}
