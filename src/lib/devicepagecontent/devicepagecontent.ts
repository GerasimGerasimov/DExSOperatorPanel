import { getArrFromIniString, getArrFromDelimitedStr } from "../util/commonmisc";

export class TDevicePagesContent {
  private pagesMap: Map<string, TDevicePageContent>;

  constructor (pages:Array<string>) {
    this.pagesMap = new Map([...this.getPagesMap(pages)]);
  }

  get Values () {
    return this.pagesMap.values();
  }

  private getPagesMap (pages:Array<string>): Map<string, TDevicePageContent> {
    const res: Map<string, TDevicePageContent> = new Map<string, TDevicePageContent>();
    this.parsePagesArrayToMap(pages, res);
    return res;
  }

  private parsePagesArrayToMap (source: Array<string>, dest: Map<any, any>) {
    source.forEach((item: string) => {
        if (item[0] !== ';') { // если не комментарий
            const page = this.getPageContent(item); // получаю объект параметра
            const key: string = page.name; // до добавляю в карту
            dest.set(key, page);
          }
    })
  }

  private getPageContent (inistr:string): TDevicePageContent {
    const args: Array<string> = getArrFromIniString(inistr)
    const res: TDevicePageContent = new TDevicePageContent();
    let paramstr: string;
    [res.name, res.title, paramstr] = args;
    const a: Array<string> = getArrFromDelimitedStr(paramstr, ',');
    a.forEach((item: string) => {
      const [section, name] = getArrFromDelimitedStr(item, ':');
      const p: TParameter = new TParameter(name, section);
      res.parameters.push(p);
    })

    // TODO распарсить в списки RAM/FLASH/CD
    // превратить в теги U1>U1:RAM>data>Iexc
    return res;
  }
}

export class TDevicePageContent {
    name:string = '';
    title: string = '';
    parameters: Array<TParameter> = [];
}

export class TParameter {
  tag: string = '' ;// тэг параметра U1/RAM/Iexc
  name: string = '';
  section: string = '';
  value: string = '';
  type: string = 'TFloat'; // на TFloat - включается цифровая клавиатура
  msu: string = '' ; // единицы измерения

  constructor (name: string, section: string) {
    this.name = name;
    this.section = section;
  }

  // U1/U1:RAM/Iexc
  public getTagPath (position: string): string {
    return `${position}/${this.section}/${this.name}`
  }
}

export function getTags (position: string, parameters: Array<TParameter>) :Array<string> {
  return parameters.map((item: TParameter) => item.getTagPath(position))
}
