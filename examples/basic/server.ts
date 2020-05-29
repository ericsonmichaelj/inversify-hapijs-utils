import "reflect-metadata";
import { Container } from "inversify";
import { InversifyHapiServer, TYPE } from "inversify-hapijs-utils";
import { interfaces } from "inversify-hapijs-utils";
import { FooController } from "./controllers/foo";
import { inherits } from "util";
// // set up container
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
console.log(TYPE.Controller);
console.log(container.getAll(TYPE.Controller));

// // create server
let server = new InversifyHapiServer(container, {port: 8080});

server.setConfig(async(app) => {
    await app.register({
        plugin: require("hapi-pino")
    });
});

const init = async() => {
    const serverInstance = await server.build();
    serverInstance.start();
}


init();
