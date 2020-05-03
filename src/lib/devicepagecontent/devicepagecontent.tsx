import { getArrFromIniString, loadLinesFromBuffer, getArrFromDelimitedStr} from "../util/misc";
import { observer } from "mobx-react";
import { observable } from "mobx";

export class TDevicePagesContent {
  private pagesMap: Map<string, TDevicePageContent>;

  constructor(pages:Array<string>) {
    this.pagesMap = new Map ([... this.getPagesMap(pages)])
  }

  get Values () {
    return this.pagesMap.values();
  }

  private getPagesMap(pages:Array<string>): Map<string, TDevicePageContent> {
    const res: Map<string, TDevicePageContent> = new Map<string, TDevicePageContent>();
    this.parsePagesArrayToMap(pages, res);
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
    const args:Array<string> = getArrFromIniString(inistr)
    const res: TDevicePageContent = new TDevicePageContent();
    let paramstr: string;
    [res.name, res.title, paramstr] = args;
    let a: Array<string> = getArrFromDelimitedStr(paramstr, ',');
    a.forEach((item: string) => {
      const [section, name] = getArrFromDelimitedStr(item, ':');
      const p: TParameter = new TParameter(name, section);
      res.parameters.push(p);
    })

    //TODO распарсить в списки RAM/FLASH/CD
    //превратить в теги U1>U1:RAM>data>Iexc
    return res;
  }

}

export class TDevicePageContent {
    name:string = '';
    title: string = '';
    parameters: Array<TParameter> = [];
}

export class TParameter {
  name: string = '';
  section: string = '';
  value: string = ''

  constructor (name: string, section: string) {
    this.name = name;
    this.section = section;
  }

  //U1>U1:RAM>data>Iexc
  public getTagPath(u: string): string {
    return `${u}>${u}:${this.section}>data>${this.name}`
  }
}