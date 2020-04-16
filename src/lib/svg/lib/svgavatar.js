	function TSvgTransformList(name) {
  				this.name = name;//название трансформации
				this.param = [];//массив параметров трансформации (по name я узнаю назначение параметра )
			}

	//ASvgTransf//////////////////////////////////////////////////////////////////////////
	//получает строку трансформаций, вида:
	//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
	//на выходе рассчитанные значения трансформаций:
	//	dX, dY	- 	смещение
	//	angle	-	угол поворота
	//	sX, sY	-	масштаб по осям
	function ASvgTransf (trString) {
		this._trString = trString;//строка трансформаций
		this.arr = [];//это массив объектов трансформаций
		this.t = {
			dX:		0, //смещение по Х
			dY:		0, //смещение по Y
			angle:	0,//угол поворота осей
			sX:		1, //масштаб по Х
			sY:		1 //масштаб по Y			
		}
		var aTrStrList = [];

		this.getArr = function(){
			return this.arr;
		}

		this.getT = function(){
			return this.t;
		}
		//чистит объект, готовя к новому использованию
		this.clear = function(){
			this.arr  =  aTrStrList = [];
			this.t.dX = this.t.dY = this.t.angle = Number(0);
			this.t.sX = this.t.sX = Number(1);
		}

		//getSvgTransfStrArr - получает на вход строку с трансформациями вида:
		//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
		//а на выходе у него масив строк "translate(158.598,70.8661)","rotate(90)","translate(25.3701,-5.66929)"
		//который уже потом я буду парсить на предмет типа трансформации и её параметров
		this.getSvgTransfStrArr = function(s){
			const aTrs = ['translate','rotate','scale'];//массив ключевых слов трансформаций  (ещё есть matrix)
			var res = [];//тут будут строки трансформаций (потом их разделю на тип и параметры (которые в скобках))
			var j = aTrs.length;//я учитываю Три команды трансформации
			while (j !=0) {//найду вхождения каждой команды так как их может быть несколько
			 	 j--;
		  		var target = aTrs[j]; // цель поиска
		  		var pos = -1;
				while ((pos = s.indexOf(target, pos + 1)) != -1) {
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
		this.getTransformation = function (){
			if (this._trString != undefined) {
				aTrStrList = this.getSvgTransfStrArr(this._trString);//получу массив строк трансформаций
				this.getSvgTransfList(aTrStrList);
				var i = this.arr.length;
				while (i !=0) {
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
		this.getSvgTransfList = function (sattr){
			//теперь надо взять каждую строчку и выделить из неё название (тип) трансформации, и параметры трансформации
			//на выходе вернуть массив со списком объектов трансформации
			var i = sattr.length;
			this.arr = [];
			while (i != 0) {
				i--;
				//получил строку вида "translate(158.598,70.8661)" или "rotate(90)"
				//и выделяю тип трансформации и все циферки используя разделители " ", ",","(",")"
				var s = sattr[i].split(/[, ()]/);	
				//console.warn(s);
				var t = new TSvgTransformList(s[0]);
				for (var j = 1; j < s.length; j++) {//покажу что получил console.warn(s[j]) 
			  		if (s[j] != "") 
			    	t.param.push(s[j]);
				}
				//console.warn(t);
				this.arr.push(t);
			}
		//потом пройти это массив и "сложить" однотипные трансформации
	  	}
	}
	///////////////////////////////////////////////////////////////////////////////////////

	//получает список трансформаций родителя
	//из строки такого типа transform="translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
	//перечень трансформаций разделён пробелами (даже для красоты надо запретить себе исползовать пробелы в трансформациях)
	function getSvgParentTransformation(parent){
		if (parent != undefined) {
			var p = parent.getAttribute('transform');//поиск аттрибута transform, в s будет строка аттрибута
			//console.warn(p);//
			if (p != null) {//у объекта есть родитель (элемент более высокго уровня)
				var aSvgTransf = new ASvgTransf(p);
				return aSvgTransf.getTransformation();//вернёт трансформацию
			}
		}
		//значение по умолчанию
		return t = {
			dX:		0, //смещение по Х
			dY:		0, //смещение по Y
			angle:	0,//угол поворота осей
			sX:		1, //масштаб по Х
			sY:		1 //масштаб по Y			
		}
	}

	//преобразует массив точек МXY в координаты прямоугольника, куда эти точки вписаны
	function path2BoundRect(a) {
		var maxX = 0.0;
		var maxY = 0.0;
		var x = 0.0;
		var y = 0.0;
		var i = a.length;
		while (i !=0) {
			i--;
			x = a[i].x;
			y = a[i].y;
			if (x >= maxX) maxX = x;
			if (y >= maxY) maxY = y;
		}
		var minX = maxX;
		var minY = maxY;
		var i = a.length;
		while (i !=0) {
			i--;
			x = a[i].x;
			y = a[i].y;
			if (x <= minX) minX = x;
			if (y <= minY) minY = y;
		}
		return boundRect = {
			Left   : minX,
			Top    : minY,
			Width  : (maxX - minX) ,
			Height : (maxY - minY)
		}
	}

	//функции для поворота координат точки на заданный угол
	function deg2rad(degrees){
			return (Math.PI/180)*degrees;
		}

	function rotateXY(x, y, degrees){
		var r = deg2rad(degrees);
		var mcr = Math.cos(r);
		var msr = Math.sin(r);
		var point = {};
			point.x = (x * mcr) - (y * msr);
			point.y = (x * msr) + (y * mcr);
		return point;
	}

	//https://developer.mozilla.org/ru/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
	//вот отличная статья про объекты JS - я монял многое, уж инкапсуляцию/полиморфизм как организовать точно понял
	//TFigure предок отображаемых на Canvas элементов
	//передаю owner - владельца (svg объект)
	//        t 	- трансформации координат и масштаба
	var TFigure = function (owner, t) {
		//draw - это прототип метода, который для всех потомков TCanvasSvgAvatar будет переписан OVERRIDE
		//но зато я потом пройдёсь быстро по массиву объектов-потомков от TCanvasSvgAvatar и используя метод draw
		//нарисую их на заданном canvas`e
		this.owner = owner;
		//координаты прямоугольника - Границы - с максимальными размерами Аватара
		//для быстрого отсева аватаров в которых не входит искомая точка (напр. координата клика мышью)
		this.boundRect = {
			Left   : 0.0,
		    Top    : 0.0,
			Width  : 0.0,
			Height : 0.0
		}
	}

	//отрисовка Аватара на заданном CANVASe
	TFigure.prototype.draw = function (ctx) {
		//console.log(this.owner);
	}

	//отрисовка Границы Аватара на заданном CANVASe
	TFigure.prototype.drawBound = function (ctx) {
		var _strokeStyle = ctx.strokeStyle;
		ctx.strokeStyle = 'red';//граница будет серая
		ctx.strokeRect(this.boundRect.Left,
							this.boundRect.Top,
								this.boundRect.Width,
									this.boundRect.Height);
		ctx.strokeStyle = _strokeStyle;//восстановлю текущее значение						
	}	

	//проверка, что указанные координаты находятся внутри контура Аватара
	TFigure.prototype.inArea = function (x, y) {
		return false;
	}

	//проверка, что указанные координаты находятся внутри Границы Аватара
	//передаётся координаты XY и "пятно" пикселов tolerance
	//          -------[---]-------
	//Left, Top -------[---]-------
	//			-------[---]-------
	//			-------------------
	//			------------------- Height, Width
	TFigure.prototype.inBound = function (x, y, tolerance) {
		var chkX = ((x+tolerance) >=this.boundRect.Left) & ((x-tolerance) <= (this.boundRect.Left + this.boundRect.Width));
		var chkY = ((y+tolerance) >=this.boundRect.Top ) & ((y-tolerance) <= (this.boundRect.Top  + this.boundRect.Height));
		return (chkX & chkY);
	}
		//Ellipse
		function TFigureEllipse (owner, t) {
			//вызываю конструктор родителя
			TFigure.call(this,owner);
			//данные потомка
			var x  = Number(this.owner.getAttribute('cx'));
			var y  = Number(this.owner.getAttribute('cy'));
			this.cRadX  = Number(this.owner.getAttribute('rx'));
			this.cRadY  = Number(this.owner.getAttribute('ry'));
			this.cAngle = Number(t.angle);
			var p = rotateXY(x,y,t.angle);
			this.cLeft = p.x + t.dX;
			this.cTop  = p.y + t.dY;
			//заполнение Границы (прямоугольной области куда вписан элипс)
			this.boundRect.Left = this.cLeft - this.cRadX;
			this.boundRect.Top  = this.cTop  - this.cRadY;
			this.boundRect.Width = 2 * this.cRadX;
			this.boundRect.Height = 2 * this.cRadY;
		}

		//Созда. объект TFigureEllipse.prototype, который наследуется от TFigure.prototype
		TFigureEllipse.prototype = Object.create(TFigure.prototype);
		// Устанавливаем свойство "constructor" для ссылки на класс TFigureEllipse
		TFigureEllipse.prototype.constructor = TFigureEllipse;
		//Заменяю метод draw
		TFigureEllipse.prototype.draw = function(ctx){
			ctx.beginPath();
				var x = this.cLeft;
				var y = this.cTop;
				var r = this.cRadX;
				ctx.arc(x,y,r,0,Math.PI*2,true);
			ctx.stroke();
		};

		//проверка, что указанные координаты находся внутри контура Аватара
		TFigureEllipse.prototype.inArea = function (x, y) {
			return false;
		}

		//Path(Line)
		function TFigurePath (owner, t) {
			//вызываю конструктор родителя
			TFigure.call(this,owner);
			this.points = [];//массив пар значений Х Y
			//transform="translate(158.598,70.8661) rotate(90)"
			//<path d="M0 119.06 L14.17 119.06" class="st1"/>
			//М - сдвинуть в Абсолютных кординатах
			//	  в жанном случае Х = 0, Y = 119.06
			//L линия от текущего положения (выставленного М или предыдущим L)
			//    до координаты Х = 14.17, Y = 119.06
			//Значит надо составить список точек ХY
			//console.warn(this.owner.getAttribute('d'));
			var s = this.owner.getAttribute('d').split(/ /);
			//console.warn(s);
			var i = 0;
			while (i != s.length) {
				var m = s[i++];	//параметр в котором первый символ может быть: "М" или "L" или "A"
								//	М-это первая точка Мx y
								//	L - линия Lx y
								//  А - дуга A rx ry x-axis-rotation large-arc-flag sweep-flag x y
				var mode = m.charAt(0);
				var	x = 0;//удаляю первый символ
				var y = 0;
				//отработка М, L, A
					switch (mode) {
						case 'M':
						case 'L':
							//получаю X Y  из аттрибута d
							x = Number(m.slice(1));//удаляю первый символ
							y = Number(s[i++]);
							//вращение (rotate) и смещению (translate) координат
							var p = rotateXY(x,y,t.angle);
							x = p.x + t.dX;
							y = p.y + t.dY;
							//console.warn(mode, x, y);
							this.points.push({mode,x,y});
							break;
						case 'A':
							//d=".... A15.7162 13.0481 -55.83          0              0          20.04 114.34"
							//        Arx      ry      x-axis-rotation large-arc-flag sweep-flag x      y
							var rx = Number(m.slice(1));//радиус по Х
							var ry = Number(s[i++]);    //радиус по Y
							var x_axis_rotation = Number(s[i++]);
							var large_arc_flag  = Number(s[i++]);
							var sweep_flag      = Number(s[i++]);
							var x = Number(s[i++]);//XY конца
							var y = Number(s[i++]);//дуги
							//вращение (rotate) и смещению (translate) координат
							var p = rotateXY(x,y,t.angle);
							x = p.x + t.dX;
							y = p.y + t.dY;
							//console.warn(mode, rx, ry, x_axis_rotation,
							//				large_arc_flag, sweep_flag,
							//					x, y);
							this.points.push({mode,rx, ry, x_axis_rotation,
												large_arc_flag, sweep_flag,
													x, y});
							break;
					}				
				//console.debug(this.points[this.points.length - 1]);
			}
			//определяю Границу фигуры
			this.boundRect = path2BoundRect(this.points);
		}

		//Созда. объект TFigurePath.prototype, который наследуется от TFigure.prototype
		TFigurePath.prototype = Object.create(TFigure.prototype);
		// Устанавливаем свойство "constructor" для ссылки на класс TFigurePath
		TFigurePath.prototype.constructor = TFigurePath;
		//Заменяю метод draw
		TFigurePath.prototype.draw = function(ctx){
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
		};

		//проверка, что указанные координаты находся внутри контура Аватара
		TFigurePath.prototype.inArea = function (x, y) {
			return false;
		}

		//Rectangle
		function TFigureRect(owner, t) {
			//вызываю конструктор родителя
			TFigure.call(this,owner);
			// transform="translate(97.367,-17.6861) rotate(15)"
			// <rect x="0" y="260.787" width="56.6929" height="11.3386" class="st1"/>
			var Left   = Number(this.owner.getAttribute('x'));
			var Top    = Number(this.owner.getAttribute('y'));
			var Width  = Number(this.owner.getAttribute('width'));
			var Height = Number(this.owner.getAttribute('height'));
			//заменю прямоугольник на PATH так как
			this.points = [];//массив значений ХY и типа М(moveTo) или L(lineTo)
				//var mode = 'M';//установить нач точку
				//var x = Number(this.owner.getAttribute('x'));
				//var y = Number(this.owner.getAttribute('y'));
				this.points.push({ mode: 'M', //установить нач.точку
										x: Left,
											y: Top});
				this.points.push({ mode: 'L', //установить следующую точку
										x: (Left + Width),
											y: Top});
				this.points.push({ mode: 'L', //установить следующую точку
										x: (Left + Width),
											y: (Top + Height)});
				this.points.push({ mode: 'L', //установить следующую точку
										x: Left,
											y: (Top + Height)});
				this.points.push({ mode: 'L', //возврат к начальной точке
										x: Left,
											y: Top});																					
			//теперь вращаю и смещаю координаты всех точек
			this.points.forEach(function(item) {
				var p = rotateXY(item.x, item.y, t.angle);
				item.x = p.x + t.dX;
				item.y = p.y + t.dY;
			  }, this);
			//определяю Границу фигуры
			this.boundRect = path2BoundRect(this.points);
		}

		//Созда. объект TFigureRect.prototype, который наследуется от TFigure.prototype
		TFigureRect.prototype = Object.create(TFigure.prototype);
		// Устанавливаем свойство "constructor" для ссылки на класс TFigureRect
		TFigureRect.prototype.constructor = TFigureRect;
		//Заменяю метод draw
		TFigureRect.prototype.draw = function(ctx){
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

		//проверка, что указанные координаты находся внутри контура Аватара
		//есть прямоугольник описанный линиями, координаты линий записаны в массиве
		//
		TFigureRect.prototype.inArea = function (x, y) {
			return false;
		}

		//Text
		function TFigureText(owner, t) {
			//вызываю конструктор родителя
			TFigure.call(this,owner);
			this.cLeft  = Number(this.owner.getAttribute('cx'))+t.dX;
			this.cTop   = Number(this.owner.getAttribute('cy'))+t.dY;
			this.cAngle = Number(t.angle);
			this.points = [];//массив координат
			//определяю Границу фигуры
			this.boundRect = path2BoundRect(this.points);
		}

		//Созда. объект TFigureText.prototype, который наследуется от TFigure.prototype
		TFigureText.prototype = Object.create(TFigure.prototype);
		// Устанавливаем свойство "constructor" для ссылки на классTFigureText
		TFigureText.prototype.constructor = TFigureText;
		//Заменяю метод draw
		TFigureText.prototype.draw = function(ctx){
			ctx.beginPath();
						/*
						<text x="15.46" y="268.26" class="st16">WARNING</text>
						o.cLeft  = Number(o.getAttribute('cx'))+t.dX;
						o.cTop   = Number(o.getAttribute('cy'))+t.dY;
						o.cAngle = Number(t.angle);
						*/
				//var x = this.owner.cLeft;
				//var y = this.owner.cTop;
				//var w = this.owner.cWidth;
				//var h = this.owner.cHeight;
				//ctx.strokeRect(x,y,w,h);
			ctx.stroke();
		};
	
	//проверка, что указанные координаты находся внутри контура Аватара
	TFigureText.prototype.inArea = function (x, y) {
		return false;
	}

	//searchSvgViewObjects сканирует SVG создаёт список элементов имеющих графическое отображение как то:
	//ellipse, text, path
	//возвращает массив с отображаемыми элементами
	function searchSvgViewObjects(svgID){
		var s = document.getElementById(svgID);//получаю доступ к DOM SVG
		var g_elements = s.contentDocument.children[0].getElementsByTagName('*');//найду все элементы
		//теперь просканирую список в поисках отображаемых граф. элементов
		var i = g_elements.length;//кол-во найденных элементов
		var svg_element = {};//объект элемента
		var res = [];//массив найденных элементов
		while (i != 0) {
			i--;
			svg_element = g_elements[i];
			switch (svg_element.tagName) {
				case 'ellipse':
				case 'rect':
				case 'path':
				case 'text':
					//console.log(svg_element.parentElement);//действительно показывает родителя
					//console.log(svg_element);  
					res.push(svg_element);
					break;
			}
		}
		return res;
	}
    
	//createSvgAvatarObjects берёт данные из массива отображаемых объектов и превращает их в массив Аватаров
	//и добавляет к объектам массива объекты-canvas-аватары, которые через метод draw (если я его вызову)
	//выводятся на заданный canvas в независимости от того линия это груг или текст
	function createSvgAvatarObjects (aVO){//aVO - массив отображаемых элементов
		var res = [];//массив объектов-Аватаров
		var o = {};//объект для SVG элемента
		var i = aVO.length;
		while (i !=0) {
			i--;
			o = aVO[i];
			//console.log(o);
			//получить трансформации SVG для объекта
			var t = getSvgParentTransformation(o.parentElement);//получить трансформации родителя
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
	function TSVGAvatars (id){
		this.arAvatars = createSvgAvatarObjects (searchSvgViewObjects(id));//массив аватаров отображаемых SVG объектов
		//console.warn(this.arAvatars);//показать массив аватаров
	}

	//метод отрисовки полученных Аватаров на заданном Canvas (cnv)
	TSVGAvatars.prototype.draw = function (cnv) {
		var scr = document.getElementById(cnv);
		if (scr != null) {
			var	ctx = scr.getContext('2d');
			var i = this.arAvatars.length;
			while (i !=0) {
				i--;
				this.arAvatars[i].coFigure.draw(ctx);//вывод на канву
			}
		}		
	}

	//метод отрисовки Границ Аватаров на заданном Canvas (cnv)
	TSVGAvatars.prototype.drawBound = function (cnv) {
		var scr = document.getElementById(cnv);
		if (scr != null) {
			var	ctx = scr.getContext('2d');
			var i = this.arAvatars.length;
			while (i !=0) {
				i--;
				this.arAvatars[i].coFigure.drawBound(ctx);//вывод на канву
			}
		}		
	}

	//метод. проверка нахождения точки с заданными координатами XY внутри контура Аватара
	TSVGAvatars.prototype.inArea = function (x, y) {
		var i = this.arAvatars.length;
			while (i !=0) {
				i--;
					if (this.arAvatars[i].coFigure.inArea(x, y)) {
						console.warn(this.arAvatars[i]);
					}
				}
	}	
	
	//метод. проверка нахождения точки с заданными координатами XY внутри Границы Аватара
	TSVGAvatars.prototype.inBound = function (x, y, tolerance) {
		var i = this.arAvatars.length;
			while (i !=0) {
				i--;
					if (this.arAvatars[i].coFigure.inBound(x, y, tolerance)) {
						//console.warn(this.arAvatars[i]);
						return this.arAvatars[i];//вернуть объект в найденных границах
					}
				}
	}	