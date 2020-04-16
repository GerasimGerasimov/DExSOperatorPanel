    //Список групп "g"
    //там могут быть подгруппы, например
    //g---rect
    //  |-text
    //  |-ellipse
    //g---g---text
    //  |   |-text
    //  |   |-rect
    //  |
    //  |-g---text
    //      |-ellipse
    //g---rect
    //rect - да-да, кроме Групп, в SVG могут быть и не сгруппированные элементы
    //text

    //svg--
    //    |---g---rect
    //    |     |-text
    //    |     |-ellipse
    //    |
    //    |---g---g---text
    //    |     |   |-text
    //    |     |   |-rect
    //    |     |
    //    |     |-g---text
    //    |         |-ellipse
    //    |
    //    |---g---rect
    //    |-rect
    //    |-text
'use strict'
    //Node - ветки
    function TNode(data) {
        this.data = data;//данные ветви
        this.t = null;
        this.parent = null;//ссылка на родителя
        this.children = [];//массив потомков
    }

    //Tree - дерево
    function TTree(data) {
        var node = new TNode(data);
        this._root = node;
    }
    
    /*
    //Этот метод обходит дерево с поиском в глубину.
    //Шаги 2 (выход из функции),
    //3 (вызов себя) и 4 (callback) повторяются до тех пор, пока мы не пройдем каждый узел дерева. 
    TTree.prototype.traverseDF = function(callback) {  
        // this is a recurse and immediately-invoking function 
        (function recurse(currentNode) {
            // step 2
            for (var i = 0, length = currentNode.children.length; i < length; i++) {
                // step 3
                recurse(currentNode.children[i]);
            }
            // step 4
            callback(currentNode);
            // step 1
        })(this._root);
    };

    //обход дерева в ширину
    TTree.prototype.traverseBF = function(callback) {
        var queue = new Queue();
        queue.enqueue(this._root);
        currentTree = queue.dequeue();
        while(currentTree){
            for (var i = 0, length = currentTree.children.length; i < length; i++) {
                queue.enqueue(currentTree.children[i]);
            }
            callback(currentTree);
            currentTree = queue.dequeue();
        }
    };
    
    //искать конкретное значение в нашем дереве
    //принимает два аргумента: данные для поиска и тип обхода
    //Использование:
    //  tree is an example of a root node
    //    tree.contains(function(node){
    //        if (node.data === 'two') {
    //            console.log(node);
    //        }
    //    }, tree.traverseBF);
    //
    TTree.prototype.contains = function(callback, traversal) {
        traversal.call(this, callback);
    };


    //метод, который позволит нам добавить узел к определенному узлу
    //add(data, toData, traversal) определяет три параметра.
    //  data, используется для создания нового экземпляра Node.
    //  toData используется для сравнения с каждым узлом в дереве.
    //  traversal, является типом обхода дерева, используемого в этом методе    
    TTree.prototype.add = function(data, toData, traversal) {
        var child = new Node(data),
            parent = null,
            callback = function(node) {
                if (node.data === toData) {
                    parent = node;
                }
            };
        this.contains(callback, traversal);
        if (parent) {
            parent.children.push(child);
            child.parent = parent;
        } else {
            throw new Error('Cannot add node to a non-existent parent.');
        }
    };
*/

    TNode.prototype.addChildren = function (data, parent) {
        var node = new TNode (data);
            node.parent = parent;
        this.children.push(node);
    }

    TTree.prototype.getRootNode = function(e) {
        var i = this.node.children.length;
        while (i !=0 ) {
            i--;
            var c = this.node.children[i].data;//вытащу для отладки
            if (c == e) {
                return this.node.children[i];
            }
        }
        return null;
    }


    //Проходит дерево в поисках Ноды имеющей заданный элемент
    //Передаю:
    //  n - ноду в которой надо искать
    //  e - данные которые надо найти
    //Возвращает:
    //  null - ничего не нашёл
    //  Node - ссылка на ноду содержащую элемент
    TTree.prototype.getNode = function(n, e) {
        var i = n.children.length;
        while (i !=0 ) {
            i--;
            var c = n.children[i].data;//вытащу для отладки
            if (c == e) {
                return n.children[i];
            }
        }
        return null;
    }

    TTree.prototype.addNode = function(e) {
        //проверить есть ли вообще ноды
        //проверить является ли добавляемая нода потомком имеющихся нод
        //если не является, то узнать есть ли у неё родитель..
        //есть ли у родителя родитель, и так пока не упрусь в родителя sgv
        //потом начинается обратный процесс, я создаю самого главного родителя, потом "подродителей"
        //и к родителю этой ноды добавляю эту ноду... вот такой рекурсивный алгоритм
        //Создаю список родителей:
        var n = e;//сохраню даные для ноды
        var a = [];
            while (true){
                var p = e.parentElement;
                if (p.tagName == 'svg') break;//поиск завершён
                //найден родитель
                //console.error('j:=',j,p);
                a.push[p];//добавляет в конец массива
                e = p;
            }  
        //теперь у меня есть массив родителей для данного элемента, от 0 до N
        //N+2__
        //    |-N+1__
        //          |-0 и тд.
        //причём, если родителей нет, то это один из корней дерева (выше него только svg)
        //и добавлять его надо в ствол (самый первый нод)
        var i = a.length;//кол-во найденных родителей
        r = this._root;//начинаю искать от корня (он будет углублятся по мере поиска)
        while (i !=0) {
            i--;//сразу доступ к самому первому родителю 
            if (this.getNode(r, a[i]) == null) {//такой ветки на стволе нет, надо добавить
                var n = new TNode(a[i]);
                    n.parent = r;
                r.children.push(n);
            } 

        }        
    }

    TTree.prototype.addRootChildren = function(data) {
        this._root.addChildren(data, null);
    }
  
    function getParent(element){
        return element.parentElement;
    }

    //Tree - дерево
    function TSVGGroups(id, cnv) {
        this.tree = null;
        this.getGroupsArr(id, cnv);
    }

    //a - массив родителей 'p', c с трансформациями 't' и их потомков
    //treeNode - начальная ветка дерева, куда надо добавить элементы из массива 
    function addArrToTree(a, treeNode) {
        //console.log('Добавление родителей в дерево');
        var i = 0;
        var searchNode = treeNode;//с чего начинать поиск
        while (i < a.length) {
            var p = a[i];//получил старшего родителя из списка
            //в функцию передаю родителя которго надо найти или создать
            //и ветку поиска node
            // e - элемент который ищет родителя
            // p - предполагаемый родитель (предлагаются от старшего к младшему)
            // node - нода в которой идёт поиск (нода с которой начинается поиск) 
            (function (p, node) {
                var j = node.children.length;//кол-во детей у ноды
                var n ;//найденная нода (или undefine если не нашёл)
                while (j != 0) {
                    j--;
                    if (node.children[j].data == p) {//есть нода с таким объектом
                        n = node.children[j];//верну что нашёл объект
                        break;//прерву этот while
                    }
                }
                //вышел из цикла, смотрю на "n"
                if (n == undefined) {//нода не найдена, треба создать новую
                    n = new TNode(p);
                    n.parent = node;//сделал ссылку на родителя ноды
                    node.children.push(n);//родителю добавил ноду в дети
                }
                //Теперь такая нода есть (была или создал новую) 
                    searchNode = n;
                    return;
            })(p, searchNode);
            i++;
        }
    }

		//getSvgTransfList получает sattr строки аттриботов вида translate(158.598,70.8661)
		//делает из них объект вида
		//name = translate (тип трансформации)
		//param = [158.598, 70.8661] //массив параметров трансформации
		function getSvgTransfList (sattr){
			//теперь надо взять каждую строчку и выделить из неё название (тип) трансформации, и параметры трансформации
            //на выходе вернуть массив со списком объектов трансформации
            if (sattr == null) return null;
			var i = sattr.length;
			var arr = [];
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
				arr.push(t);
			}
            //потом пройти это массив и "сложить" однотипные трансформации
            return arr;
        }
          
        //getSvgTransfStrArr - получает на вход строку с трансформациями вида:
		//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
		//а на выходе у него масив строк "translate(158.598,70.8661)","rotate(90)","translate(25.3701,-5.66929)"
		//который уже потом я буду парсить на предмет типа трансформации и её параметров
		function getSvgTransfStrArr (s){
			const aTrs = ['translate','rotate','scale'];//массив ключевых слов трансформаций  (ещё есть matrix)
			var res = [];//тут будут строки трансформаций (потом их разделю на тип и параметры (которые в скобках))
            if (s == null) return res;
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
        
        function TSvgTransformation () {
            this.dX     = 0; //смещение по Х
            this.dY     = 0; //смещение по Y
            this.angle  = 0;//угол поворота осей
            this.sX     = 1; //масштаб по Х
            this.sY     = 1;//масштаб по Y			
        }

        //getTransformation проходит по массиву трансформаций arr
        //и вычисляет итоговые значения трансформаций для графического элемента
        //на входе
        //  s - строка трансформаций
        //  t - объект трансформаций типа TSvgTransformList
		//на выходе:
		//	dX, dY	- 	смещение
		//	angle	-	угол поворота
		//	sX, sY	-	масштаб по осям
		function getTransformation (s, dX, //смещение по Х
                                        dY, //смещение по Y
                                          angle,//угол поворота осей
                                            sX, //масштаб по Х
                                                sY//масштаб по Y)
                                                    )
        {
            var result = {dX, dY, angle, sX, sY};
			if (s != null) {
				var aTrStrList = getSvgTransfStrArr(s);//получу массив строк трансформаций
				var a = getSvgTransfList(aTrStrList);
				var i = a.length;
				while (i !=0) {
					i--;
					var o = a[i];
					switch (o.name) {
						case 'translate':
                            result.dX += Number(o.param[0]);//смещение по Х
							result.dY += Number(o.param[1]);//смещение по Y
							break;
						case 'rotate':
                            result.angle += Number(o.param[0]);//поворот осей
							break;
						case 'scale':
                            result.sX *= Number(o.param[0]);//смещение по Х
							result.sY *= Number(o.param[1]);//смещение по Y
							break;
					}				
				}
			}
			return result;
        } 
      
    //через "е" передаётся элемент (имеющий метод parentElement)
    //на его основании строится массив предков этого элемента
    //рекурсией перебираю всех родителей, до самого старшего
    //и получаю список всех родителей элемента
    //от старшего к младшему
    //svg->g->gx->gy;
    //за одно надо собрать информацию о трансформациях
    function getParentsList (e){
        var result = [];
        (function recurse(currentNode) {
            if (currentNode.parentElement.tagName != 'svg') {
                //добавление в список
                result.splice(0,0,currentNode.parentElement);
                recurse(currentNode.parentElement);//запускаю рекурсию
            }
            else //null у элемента нет родителя
                 return;//поэтому выход
        })(e);        
        return result;
    }

/*     function getParentsList (e){
        var result = [];
        var t = {
            dX:		0, //смещение по Х
            dY:		0, //смещение по Y
            angle:	0,//угол поворота осей
            sX:		1, //масштаб по Х
            sY:		1 //масштаб по Y			
        };
        (function recurse(currentNode) {
            if (currentNode.parentElement.tagName != 'svg') {
                //вычисление трансформаций для элемента
                var s = currentNode.getAttribute('transform');//поиск аттрибута transform, в s будет строка аттрибутов
                console.log(s);
                t = getTransformation(s, t);//получаю объект с трансформациями
                console.log('t:', t);
                //добавление в список
                result.splice(0,0,{p: currentNode.parentElement,
                                     t: t});
                recurse(currentNode.parentElement);//запускаю рекурсию
            }
            else //null у элемента нет родителя
                 return;//поэтому выход
        })(e);        
        return result;
    } */

    //e - элемент который необходимо добавить в дерево
    //treeNode - начальная ветка дерева, куда надо добавить элементы из массива 
    function addElemetsToTree(e, treeNode) {
        //return;
        var p = e.parentElement;
        try {
            (function recurse(currentNode) {
                var i = currentNode.children.length;
                while (i !=0) {
                    i--;
                    if (currentNode.children[i].data == p) {
                        //найдена нода, родитель заданного элемента
                        //проверить, есть ли в её детях заданный элемент (чтобы не добавлять повторно)
                        if (currentNode.children.indexOf(e) == -1) {
                            //такого элемента нет, добавить
                            var n = new TNode (e);
                            n.parent = currentNode.children[i];
                            currentNode.children[i].children.push(n);
                            //как выйти из циков и рекурсии?
                            throw "function addElemetsToTree parent is founded, element added";
                         }
                        //надо выйти из цикла и рекурсии
                        throw "function addElemetsToTree parent is founded, element exsisted";
                    }
                    recurse(currentNode.children[i]);
                }
            })(treeNode);
        }
        catch (e){
            //console.log(e);
            return;
        }        
    }

    function i2Space(i) {
        var s = '';
        while (i !=0){
            s +='-';
            i--;
        }
        return s;
    }

    //обход дерева с целью вычисления смещений
    //от корня дерева, применяет к каждому узлу translate, rotate, scale
    //к узлам добавляет вычесленную для него трансформацию
    //и какой по счёту от корня
    function getTransform(treeNode){
        console.warn('getTransform');
        var d = 0;
        (function recurse(currentNode) {
            var s='';
            var id = '';
            var t;
            try {
                s = currentNode.data.getAttribute('transform');
                id = currentNode.data.getAttribute('id');
                throw 'getTransform.Error';
            }
            catch(e) {
            }
            //трансформации родителя
            var p;
            try {
                p = currentNode.parent.t;
            }
            catch(e) {
                p = new TSvgTransformation();
            }
            //
            t = getTransformation (s, p.dX, p.dY,//чтобы не изменять parentTransform
                                        p.angle,
                                        p.sX, p.sY);
            currentNode.t = t;
            //console.log(i2Space(d)+currentNode.data.tagName+'.'+id+':'+s, currentNode.t);
            try {
                //console.log(i2Space(d)+'parent:'+
                //            currentNode.parent.data.getAttribute('id')+
                //                ':',currentNode.parent.t);
                //console.error(i2Space(d)+currentNode.data.getAttribute('scada:id'));
            }
            catch(e) {
            }
            var i = currentNode.children.length;
            d++;
            while (i !=0) {
                i--;              
                recurse(currentNode.children[i]);
            }
            d--;
        })(treeNode);
    }

    //создание аватаров элементов
    function createSvgAvatars(treeNode) {
        console.warn('createSvgAvatars');
        var d = 0;
        (function recurse(currentNode) {
            try {
                switch (currentNode.data.tagName) {
                    case 'ellipse':	//<ellipse cx="14.1732" cy="104.882" rx="14.1732" ry="14.1732" class="st2"/
                            currentNode.data.coFigure = new TFigureEllipse (currentNode.data, currentNode.t);
                            break;
                    case 'path'://<path d="M0 119.06 L14.17 119.06" class="st1"/>
                            currentNode.data.coFigure = new TFigurePath (currentNode.data, currentNode.t);
                            break;
                    case 'rect'://<rect x="0" y="260.787" width="56.6929" height="11.3386" class="st1"/>
                            currentNode.data.coFigure = new TFigureRect (currentNode.data, currentNode.t);
                            break;
                    case 'text'://<text x="15.46" y="268.26" class="st16">WARNING</text>
                            currentNode.data.coFigure = new TFigureText (currentNode.data, currentNode.t);
                            break;
                } 
                //console.log(i2Space(d)+currentNode.data.tagName+':',currentNode.data.coFigure);
            }
            catch (e){
            }
            var i = currentNode.children.length;
            d++;
            while (i !=0) {
                i--;
                recurse(currentNode.children[i]);
            }
            d--;
        })(treeNode);
    }

    
    //метод отрисовки полученных Аватаров на заданном Canvas (cnv)
	function drawAvatars (cnv, treeNode) {
		var scr = document.getElementById(cnv);
		if (scr != null) {
			var	ctx = scr.getContext('2d');
             var d = 0;
             (function recurse(currentNode) {
                 try {
                    currentNode.data.coFigure.draw(ctx);
                    //console.log(i2Space(d)+currentNode.data.tagName+':',
                    //                currentNode.data.coFigure,
                    //                    currentNode.t);
                  }
                 catch (e){
                 }
                 var i = currentNode.children.length;
                 d++;
                 while (i !=0) {
                     i--;
                     recurse(currentNode.children[i]);
                 }
                 d--;
             })(treeNode);	
		}		
	}
    
    //метод отрисовки Границ Аватаров на заданном Canvas (cnv)
	function drawAvatarsBounds (cnv, treeNode) {
		var scr = document.getElementById(cnv);
		if (scr != null) {
			var	ctx = scr.getContext('2d');
             var d = 0;
             (function recurse(currentNode) {
                 try {
                    currentNode.data.coFigure.drawBound(ctx);
                  }
                 catch (e){
                 }
                 var i = currentNode.children.length;
                 d++;
                 while (i !=0) {
                     i--;
                     recurse(currentNode.children[i]);
                 }
                 d--;
             })(treeNode);	
		}		
	}

    //Отрисовка Границы группы (g с id имеющий графические элементы в т.ч. другие групы g)
    //для подгонки под Visio, иметь Границу может только группа "g" имеющая id
    //Когда я в режиме редактирования кликаю на изображение (какой-то графический элемент),
    //я сначала должен отбразить границы группы к которой он относится
    //а если говорить о SCADA то кликнув по элементу, я должне сразу выходить на свойства группы
    //Для начала я сделаю прямоугольные границы у группы, углы прямоугольника будут являться
    //макс и мин всех встроенных в группу объектов.
    //Короче: найти мин х,у, потом макс х,у это и будут координаты прямоугольника.
    //Заполню объект Bound у группы данными этого прямоугольнка
    //обеспечу метод для его отрисовки.
    //В итоге, я должен щёлкать мышью по элементу, а на самом деле, выбирать группу
    //в которую входит этот элемент. Я могу узнать на каком элементе щёлкнул уже сейчас
    //Потом выявить его родителя - это будет группа в которой находится элемент.
    
    //сканирует группы, добавляет к ним объект Bounds
    function addGroupBounds (treeNode) {

    }


    TSVGGroups.prototype.getGroupsArr = function (id, cnv) {      
        var s = document.getElementById(id);//получаю доступ к DOM SVG
        var gs = s.contentDocument.children[0].getElementsByTagName('*');//найду все элементы g
        //к сожалению такой поиск не учитывает вложенности, придётся определять её через parentElement
        //при этом выяснилось, что верхний уровень это объект "svg" а следующий "null"
        //вывод: достиг объекта svg значит закончить поиск.
        this.tree = new TTree('svg');//создание корня (data = 'svg', parent = null, children = [пусто])
        var i = 0; ;//кол-во найденных тегов
        if (gs.length != 0) {
            i = gs.length;
            while (i != 0) {
                i--;
                //мне интересны объекты g, text, path, rect, ellipse
                if (['g', 'text', 'path', 'rect', 'ellipse'].indexOf(gs[i].tagName) == -1) {
                    continue;
                }
                //выделены только требуемые элементы
                var p = getParentsList (gs[i]);
                //console.warn(p);
                //Теперь просканировать tree от корня, если родителя нет, до добавлять его
                addArrToTree(p, this.tree._root);
            }       
            //console.log(tree);//построенное дерево родителей
        }
        //теперь добавить к родителям их потомков - графические элементы
        i = 0; ;//
        if (gs.length != 0) {
            i = gs.length;
            while (i != 0) {
                i--;
                //теперь мне интересны объекты text, path, rect, ellipse
                if (['text', 'path', 'rect', 'ellipse'].indexOf(gs[i].tagName) == -1) {
                    continue;
                }
                //выделены только требуемые элементы
                //Теперь просканировать tree от корня, если добавить родителям элементов
                addElemetsToTree(gs[i], this.tree._root);
            }       
            //console.log(this.tree);//построенное дерево родителей
        }
        //теперь пройти по дереву и узнать и добавить трансформации для каждого элемента
        getTransform(this.tree._root);
        //опять пройтись по дереву в поиске графических элементов (как правило они на концах веток)
        //и наделить их свойствами графичесих объектов для ускорения отображения
        createSvgAvatars(this.tree._root);
        //теперь пройтись по дереву и построить аватары для групп в которых вложены граф.элементы
        drawAvatars(cnv, this.tree._root); 
        //нарисовать границы
        drawAvatarsBounds (cnv, this.tree._root); 
    }

    //возвращает элемент имеющий аттриубут attr, который имеет значение value
    //вообще я ищу svg контейнеры с аттрибутом 'data-id'
    //Продолжить!!!!!
    TSVGGroups.prototype.getElementByAttrValue = function (attr, value) {
        console.warn('TSVGGroups.prototype.getElementByAttrValue',':',attr,':',value);//
        var treeNode = this.tree._root;
        var element = null;
        var s = '';
        try {
            (function recurse(currentNode) {
                if (currentNode.data.getAttribute != undefined ) {  
                    if ((s = currentNode.data.getAttribute(attr)) == value) {
                        console.warn('attr:',s);
                        throw(currentNode.data);//Группа-Владелец найдена
                    }
                }
                var i = currentNode.children.length;
                while (i !=0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
             })(treeNode);
        }
        catch (e){
            if ('stack' in e) {//произошло исключение
                console.warn('TSVGGroups.prototype.getElementByAttrValue',e.stack);//это ошибка
                return null;
            }
            else {//группа-владелец найдена
                  console.warn(e);
                  return(e);
            }
        }
    }

	//метод. проверка нахождения точки с заданными координатами XY внутри Границы Аватара
    //возвращает объект группы входящуу в координаты, или null
    TSVGGroups.prototype.inBound = function (x, y, tolerance) {
        //console.error('TSVGGroups.prototype.inBound');
        var treeNode = this.tree._root;
        var element = null;
        //1) найти элемент которому пренадлежат координаты x,y
        try {
            (function recurse(currentNode) {
                if (currentNode.data.hasOwnProperty('coFigure')) {
                    if (currentNode.data.coFigure.inBound(x, y, tolerance)) {
                        throw(currentNode);
                    }
                }
                var i = currentNode.children.length;
                while (i !=0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
            })(treeNode);
        }
        catch(e){
            //проверю чо это не ошибка, а именно объект
            //if (!e.hasOwnProperty('coFigure')) {
                //да, это именно найденный элемент;
                element = e;
            //}
        }
        if (element == null)
            return null; //ничего не найдено;
        //2) найти группу (имеющую тег data-id) в которую вложен найденный элемент
        treeNode = element;
        //console.warn(element);
        try {
            (function recurse(currentNode) {
                if (currentNode.parent != null) {
                    //console.log(currentNode.parent);
                    if ('attributes' in currentNode.parent.data){
                        var s = '';
                        if ((s = currentNode.parent.data.getAttribute('data-id')) != null) {
                            console.warn('attr:',s);
                            throw(currentNode.parent);//Группа-Владелец найдена
                        }
                    }
                    recurse(currentNode.parent);
                }
            })(treeNode);
        }
        catch(e){
            if ('stack' in e) {//произошло исключение
              console.warn('TSVGGroups.prototype.inBound',e.stack);//это ошибка
              return null;
            }
            else {//группа-владелец найдена
                console.warn(e);
                return(e);
            }
        }      	
	}	