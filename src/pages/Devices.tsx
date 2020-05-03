import React, {Component} from 'react'
import {NavLink } from 'react-router-dom';
import { DEVICE_PAGES } from '../assets/datasets/deviceslist';
import {devicesInfoStore, TDeviceInfoRAW} from '../store/devices/devicesinfo'

class TPageTitle {
  name:string = '';
  title: string = '';
}

export default class Devices extends Component {

  private PagesMap: Map<string, TPageTitle>;

  constructor (props: any){
    super(props)
    this.PagesMap = new Map<string, TPageTitle>();
    this.setMapFromDevices(this.PagesMap, devicesInfoStore.DevicesInfo);
  }

  private setMapFromDevices(PagesMap:Map<string, TPageTitle>, Devices: Map<string, TDeviceInfoRAW>) {
    Devices.forEach((value, key) => {
      let DeviceInfo: TDeviceInfoRAW | undefined = new TDeviceInfoRAW();
          DeviceInfo = Devices.get(key);
      let pc: TPageTitle = {
        name:key,
        title: DeviceInfo?.Description || '',
      }
      PagesMap.set(key, pc)
    })
  }

  render() {
    const listItems = Array.from(this.PagesMap.values(),
      (item: TPageTitle) => {
          const {name, title} = item;
          const url: string = `/devices/${name.toLowerCase()}/`;
          return (
            <NavLink
                className="nav-link"
                key={name}
                to={{
                  pathname:`${url}`,
                  state: {
                    position: name
                  }
                }}
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