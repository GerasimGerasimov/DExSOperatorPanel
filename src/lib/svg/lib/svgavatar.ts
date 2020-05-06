export class TSvgTransformList{
  	name: string//название трансформации
	param: Array<string> = [];//массив параметров трансформации (по name я узнаю назначение параметра )

	constructor (name: string) {
		this.name = name
	}
}

class TPoint {
	x: number = 0;
	y:  number = 0;
}

class TModePoint {
	mode: string = '';
	x: number = 0;
	y:  number = 0;
}

class TPathModePoint extends TModePoint{
	rx: number = 0;
	ry: number = 0;
	x_axis_rotation: number = 0;
	large_arc_flag: number = 0;
	sweep_flag: number = 0;
}


class TBoundRect {
	Left   : number = 0;
	Top    : number = 0;
	Width  : number = 0;
	Height : number = 0;
}

class TTransformation {
	dX: number = 0; //смещение по Х
	dY: number = 0; //смещение по Y
	angle: number = 0;//угол поворота осей
	sX: number = 1; //масштаб по Х
	sY: number = 1; //масштаб по Y			
}
//ASvgTransf//////////////////////////////////////////////////////////////////////////
//получает строку трансформаций, вида:
//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
//на выходе рассчитанные значения трансформаций:
//	dX, dY	- 	смещение
//	angle	-	угол поворота
//	sX, sY	-	масштаб по осям
export class ASvgTransf {
	private _trString: string = '';//строка трансформаций
	private arr: Array<TSvgTransformList> = [];//это массив объектов трансформаций
	private t: TTransformation = {
		dX:		0, //смещение по Х
		dY:		0, //смещение по Y
		angle:	0,//угол поворота осей
		sX:		1, //масштаб по Х
		sY:		1 //масштаб по Y			
	}
	private aTrStrList: Array<string> = [];

	constructor (trString: string) {
		this._trString = trString;//строка трансформаций
	}

	getArr(): Array<TSvgTransformList> {
		return this.arr;
	}

	getT (): TTransformation {
		return this.t;
	}
	//чистит объект, готовя к новому использованию
	clear (){
		this.arr  = [];
		this.aTrStrList = [];
		this.t.dX = this.t.dY = this.t.angle = Number(0);
		this.t.sX = this.t.sX = Number(1);
	}

	//getSvgTransfStrArr - получает на вход строку с трансформациями вида:
	//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
	//а на выходе у него масив строк "translate(158.598,70.8661)","rotate(90)","translate(25.3701,-5.66929)"
	//который уже потом я буду парсить на предмет типа трансформации и её параметров
	getSvgTransfStrArr (s: string): Array<string> {
		const aTrs = ['translate','rotate','scale'];//массив ключевых слов трансформаций  (ещё есть matrix)
		var res: Array<string> = [];//тут будут строки трансформаций (потом их разделю на тип и параметры (которые в скобках))
		var j: number = aTrs.length;//я учитываю Три команды трансформации
		while (j !==0) {//найду вхождения каждой команды так как их может быть несколько
			j--;
			var target: string = aTrs[j]; // цель поиска
			var pos: number = -1;
			while ((pos = s.indexOf(target, pos + 1)) !== -1) {
				var ts = s.slice(pos, s.indexOf(')',pos+target.length)+1);//команды трансформации закрываются скобкой ")"
				res.push(ts);
			}
		}
		return res;
	}

	//getTransformation проходит по массиву трансформаций arr
	//и вычисляет итоговые значения трансформаций для графического элемента
	//на выходе:
	//	dX, dY	- 	смещение
	//	angle	-	угол поворота
	//	sX, sY	-	масштаб по осям
	getTransformation (): TTransformation {
		if (this._trString !== undefined) {
			this.aTrStrList = this.getSvgTransfStrArr(this._trString);//получу массив строк трансформаций
			this.getSvgTransfList(this.aTrStrList);
			var i = this.arr.length;
			while (i !==0) {
				i--;
				var o = this.arr[i];
				switch (o.name) {
					case 'translate':
						this.t.dX += Number(o.param[0]);//смещение по Х
						this.t.dY += Number(o.param[1]);//смещение по Y
						break;
					case 'rotate':
						this.t.angle += Number(o.param[0]);//поворот осей
						break;
					case 'scale':
						this.t.sX *= Number(o.param[0]);//смещение по Х
						this.t.sY *= Number(o.param[1]);//смещение по Y
						break;
				}				
			}
		}
		return this.t;
	}

