import {TSvgContents} from '../svgcontent'
import {TSVGComponent, TSVGComponentArg}  from './TSVGComponent'
import { svgContents } from '../../svgloadimages';
import { TSVGComponentInitialArgs } from './svgCompFactory';
//компоненты на структурной схеме

//связь между состоянием и подгружаемой картинкой
const stages: any = {
    ON : 'switchOn',
    OFF:'switchOff'
}

export default class TSwitch extends TSVGComponent{

    private svgArray: TSvgContents = svgContents;//массива SVG изображений с доступом по ключу
    private stage: string= '';
    private prevStage: string | undefined = undefined;
 
    constructor (args: TSVGComponentInitialArgs) {
        super(args);
    }

    public setState(arg:TSVGComponentArg): boolean {
        if (!arg.value) {
            this.stage = '';
        } else {
            this.stage = (arg.value.trim() === '1')? 'ON':'OFF'
        }
        return true;
    }

    //функция-отдаёт изображение по ключу из массива SVG-изображений.
	private async getImageByStage(): Promise<any | undefined> {
        return await this.svgArray.getImg(stages[this.stage]) || undefined;
    }

	//Отрисовка компонента в контейнере(если состояние изменилось)
    public async draw(){
        const container: any = this.SVGconteiner;
        if (container === undefined) return;
        //1) подготовка нового SVG согласно состояния
        var content: any = await this.getImageByStage();
        //2) разбираюсь с FO
        var fo: any = container.querySelector('image');
        var box: any;//DOMRect;
        if (fo === null) {
            //если FO ещё не встроен, то создать и встроить
            //узнаю размеры контейнера
            var rect: any  = container.querySelector('rect');
            box = rect.getBBox();
            //Создаю FO
            fo = document.createElementNS('http://www.w3.org/2000/svg','image');
            //Устанавливаю аттрибуты размеров FO
            fo.setAttribute('x', box.x);
            fo.setAttribute('y', box.y);
            fo.setAttribute('width', box.width);
            fo.setAttribute('height', box.height);
            fo.setAttribute('href', content);
            //добавляю FO к контеннеру
            container.appendChild(fo);
            console.log(this.tag,' : ', this.stage, container.id, box);
        } else {//уже есть image, тогда меняю только его xref
            fo.setAttribute('href', content)
        }
    }

}
