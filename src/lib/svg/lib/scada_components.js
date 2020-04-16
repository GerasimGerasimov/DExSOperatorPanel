//компоненты на структурной схеме


//Потребитель данных
//начну с главного выключателя
//через JSON передаются данные инициализации
var TSwitchClient = function () {
    //Контейнеры
    this.SVGconteiner = null;//SVG контейнер (объект на общей структурной схеме имеющий data-id="")
    this.CnvConteiter = null//это (пока прямоугольная) область на Canvas куда отрисовывается Аватар.
                            //возможно придётся рисовать на Canvas а не на 
    //
    this.stageData = {//состояния объекта (ON, OFF, ERROR, NOLINK)
        datatag:     null,//данные состояния выключатля (включен ON/отключен OFF)
        serverState: null//состояние сервера (OnLine/NoLink(Error))
    }
    this.svgArray = null;//массива SVG изображений с доступом по ключу
    this.stageImgKey = {//ключи на SVG изображении из массива изображений с доступом по ключу
        On:     null, //ссылка на SVG изображение Включённого выключателя
        Off:    null, //ссылка на SVG изображение Отключённого выключателя
        Err:    null, //ссылка на SVG изображение Ошибочного состояния выключателя (ток двигателя есть, контакт состояния в отключенном положении)
        NoLink: null  //ссылка на SVG изображение выключателя состояние которого неизвестно из-за отсутствия связи с сервером
    }
    this.stage = '';
    var state;  //текущее состояние (из stageData) выключателя
    var _state; //предыдущее состояние (чтобы перерисовывать компонент только при изменении состония)
}

	//Отрисовка компонента в контейнере(если состояние изменилось)
	TSwitchClient.prototype.draw = function () {
        console.log('TSwitchClient.prototype.draw',this.stage);
        SwDataClientDraw();
    }

    //функция-отдаёт изображение по ключу из массива SVG-изображений.
	TSwitchClient.prototype.getImage = function (key) {
        console.log('TSwitchClient.prototype.getImage', key);
        return this.svgArray.getImg(key);
    }

    //функция-подписчик на изменение данных.
    //Вызывается источником данных. Передаёт новое состояние.
	TSwitchClient.prototype.subcribe = function (stage) {
        console.log('TSwitchClient.prototype.subcriber', stage);
        this.stage = stage; 
        this.draw();
    }

    //инициализация
	TSwitchClient.prototype.init = function (ctx) {
		console.log('TSwitchClient.prototype.subcriber');
    }
    
//Источник данных
var TSwitchDataSource = function () {
    this.subcribers = [];//список подписчиков
    this.stage  = 'OFF'; //состояния объекта (ON, OFF, ERROR)
    this._stage = 'OFF'; //предыдущее состояние
   }

    TSwitchDataSource.prototype.setStage = function (stage) {
        console.log('TSwitchDataSource.prototype.setStage');
        this.stage = stage;
        if (this.stage != this._stage) {//состояние изменилось!
            this.sendStageToSubscribers();//делаю рассылку
            this._stage = this.stage;//уравниваю состояния
        }
    }

    //добавить подписчика
    //передаю функцию которую требуется вызвать
    TSwitchDataSource.prototype.addSubscriber = function (self, func) {
        console.log('TSwitchDataSource.prototype.addSubscribe');
        this.subcribers.push({self, func});
    }

    //Рассылка изменений подписчикам
    TSwitchDataSource.prototype.sendStageToSubscribers = function () {
        console.log('TSwitchDataSource.prototype.sendStageToSubscribers');
        var i = this.subcribers.length;
        while (i !=0 ){
            i--;
            //try {
              this.subcribers[i].func.call(this.subcribers[i].self, this.stage);
            //}
            //catch(e) {
              //при рассылке подписки, могут возникнуть исключения
            //}
        }
    }