	//getSvgTransfList получает sattr строки аттриботов вида translate(158.598,70.8661)
	//делает из них объект вида
	//name = translate (тип трансформации)
	//param = [158.598, 70.8661] //массив параметров трансформации
	getSvgTransfList (sattr: Array<string>){
		//теперь надо взять каждую строчку и выделить из неё название (тип) трансформации, и параметры трансформации
		//на выходе вернуть массив со списком объектов трансформации
		var i: number = sattr.length;
		this.arr = [];
		while (i !== 0) {
			i--;
			//получил строку вида "translate(158.598,70.8661)" или "rotate(90)"
			//и выделяю тип трансформации и все циферки используя разделители " ", ",","(",")"
			var s = sattr[i].split(/[, ()]/);	
			//console.warn(s);
			var t = new TSvgTransformList(s[0]);
			for (var j = 1; j < s.length; j++) {//покажу что получил console.warn(s[j]) 
				if (s[j] !== "") 
				t.param.push(s[j]);
			}
			//console.warn(t);
			this.arr.push(t);
		}
	//потом пройти это массив и "сложить" однотипные трансформации
	}
}

//получает список трансформаций родителя
//из строки такого типа transform="translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
//перечень трансформаций разделён пробелами (даже для красоты надо запретить себе исползовать пробелы в трансформациях)
function getSvgParentTransformation(parent: any): TTransformation{
	if (parent !== undefined) {
		var p: any = parent.getAttribute('transform');//поиск аттрибута transform, в s будет строка аттрибута
		if (p != null) {//у объекта есть родитель (элемент более высокго уровня)
			var aSvgTransf = new ASvgTransf(p);
			return aSvgTransf.getTransformation();//вернёт трансформацию
		}
	}
	const defaultTransformation: TTransformation = {
		dX:		0, //смещение по Х
		dY:		0, //смещение по Y
		angle:	0,//угол поворота осей
		sX:		1, //масштаб по Х
		sY:		1 //масштаб по Y			
	}
	//значение по умолчанию
	return defaultTransformation;
}

//преобразует массив точек МXY в координаты прямоугольника, куда эти точки вписаны
function path2BoundRect(a: Array<TModePoint>): TBoundRect {
	var maxX = 0.0;
	var maxY = 0.0;
	var x = 0.0;
	var y = 0.0;
	var i = a.length;
	while (i !==0) {
		i--;
		x = a[i].x;
		y = a[i].y;
		if (x >= maxX) maxX = x;
		if (y >= maxY) maxY = y;
	}
	var minX = maxX;
	var minY = maxY;
	i = a.length;
	while (i !==0) {
		i--;
		x = a[i].x;
		y = a[i].y;
		if (x <= minX) minX = x;
		if (y <= minY) minY = y;
	}
	const result: TBoundRect = {
		Left   : minX,
		Top    : minY,
		Width  : (maxX - minX) ,
		Height : (maxY - minY)
	}
	return result;
}

//функции для поворота координат точки на заданный угол
function deg2rad(degrees: number): number{
	return (Math.PI/180)*degrees;
}

function rotateXY(x: number, y: number, degrees: number): TPoint{
	const r = deg2rad(degrees);
	const mcr = Math.cos(r);
	const msr = Math.sin(r);
	const point:TPoint = {
		x: (x * mcr) - (y * msr),
		y: (x * msr) + (y * mcr)
	}
	return point;
}

//TFigure предок отображаемых на Canvas элементов
//передаю owner - владельца (svg объект)
//        t 	- трансформации координат и масштаба
export class TFigure {
	//draw - это прототип метода, который для всех потомков TCanvasSvgAvatar будет переписан OVERRIDE
	//но зато я потом пройдёсь быстро по массиву объектов-потомков от TCanvasSvgAvatar и используя метод draw
	//нарисую их на заданном canvas`e
	public owner: any;
	//координаты прямоугольника - Границы - с максимальными размерами Аватара
	//для быстрого отсева аватаров в которых не входит искомая точка (напр. координата клика мышью)
	public boundRect: TBoundRect = {Left:0, Top:0, Width : 0, Height: 0};

	constructor(owner: any, t: TTransformation) {
		this.owner = owner;
	}

	//отрисовка Аватара на заданном CANVASe
	draw (ctx: any) {}

	//отрисовка Границы Аватара на заданном CANVASe
	drawBound (ctx: any) {
		var _strokeStyle = ctx.strokeStyle;
		ctx.strokeStyle = 'red';//граница будет серая
		ctx.strokeRect(this.boundRect.Left,
							this.boundRect.Top,
								this.boundRect.Width,
									this.boundRect.Height);
		ctx.strokeStyle = _strokeStyle;//восстановлю текущее значение						
	}	

