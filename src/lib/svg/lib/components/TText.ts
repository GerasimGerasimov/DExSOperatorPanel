import TSVGComponent from './TSVGComponent'

//компоненты на структурной схеме

export default class TText extends TSVGComponent{

    constructor (svgElement: any, value: string) {
        super(svgElement, value);
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(value: string){
        this.SVGconteiner.innerHTML = value;
    }
}
