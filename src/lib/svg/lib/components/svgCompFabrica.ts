import {TSVGComponent} from "./TSVGComponent";
import TText from "./TText";
import TSwitch from "./TSwitch";
import { TSVGTemplateElement } from "../svggroup";

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

export function createSVGComponents(elements: Array<TSVGTemplateElement>): Array<TSVGComponent> {
    const res:Array<TSVGComponent> = []
    //создать объекты
    elements.forEach((item: TSVGTemplateElement) => {
      const arg: TSVGComponentInitialArgs = {
        element: item.element,
        ...item.attr
      }
      const o: TSVGComponent | undefined = createSVGComponent(arg);
      if (o) res.push(o);
    });
    return res;
  }