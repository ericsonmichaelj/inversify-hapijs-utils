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
const src_1 = require("../src");
const inversify_1 = require("inversify");
const inversify_2 = require("inversify");
let FooController = class FooController {
    index() {
        return "foo";
    }
    post() {
        return "foo";
    }
    put() {
        return "foo";
    }
    patch() {
        return "foo";
    }
    delete() {
        return "foo";
    }
    options() {
        return "foo";
    }
};
__decorate([
    src_1.Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "index", null);
__decorate([
    src_1.Post("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "post", null);
__decorate([
    src_1.Put("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "put", null);
__decorate([
    src_1.Patch("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "patch", null);
__decorate([
    src_1.Delete("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "delete", null);
__decorate([
    src_1.Options("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], FooController.prototype, "options", null);
FooController = __decorate([
    src_1.Controller("/foo"),
    inversify_1.injectable()
], FooController);
let container = new inversify_2.Container();
container.bind(src_1.TYPE.Controller).to(FooController).whenTargetNamed("FooController");
console.log(src_1.TYPE.Controller);
console.log(container.getAll(src_1.TYPE.Controller));
let server = new src_1.InversifyHapiServer(container, { port: 8080, defaultRoot: "/test" });
describe("hapi server", () => __awaiter(this, void 0, void 0, function* () {
    const serverInstance = server.build();
    it("Should return 200 for get", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .get("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 for post", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .post("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 for put", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .put("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 for delete", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .delete("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 for options", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .options("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
    it("Should return 200 for patch", () => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield request(serverInstance.listener)
                .patch("/test/foo/")
                .expect(200);
            assert.equal(response.text, "foo");
            ;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }));
}));

//# sourceMappingURL=basic_server.spec.js.map
