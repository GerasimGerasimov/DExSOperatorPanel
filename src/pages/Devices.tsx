import React, {Component} from 'react'
import {NavLink } from 'react-router-dom';

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
    this.setMapFromDevices(this.PagesMap, DEVICE_PAGES);
  }

  private setMapFromDevices(PagesMap:Map<string, TPageContent>, Devices: any) {
    for (let key in Devices) {
      let pc: TPageContent = {
        name:key,
        title: Devices[key].title,
        parameters:[]
      }
      PagesMap.set(key, pc)
    }
  }

  render() {
    const listItems = Array.from(this.PagesMap.values(),
      (item: TPageContent) => {
          const {name, title} = item;
          const url: string = `/devices/${name.toLowerCase()}/`;
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

const DEVICE_PAGES = {
  DExS: {
    title: "Регулятор возбуждения"
  },
  iCM: {
    title: "Коммуникационный модуль"
  },
  ThCNT: {
    title: "Модуль термоконтроля"
  }
}