	//проверка, что указанные координаты находятся внутри контура Аватара
	inArea (x: number, y: number): boolean {
		return false;
	}

	//проверка, что указанные координаты находятся внутри Границы Аватара
	//передаётся координаты XY и "пятно" пикселов tolerance
	//          -------[---]-------
	//Left, Top -------[---]-------
	//			-------[---]-------
	//			-------------------
	//			------------------- Height, Width
	inBound (x: number, y: number, tolerance: number): boolean {
		const chkX: boolean = ((x+tolerance) >=this.boundRect.Left) && ((x-tolerance) <= (this.boundRect.Left + this.boundRect.Width));
		const chkY: boolean = ((y+tolerance) >=this.boundRect.Top ) && ((y-tolerance) <= (this.boundRect.Top  + this.boundRect.Height));
		return (chkX && chkY);
	}	
}

//Ellipse
export class TFigureEllipse extends TFigure  {
	//данные потомка
	private x: number;//  = Number(this.owner.getAttribute('cx'));
	private y: number;// = Number(this.owner.getAttribute('cy'));
	private cRadX: number;//  = Number(this.owner.getAttribute('rx'));
	private cRadY: number;//  = Number(this.owner.getAttribute('ry'));
	private cAngle: number;// = Number(t.angle);
	private p: TPoint;// = rotateXY(x,y,t.angle);
	private cLeft: number;// = p.x + t.dX;
	private cTop: number;//  = p.y + t.dY;

	constructor(owner: any, t: TTransformation) {
		super(owner, t)
		//данные потомка
		this.x  = Number(this.owner.getAttribute('cx'));
		this.y  = Number(this.owner.getAttribute('cy'));
		this.cRadX  = Number(this.owner.getAttribute('rx'));
		this.cRadY  = Number(this.owner.getAttribute('ry'));
		this.cAngle = Number(t.angle);
		this.p = rotateXY(this.x, this.y, t.angle);
		this.cLeft = this.p.x + t.dX;
		this.cTop  = this.p.y + t.dY;
		//заполнение Границы (прямоугольной области куда вписан элипс)
		this.boundRect = {Left:this.cLeft - this.cRadX,
							Top: this.cTop  - this.cRadY,
								Width: 2 * this.cRadX,
									Height: 2 * this.cRadY}	
	}

	public draw (ctx: any){
		ctx.beginPath();
			var x = this.cLeft;
			var y = this.cTop;
			var r = this.cRadX;
			ctx.arc(x,y,r,0,Math.PI*2,true);
		ctx.stroke();
	};

	//проверка, что указанные координаты находятся внутри контура Аватара
	public inArea (x: number, y: number): boolean {
		return false;
	}	
} 

//Path(Line)
export class TFigurePath extends TFigure  {
	private points: Array<TModePoint | TPathModePoint> = [];//массив пар значений Х Y
	private t: TTransformation;

	constructor(owner: any, t: TTransformation) {
		super(owner, t)
		this.t = t;
		this.parseDAttr();
		//определяю Границу фигуры
		this.boundRect = path2BoundRect(this.points);
	}

	private parseDAttr() {
		//transform="translate(158.598,70.8661) rotate(90)"
		//<path d="M0 119.06 L14.17 119.06" class="st1"/>
		//М - сдвинуть в Абсолютных кординатах
		//	  в данном случае Х = 0, Y = 119.06
		//L линия от текущего положения (выставленного М или предыдущим L)
		//    до координаты Х = 14.17, Y = 119.06
		//Значит надо составить список точек ХY
		//console.warn(this.owner.getAttribute('d'));
		var s: Array<string> = this.owner.getAttribute('d').split(/ /);
		//console.warn(s);
		var i = 0;
		while (i !== s.length) {
			var m = s[i++];	//параметр в котором первый символ может быть: "М" или "L" или "A"
							//	М-это первая точка Мx y
							//	L - линия Lx y
							//  А - дуга A rx ry x-axis-rotation large-arc-flag sweep-flag x y
			var mode = m.charAt(0);
			var	x = 0;
			var y = 0;
			var p:TPoint = {x:0, y: 0};
			//отработка М, L, A
				switch (mode) {
					case 'M':
					case 'L':
						//получаю X Y  из аттрибута d
						x = Number(m.slice(1));//удаляю первый символ
						y = Number(s[i++]);
						//вращение (rotate) и смещению (translate) координат
						    p = rotateXY(x,y,this.t.angle);
						x = p.x + this.t.dX;
						y = p.y + this.t.dY;
						//console.warn(mode, x, y);
						let res: TModePoint = {mode,x,y};
						this.points.push(res);
						break;
					case 'A':
						//d=".... A15.7162 13.0481 -55.83          0              0          20.04 114.34"
						//        Arx      ry      x-axis-rotation large-arc-flag sweep-flag x      y
						var rx = Number(m.slice(1));//радиус по Х
						var ry = Number(s[i++]);    //радиус по Y
						var x_axis_rotation = Number(s[i++]);
						var large_arc_flag  = Number(s[i++]);
						var sweep_flag      = Number(s[i++]);
						    x = Number(s[i++]);//XY конца
						    y = Number(s[i++]);//дуги
						//вращение (rotate) и смещению (translate) координат
						    p = rotateXY(x,y,this.t.angle);
						x = p.x + this.t.dX;
						y = p.y + this.t.dY;
						let pres: TPathModePoint = {
							mode, x, y,
								rx, ry, x_axis_rotation,
									large_arc_flag, sweep_flag};
						this.points.push(pres);
						break;
				}
		}
	}

