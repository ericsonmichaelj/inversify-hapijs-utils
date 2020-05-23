import "reflect-metadata";
import { Container } from "inversify";
import { InversifyHapiServer } from "inversify-hapijs-utils";
import TYPE from "./constants/type";
import { interfaces } from "inversify-hapijs-utils";
import { FooController, BarController, BazController } from "./controllers";
import { loggingHandler } from "./middleware";
import { FooService } from "./interfaces";
import { FooServiceImpl } from "./services";
// // set up container
let container = new Container();
container.bind<FooService>(TYPE.FooService).to(FooServiceImpl);

container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
container.bind<interfaces.Controller>(TYPE.Controller).to(BarController).whenTargetNamed("BarController");
container.bind<interfaces.Controller>(TYPE.Controller).to(BazController).whenTargetNamed("BazController");

container.bind(TYPE.loggingMiddleware).toConstantValue(loggingHandler);

// // create server
let server = new InversifyHapiServer(container, {port: 8080});

server
    .build()
    .start();