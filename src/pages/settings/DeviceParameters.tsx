import React, {Component} from 'react'
import {TParameter, getTags } from '../../lib/devicepagecontent/devicepagecontent';
import { observer } from 'mobx-react';
import { autorun, extendObservable } from 'mobx';
import { devicesInfoStore } from '../../store/devices/devicesinfo';
import Modal from '../../UI/modal/modal';

interface IState {
  showModal: boolean;
}

@observer
export default class DeviceParameters extends Component<{}, IState> {

  private parameters  = new Map<string, TParameter>();
  private position: string = '';
  private handlers: Array<any> = [];

  constructor (props: any){
    super(props)
    this.state = {showModal: false};
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

  handlerValueOnClick(e: any) {
    console.log(e);
    this.setState({showModal: !this.state.showModal})
  }

  render() {
    const modal = this.state.showModal ? (<Modal/>) : null;

    return(
      <>
        <h1>Settings</h1>
          <div className="table-responsive"> 
            <table className="table table-bordered table-condensed table-hover"
                   contentEditable="true">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>M.U.</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody onClick = {(e)=>this.handlerValueOnClick(e)}>
                  {
                    Array.from(this.parameters.entries(), ([key, item]) => {
                    const  {msu} = devicesInfoStore.getTagProperties (key, ['value','msu']);
                      return (
                        <tr key={key}>
                          <td>{item.name}</td>
                          <td>{msu}</td>
                          <td >{item.value}</td>
                        </tr>
                      )}
                    )}
                </tbody>
            </table>
          </div>
          {modal}
      </>
    )
  }
}