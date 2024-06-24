// Библиотека полезных функций

export function changeSingleQuotesToDouble (attr: string): any {
    // eslint-disable-next-line no-useless-escape
    const str: any = [].map.call(attr, c => c !== '\'' ? c : '\"').join('');
    const res = JSON.parse(str);
    return res;
  }
// Получение содержимого файла (синхронно)
// fileName - название файла (на сервере) с указанием пути
// Возвращает:
// 1) строку с содержимым файла
// 2) undefine - если файл по какой-то причине не загрузился
export async function getTextByURL (url: string): Promise<string> {
    try {
        const res = await fetch(url);
        const text = await res.text();
        return text;
    } catch (e) {
        console.log(`getObjectURL: ${url}`, e);
        return '';
    }
}

export async function getObjectURL (url: string) {
    const text: string = await getTextByURL(url);
    const DataURL = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(text);
    return DataURL;
}

// преобоазует строку в XML-объект (в зависимости от ключа)
// если key = 'image/svg+xml' получаю SVG-объект
export function strToXML (source: string, key: any): any {
    const parser = new DOMParser();
    const content: any = parser.parseFromString(source, key);
    return content; // да, документ получил. Можно парсить
};
