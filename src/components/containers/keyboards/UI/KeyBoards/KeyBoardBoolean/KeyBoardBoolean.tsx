import React, {Component} from 'react'
import {IKeyBoardProps } from '../IKeyBoards';
import './KeyBoardBoolean.css'
import KeyBoardButton from '../KeyBoardButton/KeyBoardButton';

interface IState {
  value: string;
}

export default class KeyBoardBoolean extends Component<IKeyBoardProps, IState> {

  private prevValue: string = this.props.data.value.toString();
  constructor (props: any){
    super(props)
    this.state = {
      value:  this.prevValue
    };
  }

  handleHide(cause: string) {
    const values: any = {
      'ok': this.state.value,
      'cancel':this.prevValue
    }
    const result: any = {
      cause,
      value: values[cause]
    }
    this.props.onClick(result);
  }

  handlerSetValue(value:string){
    this.setState(state => ({value}));
  }

  inputChangedHandler = (event: any) => {
    const value = event.target.value;
    this.setState(state => ({value}));
  }

  render() {
    return(
      <div className="KeyBoardBlock">
          <div className="grid-container">
            <div className="Value">
              <input
                type="text"
                className="KeyBoardText"
                onChange={(event)=>this.inputChangedHandler(event)}
                value = {this.state.value}>
              </input>
            </div>
            <KeyBoardButton position="Ok" value="Ok" onClick={()=>this.handleHide('ok')}/>
            <KeyBoardButton position="Cancel" value="Cancel" onClick={()=>this.handleHide('cancel')}/>
            <KeyBoardButton position="No" value="0" onClick={()=>{this.handlerSetValue('0')}}/>
            <KeyBoardButton position="Yes" value="1" onClick={()=>{this.handlerSetValue('1')}}/>
            <div className="Name text-center">{`${this.props.data.name}: ${this.prevValue}`}</div>
          </div>
      </div>
    )
  }
}