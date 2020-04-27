import {TSVGComponent} from "./TSVGComponent";
import TText from "./TText";
import TSwitch from "./TSwitch";

export class TSVGComponentInitialArgs {
    element: any;
    tag: any;
    options?: any
}

export function createSVGComponent (model: string, args: TSVGComponentInitialArgs): TSVGComponent | undefined {
        const models: {[index: string]: any} = {
            'text'  : () => {return new TText(args.element, args.tag)},
            'TSwitch': () => {return new TSwitch(args.element, args.tag)},
            'default': () => {
                console.log(`${model} not found`)
                return undefined;
            }
        }
        return (models[model] || models['default'])()
}