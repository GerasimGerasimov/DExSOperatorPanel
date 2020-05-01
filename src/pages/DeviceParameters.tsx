//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'
import {TParameter } from '../lib/devicepagecontent/devicepagecontent';
import {deviceStore} from '../store/devices/devices'
import { observer } from 'mobx-react';
import { autorun, observable, extendObservable } from 'mobx';

@observer
export default class DeviceParameters extends Component {

  @observable private parameters  = new Map<string, TParameter>();

  constructor (props: any){
    super(props)
    const a: Array<TParameter> = props.location.state.deviceParameters || {};
    a.forEach((item:TParameter)=>{
        this.parameters.set(`${item.section}-${item.name}`, item);
    })
    autorun(()=>{this.update(deviceStore.changeTime)})
  }

  private getParameters(tagPath: string): string {
    const data: string = deviceStore.getTagData(tagPath);
    return data;
  }

  private update(changed: any){
    this.parameters.forEach((item: TParameter) => {
        item.value = this.getParameters(item.getTagPath('U1'));
    })
  }

  render() {
    return(
      <>
        <h1>Settings</h1>
          <div className="text-left">
              <ul>{
                  Array.from(this.parameters.entries(), ([key, item]) => {
                    return (
                      <li key={key}>
                          {item.value}
                      </li>
                    )}
                  )}
              </ul>
          </div>
      </>
    )
  }
}