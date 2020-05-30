import "reflect-metadata";
import { Container } from "inversify";
import { Server } from "hapi";
import { InversifyHapiServer, TYPE } from "inversify-hapijs-utils";
import { interfaces } from "inversify-hapijs-utils";
import { FooController } from "./controllers/foo";
// // set up container
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController")
console.log(TYPE.Controller);
console.log(container.getAll(TYPE.Controller));

// // create server
let server = new InversifyHapiServer(container);

const callback = (err: Error, app: any) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(app);

    // The logger is available as a decorated API
    app.logger().info("another way for accessing it");
    // // and through Hapi standard logging system
    app.log(["subsystem"], "third way for accessing it");

    // Start the server
    app.start((error: Error) => {
        if (error) {
            console.error(error);
            process.exit(1);
        }
    })
};

server.setConfig((app, fn) => {
  app.connection({port: 8080});
  app.register(require("hapi-pino"), fn);
});


const serverInstance = server
    .build(callback);
