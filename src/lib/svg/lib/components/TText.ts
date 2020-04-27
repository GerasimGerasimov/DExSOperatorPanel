import {TSVGComponent, TSVGComponentArg} from './TSVGComponent'

//компоненты на структурной схеме

export default class TText extends TSVGComponent{
    private value: string = '';
    constructor (svgElement: any, tag: string) {
        super(svgElement, tag);
    }

    public setState(arg:TSVGComponentArg){
        this.value = arg.value;
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){
        this.SVGconteiner.innerHTML = this.value;
    }
}
