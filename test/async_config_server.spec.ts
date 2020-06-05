
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
let server = new InversifyHapiServer(container, { port: 8080});
server.setConfig(async(app) => {
    await app.register({
        plugin: require("hapi-pino")
    });
});


/// Tests
describe("hapi server", async() => {
    const serverInstance = await server.build();
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
