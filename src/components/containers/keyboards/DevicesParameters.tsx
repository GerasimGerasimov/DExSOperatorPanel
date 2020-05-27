import React, {Component} from 'react'
import Modal from './HOC/Modal';
import KeyBoard from './UI/KeyBoards/KeyBoard';
import { Parameters, TParameter, getData } from '../datasets/dataset';
import { getTableClickRowCol, getParameterByRow } from '../helpers/tables';

interface IState {
  showModal: boolean;
  parameters: Map<string, TParameter>;
  keyBoard: string; 
}

interface IInputResult {
  cause: string;
  value: string;
}

export default class DeviceParameters extends Component<{}, IState> {
  
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
  }

  componentWillMount () {
    this.setState({
      parameters: getData(Parameters)
    })
  }

  private handlerModalShow(event: any) {
    const {row, col} = getTableClickRowCol(event);
    const p:TParameter | undefined = getParameterByRow(this.state.parameters, row);
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

  private getKeyBoardType(ParameterType: string): string {
    switch (ParameterType) {
      case 'TBit':              return 'KeyBoardBoolean'
      case 'TFloat':  default:  return 'KeyBoardNumeric'
    }
  }

  handlerModalClose(result: IInputResult) {
    const {cause, value} = result;
    const parameters: Map<string, TParameter> = this.setNewValueToParameter(this.selected.name, value)
    this.setState({
      showModal: false,
      parameters
    })
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

  render() {
    const modal = this.state.showModal
    ? (<Modal>
        <KeyBoard keyBoardType={this.state.keyBoard} data={this.selected} onClick={this.handlerModalClose.bind(this)}/>
      </Modal>)
    : null;

    return(
      <>
        <h1>Settings</h1>
          <div> 
            <table onClick = {(e)=>this.handlerModalShow(e)}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>M.U.</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                  {
                    Array.from(this.state.parameters.entries(), ([key, item]) => {
                    const  {name, value, msu} = item;
                      return (
                        <tr key={key}>
                          <td>{name}</td>
                          <td>{msu}</td>
                          <td>{value}</td>
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