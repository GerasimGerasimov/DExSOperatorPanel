//Библиотека полезных функций

export function  changeSingleQuotesToDouble(attr: string): any {
    const str: any = [].map.call(attr, c => c!=='\''? c : '"').join('')
    let res = JSON.parse(str);
    return res;
  }
//Получение содержимого файла (синхронно)
//fileName - название файла (на сервере) с указанием пути
//Возвращает:
//  1) строку с содержимым файла 
//  2) undefine - если файл по какой-то причине не загрузился
export async function getTextByURL (url: string): Promise<string> {
    try {
        const res  = await fetch(url)
        const text = await res.text();
        return text;
    } catch (e) {
        console.log(`getObjectURL: ${url}`, e)
        return ''
    }
}

export async function getObjectURL(url: string) {
    const text: string = await getTextByURL(url)
    var DataURL = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(text);
    return DataURL;
}

//преобоазует строку в XML-объект (в зависимости от ключа)
//если key = 'image/svg+xml' получаю SVG-объект
export function strToXML(source: string, key: any): any {
    var parser = new DOMParser();
    var content: any = parser.parseFromString(source, key);
    return content;//да, документ получил. Можно парсить    
}

export function getKeyOfEnumByValue( Enum:any, Value: any, def?: string): string {
    let res: string = def || '';
    for ( const [key, value] of Object.entries(Enum)){
      if (value === Value) return key
    }
    return res;
  }