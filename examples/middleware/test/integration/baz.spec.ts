import * as request from "supertest";
import server from "../../src/server";
import * as assert from "assert";

describe("baz", async() => {
    it("Should return 200 with no headers", async() => {
        try {
            const response =  await request(server.listener)
                .get("/baz/")
                .expect(200);
            assert.equal(response.text, "baz");
            ;
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
});
describe("baz/secure", async() => {
    it("should return 401 without headers", async () => {
        try {
            const response =  await request(server.listener)
                    .get("/baz/secure")
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
                    .get("/baz/secure")
                    .set("token", "a")
                    .send()
                    .expect(200);
                ;
            assert.equal(response.text, "baz");
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
