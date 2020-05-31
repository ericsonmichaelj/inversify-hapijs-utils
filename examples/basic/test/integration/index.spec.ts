import * as request from "supertest";
import serverPromise from "../../src/server";
import * as assert from "assert";

describe("server", async() => {
    const serverInstance = await serverPromise();
    it("Should return 200", async() => {
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
