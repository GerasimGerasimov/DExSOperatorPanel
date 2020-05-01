import { gerArrFromIniString, loadLinesFromBuffer } from "../util/misc";

export class TDevicePagesContent {
  private pagesMap: Map<string, TDevicePageContent>;

  constructor(pages:string) {
    this.pagesMap = new Map ([... this.getPagesMap(pages)])
  }

  get Values () {
    return this.pagesMap.values();
  }

  private getPagesMap(pages:string): Map<string, TDevicePageContent> {
    const res: Map<string, TDevicePageContent> = new Map<string, TDevicePageContent>();
    const items:Array<string> = loadLinesFromBuffer(pages);
    this.parsePagesArrayToMap(items, res);
    return res;
  }

  private parsePagesArrayToMap(source: Array<string>, dest: Map<any, any>) {
    source.forEach((item: string) => { 
        if (item[0] !== ';') {//если не комментарий
            let page = this.getPageContent(item);// получаю объект параметра
                let key: string = page.name;//до добавляю в карту
                dest.set(key, page);
            }
    })
  }

  private getPageContent(inistr:string): TDevicePageContent {
    const args:Array<string> = gerArrFromIniString(inistr)
    const res: TDevicePageContent = new TDevicePageContent();
    res.name = args[0];
    res.title = args[1];
    //TODO распарсить в списки RAM/FLASH/CD
    //превратить в теги U1>U1:RAM>data>Iexc
    //res.parameters = argStr[2];
    return res;
  }

}

export class TDevicePageContent {
    name:string = '';
    title: string = '';
    parameters: Array<string> = [];
}