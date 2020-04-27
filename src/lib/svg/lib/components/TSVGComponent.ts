export class TSVGComponentArg {
    value: string = '';
    valid: boolean = false;
}

export class TSVGComponent {
    protected tag: string = '';
    protected SVGconteiner: any = undefined;//SVG контейнер (объект на общей структурной схеме имеющий data-id="")

    constructor (svgElement: any, tag: string) {
        this.SVGconteiner = svgElement;
        this.tag = tag;
    }

    public get Tag(): string {
        return this.tag;
    }

    public setState(arg: TSVGComponentArg){}

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){}
}