//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'
import { NavLink } from 'react-router-dom';
import { DEVICE_PAGES } from '../assets/datasets/devicespages';
import { TDevicePageContent, TDevicePagesContent } from '../lib/devicepagecontent/devicepagecontent';

export default class DevicesRouter extends Component {

  private PagesMap: TDevicePagesContent;
  private history: any = {};

  constructor (props: any){
    super(props)
    this.history = props.history || {}
    const devname: string = props.match.params.devname || '';
    const pages: any = DEVICE_PAGES;
    const devicePage = pages[devname] || ''
    this.PagesMap = new TDevicePagesContent(devicePage);
  }

  render() {
    const listItems = Array.from(this.PagesMap.Values,
      (item: TDevicePageContent) => {
          const {name, title} = item;
          const url: string = `/devices/${name.toLowerCase()}/`;
          return (
            <NavLink
                className="nav-link"
                key={name}
                to={{pathname:`${url}`}}
                >
                {title}
            </NavLink>
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