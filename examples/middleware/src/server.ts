import "reflect-metadata";
import { Container } from "inversify";
import { InversifyHapiServer, TYPE } from "inversify-hapijs-utils";
import CONSTANTS from "./constants/type";
import { interfaces } from "inversify-hapijs-utils";
import { FooController, BarController, BazController } from "./controllers";
import { loggingHandler, securityHandler } from "./middleware";
import { FooService } from "./interfaces";
import { FooServiceImpl } from "./services";
// // set up container
let container = new Container();
container.bind<FooService>(CONSTANTS.FooService).to(FooServiceImpl);

container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed("FooController");
container.bind<interfaces.Controller>(TYPE.Controller).to(BarController).whenTargetNamed("BarController");
container.bind<interfaces.Controller>(TYPE.Controller).to(BazController).whenTargetNamed("BazController");

container.bind(CONSTANTS.loggingMiddleware).toConstantValue(loggingHandler);

container.bind(CONSTANTS.securityMiddleware).toConstantValue(securityHandler);


// // create server
let server = new InversifyHapiServer(container, {port: 8080});
console.log(TYPE.Controller);
console.log(container.getAll(TYPE.Controller));

export default server.build();


