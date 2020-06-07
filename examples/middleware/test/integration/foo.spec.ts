import * as request from "supertest";
import server from "../../src/server";
import * as assert from "assert";

describe("foo", async() => {
    it("Should return 401 with no headers", async() => {
        try {
            const response =  await request(server.listener)
                .get("/foo/")
                .expect(401);
            assert(response, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Should return 200 with no headers", async() => {
        try {
            const response =  await request(server.listener)
                .get("/foo/")
                .set("token", "a")
                .send()
                .expect(200);
            assert(response, "foo");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});
describe("foo/{id}", async() => {
    it("should return 401 without headers", async () => {
        try {
            const response =  await request(server.listener)
                    .get("/foo/1")
                    .expect(401);
                ;
            } catch (err) {
                console.log(err);
                throw err;
            }
    });
    it("should return 200 with headers", async () => {
        try {
            const response =  await request(server.listener)
                    .get("/foo/1")
                    .set("token", "a")
                    .send()
                    .expect(200);
                ;
            assert.equal(response.text, "foo: 1");
            } catch (err) {
                console.log(err);
                throw err;
            }
    });
    it("should return 400 when id is not a number", async () => {
        try {
            const response =  await request(server.listener)
                    .get("/foo/dkslfjdslf")
                    .set("token", "a")
                    .send()
                    .expect(400);
                ;
            assert.equal(response.body.message, "id must be a number");
            } catch (err) {
                console.log(err);
                throw err;
            }
    });
});
