import {TSVGComponent} from "./TSVGComponent";
import TText from "./TText";
import TSwitch from "./TSwitch";

export class TSVGComponentInitialArgs {
    model: string = '';
    element: any;
    tag: any;
    fraction?: number;
}

export function createSVGComponent (args: TSVGComponentInitialArgs): TSVGComponent | undefined {
        const model: string = args.model || 'default';
        const models: {[index: string]: any} = {
            'text'  : () => {return new TText(args)},
            'TSwitch': () => {return new TSwitch(args)},
            'default': () => {
                console.log(`${model} not found`)
                return undefined;
            }
        }
        return (models[model] || models['default'])()
}