import {strToXML, getSyncTextFileContent} from './utils'
//объекты контента SVG файлов
//Короче, создаётся svg-объект, готовый для вставки в любой другой svg.
//Но лучше, чтобы  создавался массив (словарь) ссылок на созданные таким путём объекты-изображения название:svg-объект
//тогда я буду просто обращаться к этому массиву за объектом (передавая название картинки и путь до неё)
//если объекта нет, он заполняется (если есть по указанному пути) и возвращается ответом на мой запрос
//со временем, все картинки будут набиты в словарь и работа с ними пойдёт быстрее.
//При загрузке картинки, производтся переименование стилей, чтобы исключить конфлик стилей с общим svg и другими вставками в него
//как в таблице стилей, так и вообще по тексту svg
export class TSvgContents {
    private aContents: Map<string, any> = new Map();//массив картинок с их названиями

    public getImg (key: string, path: string = ''): any{//key-название картинки, path-имя файла с путём до неё
        const content: any = this.aContents.get(key);
        if (content) return content;
        //раз сюда пришёл, значит в хранилище нет искомого ключа
        //картинки нет, загрузить (со всеми преобразованиями стилей) и вернуть.
        //добавить в хранилище ключ (key-название картинки) и объект svg-изображения
        //если по указанному пути нет картинки, то вернуть null
        var svg: any = this.loadImg(key, path);
        if (svg !== undefined) {
            //svg = this.renameCSS(key, svg);//делаю названия стилей уникальными
            this.aContents.set(key, svg);//вставляю в хранилище
            return svg;
        }
    }

    private loadImg (key: string, path: string): any | undefined{
        //надо менять название стилей именно в CDATA так как хоть и названия 
        //стилей в элементах поменялись, но в CDATA они остались
        //1) загрузил указанный имидж
        var xmls: string = getSyncTextFileContent(path);
        var content: any = strToXML(xmls, 'image/svg+xml');
        //2) получил из него svg-объект
        var svg: any = content.querySelector('svg');
        if (!svg) return undefined;
        //Создаю массив элементов имеющих свойство class (т.е. со стилями)
        var aec: Array<any> = [];//массив элементов имеющих стиль
        var styles:Array<string>=[];//массив названий стилей
        //перебираю массив в поисках элементов имеющих свойство "class"
        for (let element of content.all) {
            if (element.classList.length) {//у элементов имеющих аттрибут "class" classList.length не НОЛЬ
                aec.push(element);//нашёл, добавляю в массив
                if (styles.indexOf(element.classList[0]) == -1)//если названия стиля ещё нет в массиве
                    styles.push(element.classList[0]); //добавить его туда                
            }
        }
        //и так на выходе у меня:
        //  aec[] - массив элементов имеющих стили
        //  styles[] - массив названий стилей
        //Теперь возьму CDATA из SVG
        var cdata: string = svg.querySelector('style').childNodes[1].nodeValue;
        //И начну менять стили
        styles.forEach((style: string) => {
            let newClassName: string = `${style}_${key}`
            aec.forEach((element: any) => {
                if (element.classList[0] === style)
                    element.setAttribute('class', newClassName) 
            })
            cdata = cdata.replace(style,newClassName);
        })
        svg.querySelector('style').childNodes[1].nodeValue = cdata;
        return svg;
    }

    //Перед использованием загруженных SVG переименовывает название стилей чтобы они стали уникальными
    //Название стиля состоит из Key_stXXX
    private renameCSS (key: string, content: any){
        var stSheet = content.attributes;
        //console.log(stSheet);
        //var crs = stSheet.cssRules;
        //console.log(crs);
        //return content;
    }
}
