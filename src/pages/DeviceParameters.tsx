//https://stackoverrun.com/ru/q/11548996
import React, {Component} from 'react'
import {TParameter } from '../lib/devicepagecontent/devicepagecontent';
import {deviceStore} from '../store/devices/devices'
import { observer } from 'mobx-react';
import { autorun, observable, extendObservable } from 'mobx';

class TValuedParameter extends TParameter {
    @observable public value: string = '';
    constructor(name: string, section: string) {
        super(name, section)
    }
}

@observer
export default class DeviceParameters extends Component {

  @observable private parameters  = new Map<string, string>();
  private a: Array<TParameter> = [];

  constructor (props: any){
    super(props)
    this.a = props.location.state.deviceParameters || {};
    this.a.forEach((item:TParameter)=>{
        this.parameters.set(item.name, '');
    })
    autorun(()=>{this.update(deviceStore.changeTime)})
  }

  private getParameters(tagPath: string): string {
    const data: string = deviceStore.getTagData(tagPath);
    return data;
  }

  private update(changed: any){
    //console.log(changed);
    this.a.forEach((item: TParameter) => {
        item.title = this.getParameters(item.getTagPath('U1'));
        this.parameters.set(item.name, item.title)
        //extendObservable(item, {title: this.getParameters(item.getTagPath('U1'))})
        //console.log(`${item.name}: ${item.value}`)
    })
  }

  getChangeTime(change: any): string {
    return '';
  }

  render() {
    console.log('render');

    return(
      <>
        <h1>Settings</h1>
          <div className="text-left">
              <ul>{
                  Array.from(this.parameters.entries(), ([key, item]) => {
                    return (
                      <li
                          key={`${key}`}
                          >
                          {`${item}`}
                      </li>
                    )}
                  )}
              </ul>
          </div>
      </>
    )
  }
}