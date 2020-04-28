import {TSVGComponent, TSVGComponentArg} from './TSVGComponent'
import { TSVGComponentInitialArgs } from './svgCompFabrica';

//компоненты на структурной схеме

export default class TText extends TSVGComponent{
    private value: string = '';
    private fraction:number = 0;

    constructor (args: TSVGComponentInitialArgs) {
        super(args);
        this.fraction = Number(args.fraction) || 0;
    }

    public setState(arg:TSVGComponentArg){
        let a: Array<string> = arg.value.split(' ');
        this.value = `${Number(a[0] || 0).toFixed(this.fraction)} ${a[1] || ''}`;
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){
        this.SVGconteiner.innerHTML = this.value;
    }
}
