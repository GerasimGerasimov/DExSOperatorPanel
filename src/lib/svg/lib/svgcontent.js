//объекты контента SVG файлов
//Короче, создаётся svg-объект, готовый для вставки в любой другой svg.
//Но лучше, чтобы  создавался массив (словарь) ссылок на созданные таким путём объекты-изображения название:svg-объект
//тогда я буду просто обращаться к этому массиву за объектом (передавая название картинки и путь до неё)
//если объекта нет, он заполняется (если есть по указанному пути) и возвращается ответом на мой запрос
//со временем, все картинки будут набиты в словарь и работа с ними пойдёт быстрее.
//При загрузке картинки, производтся переименование стилей, чтобы исключить конфлик стилей с общим svg и другими вставками в него
//как в таблице стилей, так и вообще по тексту svg
var TSvgContents = function () {
    this.aContents = [];//массив картинок с их названиями

    this.getImg = function (key, path){//key-название картинки, path-имя файла с путём до неё
        var i = this.aContents.length;
        while (i != 0) {
            i--;
            if (this.aContents[i].key == key){
                return this.aContents[i].svg;
            }
        }
        //раз сюда пришёл, значит в массиве нет искомого ключа
        //картинки нет, загрузить (со всеми преобразованиями стилей) и вернуть.
        //добавить в массив ключ (key-название картинки) и объект svg-изображения
        //если по указанному пути нет картинки, то вернуть null
        var svg = this.loadImg(key, path);
        if (svg != null) {
            svg = this.renameCSS(key, svg);//делаю названия стилей уникальными
            this.aContents.push({key, svg});//вставляю в массив
            return svg;
        }
    }

    this.loadImg = function (key, path){
        //надо менять название стилей именно в CDATA так как хоть и названия 
        //стилей в элементах поменялись, но в CDATA они остались
        //1) загрузил указанный имидж
        var xmls = getSyncTextFileContent(path);
        var content = strToXML(xmls, 'image/svg+xml');
        //2) получил из него svg-объект
        var svg = content.querySelector('svg');
        //Создаю массив элементов имеющих свойство class (т.е. со стилями)
        var aec = [];//массив элементов имеющих стиль
        var styles=[];//массив названий стилей
        var i = content.all.length;//кол-во элементов в XML
        //перебираю массив в поисках элементов имеющих свойство "class"
        while (i--) {
            if (content.all[i].classList.length){//у элементов имеющих аттрибут "class" classList.length не НОЛЬ
                aec.push(content.all[i]);//нашёл, добавляю в массив
                if (styles.indexOf(content.all[i].classList[0]) == -1)//если названия стиля ещё нет в массиве
                    styles.push(content.all[i].classList[0]); //добавить его туда
            }
        }
        //и так на выходе у меня:
        //  aec[] - массив элементов имеющих стили
        //  styles[] - массив названий стилей
        //Теперь возьму CDATA из SVG
        var cdata = svg.querySelector('style').childNodes[1].nodeValue;
        //И начну менять стили
        i = styles.length;
        while (i--){
            var newClassName = styles[i]+'_'+key;
            var j = aec.length;
            while (j--){
                if (aec[j].classList[0] == styles[i])
                        aec[j].setAttribute('class', newClassName);
            }
            cdata = cdata.replace(styles[i],newClassName);
        }
        svg.querySelector('style').childNodes[1].nodeValue = cdata;
        console.log(svg);
        return svg;
    }

    /*
    this.loadImg = function (path){
        //надо менять название стилей именно в CDATA так как хоть и названия 
        //стилей в элементах поменялись, но в CDATA они остались
        //1) загрузил указанный имидж
        var xmls = getSyncTextFileContent(path);
        console.log(xmls);
        var content = strToXML(xmls, 'image/svg+xml');
        console.log(content.all[0].classList);
        var i = 0;
        //Создаю массив элементов имеющих свойство class (т.е. со стилями)
        var aec = [];
        i = content.all.length;//кол-во элементов в XML
        //перебираю массив в поисках элементов имеющих свойство "class"
        while (i !=0) {
            i--;
            if (content.all[i].classList.length != 0) {
                aec.push(content.all[i]);//нашёл, добавляю в массив
            }
        }
        //Добираюсь до таблици стилей SVG
        var s = '';
        var styles = null;
        i = content.all.length;//кол-во элементов в XML
        //перебираю массив в поисках объекта "style"
        while (i !=0) {
            i--;
            if (content.all[i].nodeName == 'style') {
                styles = content.all[i];//нашёл
                break;
            }
        }
        //теперь в styles объект со стилями всего SVG
        if (styles != null) {
            //выведу в консоль имена стилей:
            i = styles.sheet.cssRules.length;
            while (i !=0) {
                i--;
                s = styles.sheet.cssRules[i].selectorText;
                console.log(s);
            }
            //styles.sheet.rules[0].selectorText += '_new_name';
            //console.log(styles.sheet.rules);
        }
        //Теперь у меня есть
        //а) aec - массив элементов имеющих стили
        //б) styles - объект со списком стилей
        //  Далее:
        //  В цикле, выбираю стиль по имени (selectorText), создаю его NewName.
        //  B массиве aec нахожу элемент с таким же (старым) именем стиля aec[i].classList[0]
        //  и заменяю его новым менем стиля aec[i].classList[0] = NewName (так как aec содержит ссылки на элементы)
        //  то по факту название стиля меняется у самого элемента.
        //  Удаляю элемент из списка поиска aec
        //  Когда весь список aec пройден, переименовывается и сам стиль в styles 
        var newName = '';
        var cssText = ''
        var cdata='';
        if (styles != null) {
            i = styles.sheet.cssRules.length;
            while (i !=0) {
                i--;
                s = styles.sheet.cssRules[i].selectorText;//получил название стиля
                cssText = styles.sheet.cssRules[i].cssText;
                //если есть "." в названии -  удалить
                if (s[0] == '.') {
                    s = s.substring(1);
                }
                newName = s+'-img-path';//придумал новой имя, но вообще оно должно быть связано с названием файла
                var j = aec.length;
                while (j !=0 ) {
                    j--;
                    if (aec[j].classList[0] == s) {
                        var attr = aec[j].getAttribute('class');
                        //aec[j].className = newName;
                        aec[j].setAttribute('class', newName);
                        attr = aec[j].getAttribute('class');
                        aec.splice(j,1); 
                    }
                }
                //найду включение имени стиля в cssText и земеню его на новой название
                var c = cssText.indexOf(s);
                var z = '.'+newName+ cssText.substring(c+s.length);
                cdata += z+'\n';
                styles.sheet.cssRules[i].cssText = z;
            }           
        }
        
        //2) получил из него svg-объект
        var svg = content.querySelector('svg');
        var st = svg.querySelector('style');//[1];//'style';
        var cdt = st.childNodes[1].nodeValue;//st.querySelector('cdata-section');
        st.childNodes[1].nodeValue = cdata;
        console.log(svg);
        return svg;
    }
    */

    //Перед использованием загруженных SVG переименовывает название стилей чтобы они стали уникальными
    //Название стиля состоит из Key_stXXX
    this.renameCSS = function (key, content){
        console.log(content);
        var stSheet = content.attributes;
        console.log(stSheet);
        //var crs = stSheet.cssRules;
        //console.log(crs);
        return content;
    }
}
