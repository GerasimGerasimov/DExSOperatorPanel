import React, {Component} from 'react'
import { Switch, Route, NavLink } from 'react-router-dom';
import DeviceSettings from './DeviceSettings';

class TPageContent {
  name:string = '';
  title: string = '';
  parameters: Array<string> = [];
}

export default class Devices extends Component {

  private PagesMap: Map<string, TPageContent>;

  constructor (props: any){
    super(props)
    this.PagesMap = new Map<string, TPageContent>();
    const listItems:Array<string> = this.loadLinesFromBuffer(DEVICE_PAGES);
    this.parsePagesArrayToMap(listItems);
    const Items = Array.from(this.PagesMap, (item: any) => item[1].title);
    console.log(Items);
  }

  private gerArrFromIniString(ini: string): Array<string> {
    let res:Array<string>=[];
    let i = ini.indexOf('=');
    res.push(ini.slice(0,i));// pn
    const _ini:Array<string> = ini.slice(i+1).split(/[/]/);// получил массив
    _ini.splice(_ini.length-1,1);
    res = res.concat(_ini);
    return res;
  }

  private getPageContent(iniStr:string): TPageContent {
    const args:Array<string> = this.gerArrFromIniString(iniStr)
    const res: TPageContent = new TPageContent();
    res.name = args[0];
    res.title = args[1];
    //TODO распарсить в списки RAM/FLASH/CD
    //превратить в теги U1>U1:RAM>data>Iexc
    //res.parameters = argStr[2];
    return res;
  }

  private parsePagesArrayToMap(PagesArray: Array<string>) {
    PagesArray.forEach((item: string) => { 
        if (item[0] !== ';') {//если не комментарий
            let page = this.getPageContent(item);// получаю объект параметра
                let key: string = page.name;//до добавляю в карту
                this.PagesMap.set(key, page);
            }
    })
  }

  private loadLinesFromBuffer(buff:any): Array<string>{      
    return buff.toString().split("\n").
                    map((value: string): string => value.trim()).
                        filter(String);
  }

  render() {
    const listItems = Array.from(this.PagesMap.values(),
      (item: TPageContent) => {
          const {name, title} = item;
          const url: string = `/devsettings/${name.toLowerCase()}/`;
          return (
            <NavLink
                className="nav-link"
                key={name}
                to={{pathname:`${url}`}}
                >
                {`${name} ${title}`}
            </NavLink>
          )
    });

    return(
      <>
        <h1>Devices</h1>
        <div className="text-left">
            <React.Fragment>
                <ul>{listItems}</ul>
            </React.Fragment>
        </div>
      </>
    )
  }
}

const DEVICE_PAGES: string = 
`DExS=Регулятор возбуждения/
iCM=Коммуникационный модуль/
ThCNT=Модуль термоконтроля/
`