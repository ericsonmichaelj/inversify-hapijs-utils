
import "mocha";
import "reflect-metadata";
import * as request from "supertest";
import * as assert from "assert";
import { promisify } from "util";
import { InversifyHapiServer,
    Controller,
    interfaces,
    TYPE,
    Get,
} from "../src";
import { injectable } from "inversify";
import { Container } from "inversify";
import * as Boom from "@hapi/boom";

export const securityHandler = (req: Request) => {
    // Return a Boom (or any Error) if you want processing to stop
    if (!req.headers["token"]) {
        return Boom.unauthorized("No sessionsession id in request header");
    }
    return null;
  };

@Controller("/", securityHandler)
@injectable()
class FooController implements interfaces.Controller {
    @Get("/foo")
    private index(): string {
        return "foo";
    }
    @Get("/async")
    private async async(): Promise<string> {
        const delay = promisify(setTimeout);
        await delay(1);
        return "foo";
    }
    @Get("/nullAsync")
    private async nullAsync(): Promise<void> {
        const delay = promisify(setTimeout);
        return delay(1);
    }
    @Get("/thowAsync")
    private async throwAsync(): Promise<void> {
        const delay = promisify(setTimeout);
        delay(1);
        throw new Error("Async");
    }
    @Get({ path: "/path"})
    private path(){
        return "path";
    }
    @Get("/null")
    private null(){
        console.log("nothing to do");
    }
}



/// Server
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
let server = new InversifyHapiServer(container, { port: 8080 });
server.setConfig((app) => {
    app.cache({segment: "foo", expiresIn: 60 * 60 * 1000 });
});


/// Tests
describe("hapi server with config", async() => {
    const serverInstance = await server.build();
    it("Should return 401 without headers", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .get("/foo")
                .expect(401);
            assert.equal(response.body.message, "No sessionsession id in request header");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 with headers", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .get("/foo")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should work with async methods", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .get("/async")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "foo");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should have a status of 204 with async methods that return undefined", async() => {
        try {
           await request(serverInstance.listener)
                .get("/nullAsync")
                .set("token", "a")
                .send()
                .expect(204);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should have a status of 500 with async methods that return undefined", async() => {
        try {
           await request(serverInstance.listener)
                .get("/thowAsync")
                .set("token", "a")
                .send()
                .expect(500);
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should have a status of 200 using a path object", async() => {
        try {
           const response = await request(serverInstance.listener)
                .get("/path")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "path");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should have a status of 200 if do not return anything", async() => {
        try {
           const response = await request(serverInstance.listener)
                .get("/null")
                .set("token", "a")
                .send();
            assert.ok(response.status === 200 || response.status === 204 );
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});
