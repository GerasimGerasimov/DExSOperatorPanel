//читает конфиги, заполняет объекты данными
//хорошая статья про JSON:
//https://itchief.ru/lessons/javascript/javascript-json

var TLoadCfs = function (file) {
    this.file = file;
}

//парсит JSON в объект. На выходе объект;
TLoadCfs.prototype.JSON2Obj = function (s) {
    console.log('TLoadCfs.prototype.JSON2Obj');
    var doc = JSON.parse(s);//распарсил ;-) 
    console.log(doc);
}

//Загружает JSON файл
TLoadCfs.prototype.loadJSONFile = function () {
    console.log('TFigure.prototype.loadJSONFile');
    console.log(this.file);
    var self = this;//this для передачи в callback

    //вложенная функция, вызывается по мере загрузки JSON
    //если успешно файл загружен, то вызывает JSON2Obj
    function callback () {
        console.log(req.statusText);
        if (req.readyState != 4) return;
        if (req.status !=200) {//ошибка
            console.log(req.status+':'+req.statusText);
        }
        else {//получил JSON, можно парсить
            var s = req.responseText; 
            console.log(s);
            self.JSON2Obj(s);
        }
    }

    var req = new XMLHttpRequest();
        req.open("GET", this.file, true);//true - делаю aсихронный запрос к http-серверу 
        req.onreadystatechange = callback;
        req.send();
}