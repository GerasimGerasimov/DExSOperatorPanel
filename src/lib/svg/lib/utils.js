//Библиотека полезных функций

//Получение содержимого файла (синхронно)
//fileName - название файла (на сервере) с указанием пути
//Возвращает:
//  1) строку с содержимым файла 
//  2) undefine - если файл по какой-то причине не загрузился
function getSyncTextFileContent(fileName) {
    var s ='';
    var req = new XMLHttpRequest();
        req.open("GET", fileName, false);//false - делаю сихронный запрос к http-серверу 
        req.send();
        console.log(req.statusText);
        if (req.status !=200) {//ошибка
            console.log(req.status+':'+req.statusText);
            return undefined;
        }
        else {//получил содержимое файла в виде строки
            var s = req.responseText; 
            console.log(s);
            return s;//да, документ получил. Можно парсить
        }
}

//преобоазует строку в XML-объект (в зависимости от ключа)
//если key = 'image/svg+xml' получаю SVG-объект
function strToXML(source, key) {
    var parser = new DOMParser();
    var content = parser.parseFromString(source, key);
    console.log(content);
    return content;//да, документ получил. Можно парсить    
}