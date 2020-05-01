//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'
import {TParameter } from '../lib/devicepagecontent/devicepagecontent';
import {deviceStore} from '../store/devices/devices'
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

@observer
export default class DeviceParameters extends Component {

  private parameters : Array<TParameter>;
  private history: any = {};

  constructor (props: any){
    super(props)
    this.history = props.history || {}
    const devname: string = props.match.params.devname || '';
    this.parameters = props.location.state.deviceParameters || {};
    autorun(()=>{this.update(deviceStore.changeTime)})
  }

  private getParameters(tagPath: string): string {
    const data: string = deviceStore.getTagData(tagPath);
    return data;
  }

  private update(changed: any){
    console.log(changed)
  }

  render() {

    const listItems = this.parameters.map((item: TParameter) => {
          const {section, name} = item;
          return (
            <li
                key={`${section}:${name}`}
                >
                {`${name}: ${this.getParameters(item.getTagPath('U1'))}`}
            </li>
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