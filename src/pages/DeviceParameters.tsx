import React, {Component} from 'react'
import {TParameter, getTags } from '../lib/devicepagecontent/devicepagecontent';
import { observer } from 'mobx-react';
import { autorun, extendObservable } from 'mobx';
import { devicesInfoStore } from '../store/devices/devicesinfo';

@observer
export default class DeviceParameters extends Component {

  private parameters  = new Map<string, TParameter>();
  private position: string = '';
  private handlers: Array<any> = [];

  constructor (props: any){
    super(props)
    const {position} = props.match.params || '';
    this.position = position;
    const a: Array<TParameter> = props.location.state.deviceParameters || {};
    a.forEach((item:TParameter)=>{
        this.parameters.set(`${item.section}-${item.name}`, item);
        extendObservable(item, {value:''})
    })
    this.createAutorunInitiatorValues();
  }

  private createAutorunInitiatorValues(){
    //запустить автообновление при изменении времени появления новой инфы
    const changes: Array<any> = devicesInfoStore.getObservableValues(
                                  getTags(this.position,
                                            Array.from(this.parameters.values())))
    this.handlers = changes.map(item => autorun(()=>{this.update(item.time)}))
  }

  private getParameters(tagPath: string): string {
    return devicesInfoStore.getTagValue(tagPath);
  }

  private update(changed: any){
    this.parameters.forEach((item: TParameter) => {
        item.value = this.getParameters(item.getTagPath(this.position));
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
                          {`${item.name}: ${item.value}`}
                      </li>
                    )}
                  )}
              </ul>
          </div>
      </>
    )
  }
}