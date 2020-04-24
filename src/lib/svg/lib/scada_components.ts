import {TSvgContents} from './svgcontent'

//компоненты на структурной схеме

export default class TSwitchClient {
    //Контейнеры
    private SVGconteiner: any = undefined;//SVG контейнер (объект на общей структурной схеме имеющий data-id="")

    private svgArray: TSvgContents = new TSvgContents();//массива SVG изображений с доступом по ключу
    private stageImgKey = {//ключи на SVG изображении из массива изображений с доступом по ключу
        On:     '', //ссылка path к SVG изображению Включённого выключателя
        Off:    '', //ссылка path к SVG изображению Отключённого выключателя
        NoLink: ''  //ссылка path к SVG изображению Нетзвестное состояние выключателя из-за отсутствия связи с сервером
    }
    private stage: string = '';
    //private state: any;  //текущее состояние (из stageData) выключателя
    //private _state: any; //предыдущее состояние (чтобы перерисовывать компонент только при изменении состония)

    //функция-отдаёт изображение по ключу из массива SVG-изображений.
	public getImage(key: string) {
        console.log('TSwitchClient.prototype.getImage', key);
        return this.svgArray.getImg(key);
    }
    
	//Отрисовка компонента в контейнере(если состояние изменилось)
    public draw(){
        console.warn('SwDataClientDraw',this.stage);
        var container = this.SVGconteiner;
        if (container === undefined) return;
        //1) подготовка нового SVG согласно состояния
        var content;
        switch (this.stage) {
            case 'ON':
                    content = this.getImage(this.stageImgKey.On);
                break;
            case 'OFF':
                    content = this.getImage(this.stageImgKey.Off);
                break;
            case 'NOLINK':
                    content = this.getImage(this.stageImgKey.NoLink);
                break;            
        }
        //2) разбираюсь с FO
        var fo: any = container.querySelector('foreignObject');
        if (fo === undefined) {
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
        if (svg !== undefined) {
            fo.removeChild(svg);
        }
        //теперь добавлю новый svg-элемент в FO
        //svg = content.querySelector('svg');
        fo.appendChild(content);
    }

}