	public draw (ctx: any){
		ctx.beginPath();
		this.points.forEach(function(item) {
				switch (item.mode) {
					case 'M'://начальная точка
						ctx.moveTo(item.x,item.y);
						break;
					case 'L'://line - линия
						ctx.lineTo(item.x,item.y);
						break;
					case 'A'://arc - дуга
						break;
				}
			}, this);
		ctx.stroke();
	}

	//проверка, что указанные координаты находятся внутри контура Аватара
	public inArea (x: number, y: number): boolean {
		return false;
	}	
}

//Rectangle
export class TFigureRect extends TFigure  {
	private points: Array<TModePoint> = [];//массив пар значений Х Y
	private t: TTransformation;
	private Left: number = 0;
	private Top: number = 0;
	private Width: number = 0;
	private Height: number = 0;

	constructor(owner: any, t: TTransformation) {
		super(owner, t)
		this.t = t;
		// transform="translate(97.367,-17.6861) rotate(15)"
		// <rect x="0" y="260.787" width="56.6929" height="11.3386" class="st1"/>		
		this.Left   = Number(this.owner.getAttribute('x'));
		this.Top    = Number(this.owner.getAttribute('y'));
		this.Width  = Number(this.owner.getAttribute('width'));
		this.Height = Number(this.owner.getAttribute('height'));
		//заменю прямоугольник на PATH так как
		//var mode = 'M';//установить нач точку
		//var x = Number(this.owner.getAttribute('x'));
		//var y = Number(this.owner.getAttribute('y'));
		this.points.push({ mode: 'M', //установить нач.точку
								x: this.Left,
									y: this.Top});
		this.points.push({ mode: 'L', //установить следующую точку
								x: (this.Left + this.Width),
									y: this.Top});
		this.points.push({ mode: 'L', //установить следующую точку
								x: (this.Left + this.Width),
									y: (this.Top + this.Height)});
		this.points.push({ mode: 'L', //установить следующую точку
								x: this.Left,
									y: (this.Top + this.Height)});
		this.points.push({ mode: 'L', //возврат к начальной точке
								x: this.Left,
									y: this.Top});																					
		//теперь вращаю и смещаю координаты всех точек
		this.points.forEach(function(item) {
			var p = rotateXY(item.x, item.y, t.angle);
			item.x = p.x + t.dX;
			item.y = p.y + t.dY;
			}, this);
		//определяю Границу фигуры
		this.boundRect = path2BoundRect(this.points);		
	}

	public draw (ctx: any){
		ctx.beginPath();
			this.points.forEach(function(item) {
				switch (item.mode) {
					case 'M'://начальная точка
						ctx.moveTo(item.x,item.y);
						break;
					case 'L'://line - линия
						ctx.lineTo(item.x,item.y);
						break;
				}
			  }, this);
		ctx.stroke();
	};	

	//проверка, что указанные координаты находятся внутри контура Аватара
	public inArea (x: number, y: number): boolean {
		return false;
	}	
}

//Text
export class TFigureText extends TFigure  {
	private points: Array<TModePoint> = [];//массив пар значений Х Y
	private cLeft: number = 0;
	private cTop: number = 0;
	private cAngle: number = 0;
	constructor(owner: any, t: TTransformation) {
		super(owner, t)
		this.cLeft  = Number(this.owner.getAttribute('cx'))+t.dX;
		this.cTop   = Number(this.owner.getAttribute('cy'))+t.dY;
		this.cAngle = Number(t.angle);
		//определяю Границу фигуры
		this.boundRect = path2BoundRect(this.points);
	}

	public draw (ctx: any){
		ctx.beginPath();
		ctx.stroke();
	};

