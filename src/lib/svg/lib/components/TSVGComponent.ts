export default class TSVGComponent {
    public value: string = '';
    protected SVGconteiner: any = undefined;//SVG контейнер (объект на общей структурной схеме имеющий data-id="")

    constructor (svgElement: any, value: string) {
        this.SVGconteiner = svgElement;
        this.value = value;
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(value: string){}
}