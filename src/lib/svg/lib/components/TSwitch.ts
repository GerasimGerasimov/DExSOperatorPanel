import {TSvgContents} from '../svgcontent'
import {TSVGComponent, TSVGComponentArg}  from './TSVGComponent'
import { svgContents } from '../../svgloadimages';
import { TSVGComponentInitialArgs } from './svgCompFactory';
import { randomStringAsBase64Url } from '../../../util/cryputils';
//TODO менять stege в зависимости от входящего value
//компоненты на структурной схеме

export default class TSwitch extends TSVGComponent{

    private svgArray: TSvgContents = svgContents;//массива SVG изображений с доступом по ключу
    //private images: Map<string, any> = new Map();
    private stage: string | undefined = undefined;
    private prevStage: string | undefined = undefined;
 
    constructor (args: TSVGComponentInitialArgs) {
        super(args);
        /*
        this.svgArray.Contents.forEach ((value, key) => {
            const newClassName: string = randomStringAsBase64Url(4);
            const image = this.svgArray.renameCSS(newClassName, value);
            this.images.set(key, image)
            console.log(this.tag, ' : ',key, ':', newClassName)
        })
        */
    }

    public setState(arg:TSVGComponentArg): boolean {
        if (!arg.value) {
            this.stage = undefined;
        } else {
            this.stage = (arg.value.trim() === '1')? 'ON':'OFF'
        }
        return true;
    }

    //функция-отдаёт изображение по ключу из массива SVG-изображений.
	private getImage(key: string): any {
        return this.svgArray.getImg(key);
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
        var box: any;//DOMRect;
        if (fo === null) {
            //если FO ещё не встроен, то создать и встроить
            //узнаю размеры контейнера
            var rect: any  = container.querySelector('rect');
            box = rect.getBBox();
            //Создаю FO
            fo = document.createElementNS('http://www.w3.org/2000/svg','foreignObject');
            //Устанавливаю аттрибуты размеров FO
            fo.setAttribute('x', box.x);
            fo.setAttribute('y', box.y);
            fo.setAttribute('width', box.width);
            fo.setAttribute('height', box.height);
            //добавляю FO к контеннеру
            container.appendChild(fo);
            console.log(this.tag,' : ', this.stage, container.id, box);
        }
        //3) если в FO уже вставлен SVG то надо его удалить и заменить новым
        var svg: any = fo.querySelector('svg');
        if (svg !== null) {
            fo.removeChild(svg);
        }
        //теперь добавлю новый svg-элемент в FO если content не undefined)
        if (content) {
            fo.appendChild(content);
        }
    }

}
