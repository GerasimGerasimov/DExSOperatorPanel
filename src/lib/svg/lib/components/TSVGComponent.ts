import { TSVGComponentInitialArgs} from "./svgCompFactory";

export class TSVGComponentArg {
    value: string = '';
    valid: boolean = false;
}

export class TSVGComponent {
    protected tag: string = '';
    protected SVGconteiner: any = undefined;//SVG контейнер (объект на общей структурной схеме имеющий data-id="")

    constructor (args: TSVGComponentInitialArgs) {
        this.SVGconteiner = args.element;
        this.tag = args.tag;
    }

    public get Tag(): string {
        return this.tag;
    }

    public setState(arg: TSVGComponentArg): boolean { return false}

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){}
}

export function getTags(components: Array<TSVGComponent>): Array<string> {
    const res:Array<string> = []
    components.forEach((item: TSVGComponent)=>{
      res.push(item.Tag);
    })
    return res;
  }

interface IDataSource
  {
      (tag: string, properties: Array<string>): any;
  };
  
export function drawComponents(components: Array<TSVGComponent>, getData: IDataSource) {
  components.forEach((item: TSVGComponent) => {
    const {value, msu} = getData(item.Tag, ['value','msu']);
    let state: TSVGComponentArg = {
        value: `${value} ${msu}`,
        valid: true
      }
    item.setState(state)
    item.draw();
  })
}