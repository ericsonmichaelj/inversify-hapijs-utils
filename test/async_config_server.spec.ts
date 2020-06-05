
import "mocha";
import "reflect-metadata";
import * as request from "supertest";
import * as assert from "assert";
import { InversifyHapiServer,
    Controller,
    interfaces,
    TYPE,
    Get,
} from "../src";
import { injectable } from "inversify";
import { Container } from "inversify";

@Controller("/foo")
@injectable()
class FooController implements interfaces.Controller {

    private getFoo(): string {
        return "foo";
    }

    @Get("/")
    private index(): string {
        return this.getFoo();
    }
}



/// Server
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
let server = new InversifyHapiServer(container);
server.setConfig((app, fn) => {
    app.connection({port: 8080});
    if (fn) {
        app.register(require("hapi-pino"), fn);
    } else {
        app.register(require("hapi-pino"));
    }
});

const callback = (err: Error, app: any) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    // The logger is available as a decorated API
    app.logger().info("another way for accessing it");
    // // and through Hapi standard logging system
    app.log(["subsystem"], "third way for accessing it");
};

/// Tests
describe("hapi server", async() => {
    const serverInstance = server.build(callback);
    it("Should return 200 for get", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .get("/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});
