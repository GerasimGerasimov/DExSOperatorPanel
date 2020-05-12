import React, {Component} from 'react'
import {TParameter, getTags } from '../../lib/devicepagecontent/devicepagecontent';
import { observer } from 'mobx-react';
import { autorun, extendObservable } from 'mobx';
import { devicesInfoStore } from '../../store/devices/devicesinfo';

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
        this.parameters.set(`${this.position}/${item.section}/${item.name}`, item);
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

  private getParameters(tagPath: string): {value: string, msu: string} {
    return devicesInfoStore.getTagProperties (tagPath, ['value','msu']);
  }

  private update(changed: any){
    for (const [key, item] of this.parameters.entries()) {
      const {value, msu} = this.getParameters(key);
      item.value = value;
    }
  }

  render() {
    return(
      <>
        <h1>Settings</h1>
          <div className="table-responsive"> 
            <table className="table table-bordered table-condensed table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>M.U.</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    Array.from(this.parameters.entries(), ([key, item]) => {
                    const  {msu} = devicesInfoStore.getTagProperties (key, ['value','msu']);
                      return (
                        <tr key={key}>
                          <td>{item.name}</td>
                          <td>{msu}</td>
                          <td>{item.value}</td>
                        </tr>
                      )}
                    )}
                </tbody>
            </table>
          </div>
      </>
    )
  }
}