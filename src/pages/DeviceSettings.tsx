import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {observable, autorun} from 'mobx'
import {devicesValueStore, TDevicesValueStore} from '../store/devices/devices'

class TPageContent {
  name:string = '';
  title: string = '';
  parameters: Array<string> = [];
}

@observer
export default class DeviceSettings extends Component {

  private PagesMap: Map<string, TPageContent>;

  constructor (props: any){
    super(props)
    this.PagesMap = new Map<string, TPageContent>();
    const DEVICE_PAGES:Array<string> = [];
    const listItems:Array<string> = this.loadLinesFromBuffer(DEVICE_PAGES);
    this.parsePagesArrayToMap(listItems);
    const Items = Array.from(this.PagesMap, (item: any) => item[1].title);
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
    const listItems = Array.from(this.PagesMap.values(), (item: TPageContent) =>
      <li key={item.name}>{item.title}</li>
    );

    return(
      <>
        <h1>Settings</h1>
        <button type="button" className="btn btn-primary ml-1">
          <span className="badge badge-light bg-warning ml-1">
            {devicesValueStore.count}
          </span>
        </button>
        <div className="text-left">
          <ul>{listItems}</ul>
        </div>
      </>
    )
  }
}