import { Controller, Get, interfaces } from "inversify-hapijs-utils";

@Controller("/foo")
export class FooController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "foo";
    }
}
