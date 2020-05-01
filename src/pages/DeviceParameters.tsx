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
        //добавлю отслеживаемое свойство вручную, чтобы не засорять
        //класс декораторами Mobx
        //после extendObservable обязательно надо пользоваться get/set
        //для Map
        extendObservable(item, {value:''})
    })
    autorun(()=>{this.update(deviceStore.changeTime)})
  }

  private getParameters(tagPath: string): string {
    return deviceStore.getTagData(tagPath);
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