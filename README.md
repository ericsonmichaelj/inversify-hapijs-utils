# inversify-hapijs-utils

> Note: this project is still a work in progress and does not have any test coverage.

## Version Support

The version of inversify-hapijs-utils depends on which version of hapi you plan on using. Below lists the corresponding version of hapi used for each inversify-hapijs-utils version:

| inversify-hapijs-utils | @hapi/hapi | hapi
| ------ | ------ | ------ | 
|  [0.0.x](https://www.npmjs.com/package/inversify-hapijs-utils/v/0.0.5) | n/a | ^16.6.2
| [1.x.x](https://www.npmjs.com/package/inversify-hapijs-utils/v/1.0.2)  | n/a | ^17.8.5
| [2.x.x](https://www.npmjs.com/package/inversify-hapijs-utils/v/2.0.1) | ^18.4.1 | n/a
| [3.x.x](https://www.npmjs.com/package/inversify-hapijs-utils/v/3.0.0) | ^19.1.1 | n/a 

## Installation
You can install `inversify-hapijs-utils` using npm:

```
$ npm install inversify inversify-hapijs-utils reflect-metadata --save
```

The `inversify-hapijs-utils` type definitions are included in the npm module and require TypeScript 2.0.
Please refer to the [InversifyJS documentation](https://github.com/inversify/InversifyJS#installation) to learn more about the installation process.

## The Basics

### Step 1: Decorate your controllers
To use a class as a "controller" for your hapijs app, simply add the `@Controller` decorator to the class. Similarly, decorate methods of the class to serve as request handlers. 

The following example will declare a controller that responds to `GET /foo'.

```ts
import { Controller, Get, interfaces } from 'inversify-hapijs-utils';

@injectable()
@Controller('/foo')
export class FooController implements interfaces.Controller {
    
    @Get('/')
    private index(): string {
        return "foo"
    }
}
```

> Note: The controller should not use the hapijs reply method to control output, but rather it should return the result directly. Any errors should return a Boom error.

### Step 2: Create TYPE definition for controller 

The controller also needs to use constant types. Use `Symbol.for("Controller")` to register it as a controller.

```ts
const TYPE = {
    Controller: Symbol.for("Controller")
}
```


### Step 3: Configure container and server
Configure the inversify container in your composition root as usual. You must also import reflect-metadata

Then, pass the container to the InversifyHapiServer constructor. This will allow it to register all controllers and their dependencies from your container and attach them to the hapi app.
Then just call server.build() to prepare your app.

In order for the InversifyHapiServer to find your controllers, you must bind them to the `TYPE.Controller` service identifier and tag the binding with the controller's name.
The `Controller` interface exported by inversify-hapijs-utils is empty and solely for convenience, so feel free to implement your own if you want.

```ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { interfaces, InversifyHapiServer, TYPE } from 'inversify-hapijs-utils';

// set up container
let container = new Container();

// note that you *must* bind your controllers to Controller 
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed('FooController');
container.bind<FooService>('FooService').to(FooService);

// create server
let server = new InversifyHapiServer(container);

server
    .build()
    .start(
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    );
```

## InversifyHapiServer
A wrapper for a hapijs Application.

### `.setConfig(configFn)`
Optional - exposes the hapijs application object for convenient loading of server-level middleware.

```ts
import * as morgan from 'morgan';
// ...
let server = new InversifyHapiServer(container);
server.setConfig((app) => {
    app.connection({port: 8080});
});
```

### `.build()`
Attaches all registered controllers and middleware to the hapijs application. Returns the application instance.

```ts
// ...
let server = new InversifyHapiServer(container);
server
    .setConfig(configFn)
    .build()
    .start(err => {});
```

## Decorators

### `@Controller(path, [middleware, ...])`

Registers the decorated class as a controller with a root path, and optionally registers any global middleware for this controller.

### `@Method(method, path, [middleware, ...])`

Registers the decorated controller method as a request handler for a particular path and method, where the method name is a valid hapijs routing method.

### `@SHORTCUT(path, [middleware, ...])`

Shortcut decorators which are simply wrappers for `@Method`. Right now these include `@Get`, `@Post`, `@Put`, `@Patch`, `@Head`, `@Delete`, and `@Options`. For anything more obscure, use `@Method` (Or make a PR :smile:).

## Middleware
Middleware can be either an instance of `RequestHandler` or an InversifyJS service identifier. This is attached as a route 'pre' method. To stop processing you will need to return a Boom error or a javascript Error.

The simplest way to use middleware is to define a `RequestHandler` instance and pass that handler as decorator parameter.

```ts
// ...
import { ReplyNoContinue } from "hapi";
import * as Boom from "boom";

const loggingHandler = (req: Request, reply: ReplyNoContinue) => {
  console.log(req);
  return reply();
};

const securityHandler = (req: Request, reply: ReplyNoContinue) => {
  // Return a Boom (or any Error) if you want processing to stop
  if (!req.headers['token']) {
      return reply(Boom.unauthorized('No session id in request header'));
  }

  return reply();
};

@Controller('/foo', loggingHandler, securityHandler)
@injectable()
export class FooController {
    
    @Get('/', loggingHandler)
    private index(req: Request): string {
        return 'foo'
    }
}
```

But if you wish to take full advantage of InversifyJS you can bind the same handler to your IOC container and pass the handler's service identifier to decorators.

```ts
// ...
import { TYPES } from 'types';
// ...
const loggingHandler = (req: Request, reply: ReplyNoContinue) => {
  console.log(req);
  return reply();
};
container.bind<RequestHandler>(TYPES.LoggingMiddleware).toConstantValue(loggingHandler);
// ...
@Controller('/foo', TYPES.LoggingMiddleware)
@injectable()
export class FooController implements interfaces.Controller {
   
    @Get('/', TYPES.LoggingMiddleware)
    private index(req: Request): string {
        return 'foo'
    }
}
```

## Error Handling
HapiJs supports Boom objects.

```ts
// ...
const TYPES = {
  Controller: Symbol.for("Controller"),
  FooService: "FooService",
  loggingMiddleware: Symbol.for("loggingMiddleware")
};
// ...
import { Request } from "hapi";
import { injectable, inject } from "inversify";
import * as Boom from "boom";

@Controller('/foo', TYPES.LoggingMiddleware)
@injectable()
export class FooController implements interfaces.Controller {
    
    constructor( @inject('FooService') private fooService: FooService ) {}
    
    @Get('/{id}')
    private index(req: Request): string {
        if (!req.params.id) {
            return Boom.badRequest('id is required');
        }
        return this.fooService.get(req.query.id);
    }
}
```

## Support and Contributing

If you have any questions or issues using inversify-hapijs-utils please post your issues [here](https://github.com/ericsonmichaelj/inversify-hapijs-utils/issues):

If you want to contribute, create a PR in the [repository](https://github.com/ericsonmichaelj/inversify-hapijs-utils)