	//проверка, что указанные координаты находятся внутри контура Аватара
	public inArea (x: number, y: number): boolean {
		return false;
	}	
}


//searchSvgViewObjects сканирует SVG создаёт список элементов имеющих графическое отображение как то:
//ellipse, text, path
//возвращает массив с отображаемыми элементами
function searchSvgViewObjects(svgID: string){
	var s: any = document.getElementById(svgID);//получаю доступ к DOM SVG
	var g_elements: any = s.contentDocument.children[0].getElementsByTagName('*');//найду все элементы
	//теперь просканирую список в поисках отображаемых граф. элементов
	var i = g_elements.length;//кол-во найденных элементов
	var svg_element: any = {};//объект элемента
	var res: Array<any> = [];//массив найденных элементов
	while (i !== 0) {
		i--;
		svg_element = g_elements[i];
		switch (svg_element.tagName) {
			case 'ellipse':
			case 'rect':
			case 'path':
			case 'text':
				res.push(svg_element);
				break;
		}
	}
	return res;
}
    
//createSvgAvatarObjects берёт данные из массива отображаемых объектов и превращает их в массив Аватаров
//и добавляет к объектам массива объекты-canvas-аватары, которые через метод draw (если я его вызову)
//выводятся на заданный canvas в независимости от того линия это груг или текст
function createSvgAvatarObjects (aVO: Array<any>): Array<any>{//aVO - массив отображаемых элементов
	var res: Array<any> = [];//массив объектов-Аватаров
	var o: any = {};//объект для SVG элемента
	var i: number = aVO.length;
	while (i !==0) {
		i--;
		o = aVO[i];
		//получить трансформации SVG для объекта
		var t:TTransformation = getSvgParentTransformation(o.parentElement);//получить трансформации родителя
		switch (o.tagName) {
			case 'ellipse':	//<ellipse cx="14.1732" cy="104.882" rx="14.1732" ry="14.1732" class="st2"/
					o.coFigure = new TFigureEllipse (o, t);
					break;
			case 'path'://<path d="M0 119.06 L14.17 119.06" class="st1"/>
					o.coFigure = new TFigurePath (o, t);
					break;
			case 'rect'://<rect x="0" y="260.787" width="56.6929" height="11.3386" class="st1"/>
					o.coFigure = new TFigureRect (o, t);
					break;
			case 'text'://<text x="15.46" y="268.26" class="st16">WARNING</text>
					o.coFigure = new TFigureText (o, t);
					break;
		} 
		res.push(o);
	}
	return res;	
}

//Aватары являются лишь контурами SVG объекта так как нужны для отработки кликов мышью
//в конструктор передаётся id изображения SVG внедрённого в HTML через тег Object
//<object id="SvgImg" type="image/svg+xml" data="img/img.svg"  width="?" height="?"></object>
export class TSVGAvatars {
	private arAvatars: Array<any> = [];
	constructor(id:string){
		this.arAvatars = createSvgAvatarObjects (searchSvgViewObjects(id));//массив аватаров отображаемых SVG объектов
	}

	//метод отрисовки полученных Аватаров на заданном Canvas (cnv)
	public draw (cnv: any) {
		var scr:any = document.getElementById(cnv);
		if (scr !== null) {
			var	ctx = scr.getContext('2d');
			this.arAvatars.forEach((figure:TFigure) => {
				figure.draw(ctx);
			})
		}
	}

	//метод отрисовки Границ Аватаров на заданном Canvas (cnv)
	public drawBound (cnv: any) {
		var scr: any = document.getElementById(cnv);
		if (scr != null) {
			var	ctx = scr.getContext('2d');
			this.arAvatars.forEach((figure:TFigure) => {
				figure.drawBound(ctx);
			})
		}
	}

	//метод. проверка нахождения точки с заданными координатами XY внутри контура Аватара
	public inArea (x: number, y: number): any {
		var i = this.arAvatars.length;
			while (i !==0) {
				i--;
					if (this.arAvatars[i].coFigure.inArea(x, y)) {
						console.warn(this.arAvatars[i]);
						return this.arAvatars[i];
					}
				}
	}

	//метод. проверка нахождения точки с заданными координатами XY внутри Границы Аватара
	public inBound (x: number, y: number, tolerance: number): any {
		var i = this.arAvatars.length;
			while (i !==0) {
				i--;
					if (this.arAvatars[i].coFigure.inBound(x, y, tolerance)) {
						//console.warn(this.arAvatars[i]);
						return this.arAvatars[i];//вернуть объект в найденных границах
					}
				}
	}
}	