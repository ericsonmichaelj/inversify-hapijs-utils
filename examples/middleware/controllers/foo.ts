import { Controller, Get, interfaces } from "inversify-hapijs-utils";
import { loggingHandler, securityHandler } from "../middleware";
import { Request } from "hapi";
import { FooService } from "../interfaces";
import { injectable, inject } from "inversify";
import * as Boom from "boom";

@Controller("/foo", loggingHandler, securityHandler)
@injectable()
export class FooController implements interfaces.Controller {
    constructor(@inject("FooService") private fooService: FooService ) {}
    @Get("/")
    public index(): string {
        return "foo";
    }
    @Get("/{id}")
    public id(req: Request): any {
        // tslint:disable-next-line: radix
        if (isNaN(parseInt(req.params.id))) {
            return Boom.badRequest("id must be a number");
        }
        return this.fooService.get(req.params.id);
    }
}
