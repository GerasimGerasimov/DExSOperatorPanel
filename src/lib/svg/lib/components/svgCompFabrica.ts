import TSVGComponent from "./TSVGComponent";
import TText from "./TText";
import TSwitch from "./TSwitch";

export class TSVGComponentArgs {
    element: any;
    value: any;
    options?: any
}

export function createSVGComponent (model: string, args: TSVGComponentArgs): TSVGComponent | undefined {
        const models: {[index: string]: any} = {
            'text'  : () => {return new TText(args.element, args.value)},
            'TSwitch': () => {return new TSwitch(args.element, args.value)},
            'default': () => {
                console.log(`${model} not found`)
                return undefined;
            }
        }
        return (models[model] || models['default'])()
}