//Библиотека полезных функций

export function  changeSingleQuotesToDouble(attr: string): any {
    const str: any = [].map.call(attr, c => c!=='\''? c : '\"').join('')
    let res = JSON.parse(str);
    return res;
  }
//Получение содержимого файла (синхронно)
//fileName - название файла (на сервере) с указанием пути
//Возвращает:
//  1) строку с содержимым файла 
//  2) undefine - если файл по какой-то причине не загрузился
export function getSyncTextFileContent(fileName: string): string {
    var req = new XMLHttpRequest();
        req.open("GET", fileName, false);//false - делаю сихронный запрос к http-серверу 
        req.send();
        if (req.status !==200) {//ошибка
            return '';
        }
        else {//получил содержимое файла в виде строки
            return req.responseText;//да, документ получил. Можно парсить
        }
}

//преобоазует строку в XML-объект (в зависимости от ключа)
//если key = 'image/svg+xml' получаю SVG-объект
export function strToXML(source: string, key: any): any {
    var parser = new DOMParser();
    var content: any = parser.parseFromString(source, key);
    return content;//да, документ получил. Можно парсить    
}