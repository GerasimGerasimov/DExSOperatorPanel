import React, { Component } from "react";
import './event-counter.css'

interface IEventCounterProps {
  icon: JSX.Element;
  value: number;
}


interface IEventCounterState {
  isUpdate: boolean;
}

export default class EventCounter extends Component<IEventCounterProps, IEventCounterState> {

  constructor(props: IEventCounterProps) {
    super(props)
    this.state ={
      isUpdate: true
    }
  }

  componentDidMount() {
    setTimeout(()=>{
      this.setState({isUpdate:false});
    }, 0)
  }

  render () {
    let className = 'd-inline badge badge-pill badge-primary mr-1';
    className += this.state.isUpdate ?' shadow-on-phase' : ' shadow-off-phase';

    return (
      <div className={className}>
        {this.props.icon}
        <span className="pl-1 ">{this.props.value}</span>
      </div>
    )
  }
} 