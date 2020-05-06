//читает конфиги, заполняет объекты данными
var TLoadCfs = function (file) {
    this.file = file;
}

//парсит JSON в объект. На выходе объект;
TLoadCfs.prototype.JSON2Obj = function (s) {
    var doc = JSON.parse(s);//распарсил ;-) 
}

//Загружает JSON файл
TLoadCfs.prototype.loadJSONFile = function () {
    var self = this;//this для передачи в callback

    //вложенная функция, вызывается по мере загрузки JSON
    //если успешно файл загружен, то вызывает JSON2Obj
    function callback () {
        if (req.readyState != 4) return;
        if (req.status !=200) {//ошибка
        }
        else {//получил JSON, можно парсить
            var s = req.responseText; 
            self.JSON2Obj(s);
        }
    }

    var req = new XMLHttpRequest();
        req.open("GET", this.file, true);//true - делаю aсихронный запрос к http-серверу 
        req.onreadystatechange = callback;
        req.send();
}