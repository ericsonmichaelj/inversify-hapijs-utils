import { Controller, Get, interfaces } from "inversify-hapijs-utils";
import { injectable } from "inversify";

@injectable()
@Controller("/foo")
export class FooController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "foo";
    }
}
