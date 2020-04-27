import {TSvgContents} from '../svgcontent'
import {TSVGComponent, TSVGComponentArg}  from './TSVGComponent'
import { svgContents } from '../../svgloadimages';
//TODO менять stege в зависимости от входящего value
//компоненты на структурной схеме

export default class TSwitch extends TSVGComponent{

    private svgArray: TSvgContents = svgContents;//массива SVG изображений с доступом по ключу
    private stage: string | undefined = undefined;
 
    constructor (svgElement: any, tag: string) {
        super(svgElement, tag);
    }

    public setState(arg:TSVGComponentArg) {
        if (arg.value === undefined) return this.stage = undefined;
        return this.stage = (arg.value)? 'ON':'OFF'
    }

    //функция-отдаёт изображение по ключу из массива SVG-изображений.
	private getImage(key: string): any {
        return this.svgArray!.getImg(key);
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){
        const container: any = this.SVGconteiner;
        if (container === undefined) return;
        //1) подготовка нового SVG согласно состояния
        var content: any;
        switch (this.stage) {
            case 'ON':
                    content = this.getImage('switchOn');
                break;
            case 'OFF':
                    content = this.getImage('switchOff');
                break;
            default:
                    content = undefined;
        }
        //2) разбираюсь с FO
        var fo: any = container.querySelector('foreignObject');
        if (fo === null) {
            //если FO ещё не встроен, то создать и встроить
            //узнаю размеры контейнера
            var box: DOMRect = container.querySelector('rect').getBBox();
            //Создаю FO
            fo = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
            //Устанавливаю аттрибуты размеров FO
            fo.setAttribute('x', box.x);
            fo.setAttribute('y', box.y);
            fo.setAttribute('width', box.width);
            fo.setAttribute('height', box.height);
            //добавляю FO к контеннеру
            container.appendChild(fo);
        }
        //3) если в FO уже вставлен SVG то надо его удалить и заменить новым
        var svg: any = fo.querySelector('svg');
        if (svg !== null) {
            fo.removeChild(svg);
        }
        //теперь добавлю новый svg-элемент в FO если content не undefined)
        if (content)
            fo.appendChild(content);
    }

}
