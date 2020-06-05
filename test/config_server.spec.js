"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require("reflect-metadata");
const request = require("supertest");
const assert = require("assert");
const util_1 = require("util");
const src_1 = require("../src");
const inversify_1 = require("inversify");
const inversify_2 = require("inversify");
const Boom = require("boom");
exports.securityHandler = (req) => {
    if (!req.headers["token"]) {
        return Boom.unauthorized("No sessionsession id in request header");
    }
    return null;
};
let FooController = class FooController {
    index() {
        return "foo";
    }
    async() {
        return __awaiter(this, void 0, void 0, function* () {
            const delay = util_1.promisify(setTimeout);
            yield delay(1);
            return "foo";
        });
    }
    nullAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const delay = util_1.promisify(setTimeout);
            return delay(1);
        });
    }
    throwAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const delay = util_1.promisify(setTimeout);
            delay(1);
            throw new Error("Async");
        });
    }
    path() {
        return "path";
    }
    null() {
        console.log("nothing to do");
    }
};
__decorate([
    src_1.Get("/foo"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "index", null);
__decorate([
    src_1.Get("/async"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FooController.prototype, "async", null);
__decorate([
    src_1.Get("/nullAsync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FooController.prototype, "nullAsync", null);
__decorate([
    src_1.Get("/thowAsync"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FooController.prototype, "throwAsync", null);
__decorate([
    src_1.Get({ path: "/path" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FooController.prototype, "path", null);
__decorate([
    src_1.Get("/null"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FooController.prototype, "null", null);
FooController = __decorate([
    src_1.Controller("/", exports.securityHandler),
    inversify_1.injectable()
], FooController);
let container = new inversify_2.Container();
container.bind(src_1.TYPE.Controller).to(FooController).whenTargetNamed("FooController");
let server = new src_1.InversifyHapiServer(container, { port: 8080 });
server.setConfig((app) => {
    app.cache({ segment: "foo", expiresIn: 60 * 60 * 1000 });
});
describe("hapi server with config", () => __awaiter(this, void 0, void 0, function* () {
    const serverInstance = yield server.build();
    it("Should return 401 without headers", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .get("/foo")
                .expect(401);
            assert.equal(response.body.message, "No sessionsession id in request header");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 with headers", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .get("/foo")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should work with async methods", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .get("/async")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "foo");
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should have a status of 204 with async methods that return undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield request(serverInstance.listener)
                .get("/nullAsync")
                .set("token", "a")
                .send()
                .expect(204);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should have a status of 500 with async methods that return undefined", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield request(serverInstance.listener)
                .get("/thowAsync")
                .set("token", "a")
                .send()
                .expect(500);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should have a status of 200 using a path object", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .get("/path")
                .set("token", "a")
                .send()
                .expect(200);
            assert.equal(response.text, "path");
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should have a status of 200 if do not return anything", () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield request(serverInstance.listener)
                .get("/null")
                .set("token", "a")
                .send()
                .expect(200);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
}));

//# sourceMappingURL=config_server.spec.js.map
