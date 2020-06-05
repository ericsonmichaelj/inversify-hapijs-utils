
import "mocha";
import "reflect-metadata";
import * as request from "supertest";
import * as assert from "assert";
import { InversifyHapiServer,
    Controller,
    interfaces,
    TYPE,
    Get,
    Post,
    Put,
    Delete,
    Options,

    Patch
} from "../src";
import { injectable } from "inversify";
import { Container } from "inversify";

@Controller("/foo")
@injectable()
class FooController implements interfaces.Controller {
    @Get("/")
    private index(): string {
        return "foo";
    }
    @Post("/")
    private post(): string {
        return "foo";
    }
    @Put("/")
    private put(): string {
        return "foo";
    }
    @Patch("/")
    private patch(): string {
        return "foo";
    }
    @Delete("/")
    private delete(): string {
        return "foo";
    }
    @Options("/")
    private options(): string {
        return "foo";
    }
}



/// Server
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
console.log(TYPE.Controller);
console.log(container.getAll(TYPE.Controller));
let server = new InversifyHapiServer(container, { defaultRoot: "/test" });


/// Tests
describe("hapi server", async() => {
    const serverInstance = await server.build();
    it("Should return 200 for get", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .get("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 for post", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .post("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 for put", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .put("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 for delete", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .delete("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 for options", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .options("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 for patch", async() => {
        try {
           const response =  await request(serverInstance.listener)
                .patch("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });

});
