import {TSVGComponent, TSVGComponentArg} from './TSVGComponent'
import { TSVGComponentInitialArgs } from './svgCompFactory';

//компоненты на структурной схеме
const DEFAULT_TEXT_VALUE: Array<string> = ['.---', '-.--','--.-','---.']

export default class TText extends TSVGComponent{
    private value: string = '';
    private fraction:number = 0;
    private defaultPosition: number = 0;
    private predState: string = '';

    constructor (args: TSVGComponentInitialArgs) {
        super(args);
        this.fraction = Number(args.fraction) || 0;
    }

    public setState(arg:TSVGComponentArg): boolean {
        if (arg.value) {
            let a: Array<string> = arg.value.split(' ');
            this.value = `${Number(a[0] || 0).toFixed(this.fraction)} ${a[1] || ''}`;
        } else {
            this.value = DEFAULT_TEXT_VALUE[this.defaultPosition++ & 3];
        }
        return true; //this.checkChanhes()
    }

    private checkChanhes(): boolean {
        const res: boolean = (this.value === this.predState);
        this.predState = this.value;
        return res;
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){
        this.SVGconteiner.innerHTML = this.value;
    }
}
