//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import { TDevicePageContent, TDevicePagesContent } from '../../lib/devicepagecontent/devicepagecontent';
import {devicesInfoStore} from '../../store/devices/devicesinfo'

export default class DevicesRouter extends Component {

  private PagesMap: TDevicePagesContent;
  private history: any = {};
  private position: string = '';

  constructor (props: any){
    super(props)
    this.history = props.history || {}
    this.position = props.location.state.position || '';
    const pages: any = devicesInfoStore.DevicesInfo.get(this.position)?.Pages
    this.PagesMap = new TDevicePagesContent(pages);
  }

  render() {
    const listItems = Array.from(this.PagesMap.Values,
      (item: TDevicePageContent) => {
          const {name, title} = item;
          const url: string = `/devices/${this.position}/${name.toLowerCase()}/`;
          return (
            <Link
                className="nav-link"
                key={name}
                to={{
                  pathname:`${url}`,
                  state: {
                    deviceParameters: item.parameters
                  }
                }}
                >
                {title}
            </Link>
          )
    });

    return(
      <>
        <h1>Settings</h1>
        <div className="text-left">
          <React.Fragment>
            <ul>{listItems}</ul>
          </React.Fragment>
        </div>
      </>
    )
  }
}