import 'reflect-metadata';
import { Container } from 'inversify';
import { InversifyHapiServer } from 'inversify-hapijs-utils';
import TYPE from './constants/type'
import { interfaces } from 'inversify-hapijs-utils';
import { FooController } from './controllers/foo'
// // set up container
let container = new Container();
container.bind<interfaces.Controller>(TYPE.Controller).to(FooController).whenTargetNamed('FooController')
console.log(TYPE.Controller);
console.log(container.getAll(TYPE.Controller));

// // create server
let server = new InversifyHapiServer(container, {port: 8080});


const serverInstance = server
    .build()
    .start();
