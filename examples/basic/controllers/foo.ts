import { Controller, Get, interfaces } from 'inversify-hapijs-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'hapi';
 
@Controller('/foo')
@injectable()
export class FooController implements interfaces.Controller {
    
    
    @Get('/')
    private index(): string {
        return 'foo'
    }
}