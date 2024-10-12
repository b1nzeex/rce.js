export default class Helper {
    static comparePopulation(oldList: string[], newList: string[]): {
        joined: string[];
        left: string[];
    };
    static cleanOutput(output: string, json?: boolean, rawHostname?: boolean): any;
}
