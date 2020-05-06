    import {TSvgTransformList,
            TFigureEllipse,
            TFigurePath,
            TFigureRect,
            TFigureText} from './svgavatar'
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
    //Node - ветки
class TNode{
    data: any;//данные ветви
    t: TSvgTransformation | undefined;
    parent:any = null;//ссылка на родителя
    children: Array<any> = [];//массив потомков
    
    constructor (data: any) {
        this.data = data;//данные ветви
    }

    public addChildren (data: any, parent: any) {
        var node = new TNode (data);
            node.parent = parent;
        this.children.push(node);
    }    
}

//Tree - дерево
class TTree {
    node: TNode;
    _root: TNode;
    constructor(data: any){
        this.node = new TNode(data);
        this._root = this.node;
    }

    getRootNode (element: any): any {
        var i = this.node.children.length;
        while (i !==0 ) {
            i--;
            var c = this.node.children[i].data;//вытащу для отладки
            if (c === element) {
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
    getNode = function(node: TNode, element: any): any {
        var i = node.children.length;
        while (i !==0 ) {
            i--;
            var c = node.children[i].data;//вытащу для отладки
            if (c === element) {
                return node.children[i];
            }
        }
        return null;
    }

    addNode (e: any) {
        //проверить есть ли вообще ноды
        //проверить является ли добавляемая нода потомком имеющихся нод
        //если не является, то узнать есть ли у неё родитель..
        //есть ли у родителя родитель, и так пока не упрусь в родителя sgv
        //потом начинается обратный процесс, я создаю самого главного родителя, потом "подродителей"
        //и к родителю этой ноды добавляю эту ноду... вот такой рекурсивный алгоритм
        //Создаю список родителей:
        //var n: any = e;//сохраню даные для ноды
        var a: Array<any> = [];
            while (true){
                var parent = e.parentElement;
                if (parent.tagName === 'svg') break;//поиск завершён
                //найден родитель
                a.push(parent);//добавляет в конец массива
                e = parent;
            }  
        //теперь у меня есть массив родителей для данного элемента, от 0 до N
        //N+2__
        //    |-N+1__
        //          |-0 и тд.
        //причём, если родителей нет, то это один из корней дерева (выше него только svg)
        //и добавлять его надо в ствол (самый первый нод)
        var i = a.length;//кол-во найденных родителей
        const root = this._root;//начинаю искать от корня (он будет углублятся по мере поиска)
        while (i !==0) {
            i--;//сразу доступ к самому первому родителю 
            if (this.getNode(root, a[i]) === null) {//такой ветки на стволе нет, надо добавить
                let n: any = new TNode(a[i]);
                    n.parent = root;
                root.children.push(n);
            } 

        }        
    }

    addRootChildren (data: any) {
        this._root.addChildren(data, null);
    }
}
  
//a - массив родителей 'p', c с трансформациями 't' и их потомков
//treeNode - начальная ветка дерева, куда надо добавить элементы из массива 
function addArrToTree(a: Array<any>, treeNode: TNode) {
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
            while (j !== 0) {
                j--;
                if (node.children[j].data === p) {//есть нода с таким объектом
                    n = node.children[j];//верну что нашёл объект
                    break;//прерву этот while
                }
            }
            //вышел из цикла, смотрю на "n"
            if (n === undefined) {//нода не найдена, треба создать новую
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

//getSvgTransfList получает attr строки аттриботов вида translate(158.598,70.8661)
//делает из них объект вида
//name = translate (тип трансформации)
//param = [158.598, 70.8661] //массив параметров трансформации
function getSvgTransfList (attr: Array<string>): Array<TSvgTransformList>{
    //теперь надо взять каждую строчку и выделить из неё название (тип) трансформации, и параметры трансформации
    //на выходе вернуть массив со списком объектов трансформации
    if (attr == null) return attr;
    var i = attr.length;
    var arr: Array<TSvgTransformList> = [];
    while (i !== 0) {
        i--;
        //получил строку вида "translate(158.598,70.8661)" или "rotate(90)"
        //и выделяю тип трансформации и все циферки используя разделители " ", ",","(",")"
        var s = attr[i].split(/[, ()]/);	
        var t:TSvgTransformList = new TSvgTransformList(s[0]);
        for (var j = 1; j < s.length; j++) {//покажу что получил console.warn(s[j]) 
            if (s[j] !== "") 
            t.param.push(s[j]);
        }
        arr.push(t);
    }
    //потом пройти это массив и "сложить" однотипные трансформации
    return arr;
}
          
//getSvgTransfStrArr - получает на вход строку с трансформациями вида:
//	"translate(158.598,70.8661) rotate(90) translate(25.3701,-5.66929)"
//а на выходе у него масив строк "translate(158.598,70.8661)","rotate(90)","translate(25.3701,-5.66929)"
//который уже потом я буду парсить на предмет типа трансформации и её параметров
function getSvgTransfStrArr (s: string): Array<string>{
    const aTrs = ['translate','rotate','scale'];//массив ключевых слов трансформаций  (ещё есть matrix)
    var res: Array<string> = [];//тут будут строки трансформаций (потом их разделю на тип и параметры (которые в скобках))
    if (s === null) return res;
    var j = aTrs.length;//я учитываю Три команды трансформации
    while (j !==0) {//найду вхождения каждой команды так как их может быть несколько
            j--;
        var target = aTrs[j]; // цель поиска
        var pos = -1;
        while ((pos = s.indexOf(target, pos + 1)) !== -1) {
            var ts = s.slice(pos, s.indexOf(')',pos+target.length)+1);//команды трансформации закрываются скобкой ")"
            res.push(ts);
        }
    }
    return res;
}
        
class TSvgTransformation {
    dX     = 0; //смещение по Х
    dY     = 0; //смещение по Y
    angle  = 0;//угол поворота осей
    sX     = 1; //масштаб по Х
    sY     = 1;//масштаб по Y			
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
function getTransformation (s: string, 
                                dX: number, //смещение по Х
                                dY: number, //смещение по Y
                                angle: number,//угол поворота осей
                                sX: number, //масштаб по Х
                                sY: number//масштаб по Y)
                                            ): TSvgTransformation
{
    var result:TSvgTransformation = {dX, dY, angle, sX, sY};
    if (s !== null) {
        var aTrStrList: Array<string> = getSvgTransfStrArr(s);//получу массив строк трансформаций
        var a = getSvgTransfList(aTrStrList);
        var i = a.length;
        while (i !==0) {
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
function getParentsList (element: any){
    var result: Array<any> = [];
    (function recurse(currentNode) {
        if (currentNode.parentElement.tagName !== 'svg') {
            //добавление в список
            result.splice(0,0,currentNode.parentElement);
            recurse(currentNode.parentElement);//запускаю рекурсию
        }
        else //null у элемента нет родителя
                return;//поэтому выход
    })(element);        
    return result;
}

//e - элемент который необходимо добавить в дерево
//treeNode - начальная ветка дерева, куда надо добавить элементы из массива 
function addElemetsToTree(element: any, treeNode: TNode) {
    //return;
    var p = element.parentElement;
    try {
        (function recurse(currentNode) {
            var i = currentNode.children.length;
            while (i !==0) {
                i--;
                if (currentNode.children[i].data === p) {
                    //найдена нода, родитель заданного элемента
                    //проверить, есть ли в её детях заданный элемент (чтобы не добавлять повторно)
                    if (currentNode.children.indexOf(element) === -1) {
                        //такого элемента нет, добавить
                        const n:TNode = new TNode (element);
                        n.parent = currentNode.children[i];
                        currentNode.children[i].children.push(n);
                        //как выйти из циков и рекурсии?
                        throw new Error ("function addElemetsToTree parent is founded, element added");
                        }
                    //надо выйти из цикла и рекурсии
                    throw new Error ("function addElemetsToTree parent is founded, element exsisted");
                }
                recurse(currentNode.children[i]);
            }
        })(treeNode);
    }
    catch (error){
        return;
    }        
}

/*
function i2Space(i: number) {
    var s = '';
    while (i !==0){
        s +='-';
        i--;
    }
    return s;
}
*/
//обход дерева с целью вычисления смещений
//от корня дерева, применяет к каждому узлу translate, rotate, scale
//к узлам добавляет вычесленную для него трансформацию
//и какой по счёту от корня
function getTransform(treeNode: TNode){
    (function recurse(currentNode: any) {
        var s: string='';
        var t: TSvgTransformation;
        try {
            s = currentNode.data.getAttribute('transform');
            throw new Error('getTransform.Error');
        }
        catch(error) {
        }
        //трансформации родителя
        var p: TSvgTransformation;
        try {
            p = currentNode.parent.t;
        }
        catch(error) {
            p = new TSvgTransformation();
        }
        t = getTransformation (s, p.dX, p.dY,//чтобы не изменять parentTransform
                                p.angle,
                                p.sX, p.sY);
        currentNode.t = t;
        var i = currentNode.children.length;
        while (i !==0) {
            i--;              
            recurse(currentNode.children[i]);
        }
    })(treeNode);
}

//создание аватаров элементов
function createSvgAvatars(treeNode: TNode) {
    console.warn('createSvgAvatars');
    (function recurse(currentNode) {
        try {
            switch (currentNode.data.tagName) {
                case 'ellipse':	//<ellipse cx="14.1732" cy="104.882" rx="14.1732" ry="14.1732" class="st2"/
                        currentNode.data.coFigure = new TFigureEllipse (currentNode.data, currentNode.t!);
                        break;
                case 'path'://<path d="M0 119.06 L14.17 119.06" class="st1"/>
                        currentNode.data.coFigure = new TFigurePath (currentNode.data, currentNode.t!);
                        break;
                case 'rect'://<rect x="0" y="260.787" width="56.6929" height="11.3386" class="st1"/>
                        currentNode.data.coFigure = new TFigureRect (currentNode.data, currentNode.t!);
                        break;
                case 'text'://<text x="15.46" y="268.26" class="st16">WARNING</text>
                        currentNode.data.coFigure = new TFigureText (currentNode.data, currentNode.t!);
                        break;
            } 
            //console.log(i2Space(d)+currentNode.data.tagName+':',currentNode.data.coFigure);
        }
        catch (e){
        }
        var i = currentNode.children.length;
        while (i !==0) {
            i--;
            recurse(currentNode.children[i]);
        }
    })(treeNode);
}

    
//метод отрисовки полученных Аватаров на заданном Canvas (cnv)
function drawAvatars (cnv: any, treeNode: TNode) {
    const scr: any = document.getElementById(cnv);
    if (scr !== null) {
        const ctx = scr.getContext('2d');
            (function recurse(currentNode) {
                try {
                currentNode.data.coFigure.draw(ctx);
                }
                catch (error){
                }
                var i: number = currentNode.children.length;
                while (i !==0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
            })(treeNode);	
    }		
}
    
//метод отрисовки Границ Аватаров на заданном Canvas (cnv)
function drawAvatarsBounds (cnv: any, treeNode: TNode) {
    const scr: any = document.getElementById(cnv);
    if (scr !== null) {
        const ctx: any = scr.getContext('2d');
            (function recurse(currentNode) {
                try {
                currentNode.data.coFigure.drawBound(ctx);
                }
                catch (e){
                }
                var i: number = currentNode.children.length;
                while (i !==0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
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
//function addGroupBounds (treeNode: TNode) {
//
//}

export class TElementAndAttrValue {
    element: any;
    tag: string = '';
}

export class TElementAttrObject {
    tag: string = '';
    model: string = 'text';
}

export class TSVGTemplateElement {
    element: any;
    attr: TElementAttrObject = new TElementAttrObject();
}

export class TSVGGroups {
    private tree: (TTree | undefined) = undefined;

    constructor(id: string) {
        this.getGroupsArr(id);
    }

    private getGroupsArr (id: string) {      
        const s: any = document.getElementById(id);//получаю доступ к DOM SVG
        const gs: any = s.contentDocument.children[0].getElementsByTagName('*');//найду все элементы g
        //к сожалению такой поиск не учитывает вложенности, придётся определять её через parentElement
        //при этом выяснилось, что верхний уровень это объект "svg" а следующий "null"
        //вывод: достиг объекта svg значит закончить поиск.
        this.tree = new TTree('svg');//создание корня (data = 'svg', parent = null, children = [пусто])
        var i = 0; ;//кол-во найденных тегов
        if (gs.length !== 0) {
            i = gs.length;
            while (i !== 0) {
                i--;
                //мне интересны объекты g, text, path, rect, ellipse
                if (['g', 'text', 'path', 'rect', 'ellipse'].indexOf(gs[i].tagName) === -1) {
                    continue;
                }
                //выделены только требуемые элементы
                var p = getParentsList (gs[i]);
                //console.warn(p);
                //Теперь просканировать tree от корня, если родителя нет, до добавлять его
                addArrToTree(p, this.tree._root);
            }       
        }
        //теперь добавить к родителям их потомков - графические элементы
        i = 0; ;//
        if (gs.length !== 0) {
            i = gs.length;
            while (i !== 0) {
                i--;
                //теперь мне интересны объекты text, path, rect, ellipse
                if (['text', 'path', 'rect', 'ellipse'].indexOf(gs[i].tagName) === -1) {
                    continue;
                }
                //выделены только требуемые элементы
                //Теперь просканировать tree от корня, если добавить родителям элементов
                addElemetsToTree(gs[i], this.tree._root);
            }       
        }
        //теперь пройти по дереву и узнать и добавить трансформации для каждого элемента
        getTransform(this.tree._root);
    }
    
    public createAvatar(){
        //опять пройтись по дереву в поиске графических элементов (как правило они на концах веток)
        //и наделить их свойствами графичесих объектов для ускорения отображения
        if (this.tree !== undefined)
            createSvgAvatars(this.tree._root);
    }

    //для этого нужен Canvas на который будет отображаться Аватар
    public drawAvatarsAndBounds(cnv: any) {
        if (this.tree !== undefined) {
        //теперь пройтись по дереву и построить аватары для групп в которых вложены граф.элементы
            drawAvatars(cnv, this.tree._root); 
            //нарисовать границы
            drawAvatarsBounds (cnv, this.tree._root);
        }
    }

    //возвращает элемент имеющий аттриубут attr, который имеет значение value
    //вообще я ищу svg контейнеры с аттрибутом 'data-id'
    //Продолжить!!!!!
    public getElementByAttrValue (attr: string, value: string): any {
        console.warn(`TSVGGroups.getElementByAttrValue: ${attr} : ${value}`);//
        if (!this.tree) return undefined;
        const treeNode: TNode = this.tree._root;
        var s: string = '';
        try {
            (function recurse(currentNode) {
                if (currentNode.data.getAttribute !== undefined ) {  
                    if ((s = currentNode.data.getAttribute(attr)) === value) {
                        console.warn('attr:',s);
                        throw(currentNode.data);//Группа-Владелец найдена
                    }
                }
                var i: number = currentNode.children.length;
                while (i !==0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
                })(treeNode);
        }
        catch (error){
            if ('stack' in error) {//произошло исключение
                console.warn('TSVGGroups.getElementByAttrValue',error.stack);//это ошибка
                return null;
            }
            else {//группа-владелец найдена
                    console.warn(error);
                    return(error);
            }
        }
    }

    //сканирует элементы SVG, возвращает массив элементов
    //имеющих заданый аттрибут attr, и его значение для каждого элемента
    public getElementsAndValuesByAttr (attr: string): Array<TElementAndAttrValue>{
        if (!this.tree) return [];
        const treeNode: TNode = this.tree._root;
        var tag: string = '';
        var result: Array<TElementAndAttrValue> = [];
        try {
            (function recurse(currentNode) {
                const element: any = currentNode.data;
                if (element.getAttribute !== undefined ) {  
                    if ((tag = element.getAttribute(attr))) {//ответ не пустая строка
                        let e: TElementAndAttrValue = { element, tag};
                        result.push(e);
                    }
                }
                var i: number = currentNode.children.length;
                while (i !==0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
                })(treeNode);
        }
        catch (error){
                console.warn('TSVGGroups.getElementsAndValuesByAttr',error);//это ошибка
                return [];
        }
        return result;
    }

    //метод. проверка нахождения точки с заданными координатами XY внутри Границы Аватара
    //возвращает объект группы входящуу в координаты, или null
    public inBound (x: number, y: number, tolerance: number) {
        if (!this.tree) return undefined;
        var treeNode: TNode = this.tree._root;
        var element: any = null;
        //1) найти элемент которому пренадлежат координаты x,y
        try {
            (function recurse(currentNode) {
                if (currentNode.data.hasOwnProperty('coFigure')) {
                    if (currentNode.data.coFigure.inBound(x, y, tolerance)) {
                        throw(currentNode);
                    }
                }
                var i: number = currentNode.children.length;
                while (i !==0) {
                    i--;
                    recurse(currentNode.children[i]);
                }
            })(treeNode);
        }
        catch(error){
            //проверю что это не ошибка, а именно объект
            //if (!e.hasOwnProperty('coFigure')) {
                //да, это именно найденный элемент;
                element = error;
            //}
        }
        if (element == null)
            return null; //ничего не найдено;
        //2) найти группу (имеющую тег data-id) в которую вложен найденный элемент
        treeNode = element;
        //console.warn(element);
        try {
            (function recurse(currentNode) {
                if (currentNode.parent !== null) {
                    if ('attributes' in currentNode.parent.data){
                        var s = '';
                        if ((s = currentNode.parent.data.getAttribute('data-id')) !== null) {
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

}