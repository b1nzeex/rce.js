import { type IServer } from "../types";
import type RCEManager from "../manager";
export default class ResponseHandler {
    static handle(manager: RCEManager, server: IServer, message: string): void;
}
