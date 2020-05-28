import React, {Component} from 'react'
import {TParameter, getTags } from '../../lib/devicepagecontent/devicepagecontent';
import { observer } from 'mobx-react';
import { autorun, extendObservable } from 'mobx';
import { devicesInfoStore } from '../../store/devices/devicesinfo';
import KeyBoard from '../../components/containers/keyboards/UI/KeyBoards/KeyBoard';
import Modal from '../../components/HOC/Modal';
import { getTableClickRowCol, getParameterByRow } from '../../components/containers/keyboards/helpers/tables';

interface IState {
  showModal: boolean;
  parameters: Map<string, TParameter>;
  keyBoard: string; 
}

interface IInputResult {
  cause: string;
  value: string;
}

@observer
export default class DeviceParameters extends Component<{}, IState> {

  private parameters  = new Map<string, TParameter>();
  private position: string = '';
  private handlers: Array<any> = [];
  private selected = {
    name: '',
    value: ''
  }

  constructor (props: any){
    super(props)
    this.state = {
      showModal: false,
      parameters: new Map<string, TParameter>(),
      keyBoard: 'KeyBoardNumeric' 
  };
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

  private getKeyBoardType(ParameterType: string): string {
    switch (ParameterType) {
      case 'TBit':              return 'KeyBoardBoolean'
      case 'TFloat':  default:  return 'KeyBoardNumeric'
    }
  }

  private handlerModalShow(event: any) {
    const {row, col} = getTableClickRowCol(event);
    const p:TParameter | undefined = getParameterByRow(this.parameters, row);
    if (p) {
      const type = p.type || ''
      const keyBoard = this.getKeyBoardType(type);
      this.selected = {
        name: p.name,
        value: p.value
      }
      this.setState({
        showModal: true,
        keyBoard
      })
    }
  }

  setNewValueToParameter(name: string, newValue: string): Map<string, TParameter> {
    const res: Map<string, TParameter> = new Map<string, TParameter>()
    this.state.parameters.forEach((value, key)=>{
      if (key === name) {
        value.value = newValue;
      }
      res.set(key, value)
    })
    return res;
  }

  
  handlerModalClose(result: IInputResult) {
    const {cause, value} = result;
    const parameters: Map<string, TParameter> = this.setNewValueToParameter(this.selected.name, value)
    this.setState({
      showModal: false,
      parameters
    })
  }

  render() {
    const modal = this.state.showModal
    ? (<Modal>
        <KeyBoard keyBoardType={this.state.keyBoard} data={this.selected} onClick={this.handlerModalClose.bind(this)}/>
      </Modal>)
    : null;

    return(
      <>
        <h1>Settings</h1>
          <div className="table-responsive"> 
            <table className="table table-bordered table-condensed table-hover"
                   //contentEditable="true"
                >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>M.U.</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody onClick = {(e)=>this.handlerModalShow(e)}>
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