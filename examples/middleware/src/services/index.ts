import { injectable } from "inversify";
import { FooService } from "../interfaces";

@injectable()
export class FooServiceImpl implements FooService {
    public get(id: string) {
        return `foo: ${id}`;
    }
}