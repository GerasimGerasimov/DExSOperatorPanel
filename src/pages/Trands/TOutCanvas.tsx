import React, {Component} from 'react'
import './Trands.css'

export interface IOutCanvasProps {
  contextRef: any;
  width: number;
}

interface IOutCanvasState {
  width: number;
}
export default class TOutCanvas extends React.Component <IOutCanvasProps, IOutCanvasState> {

  constructor(props: IOutCanvasProps) {
    super(props);
    this.state = {
      width: props.width
    }
  }

  shouldComponentUpdate(nextProps: IOutCanvasProps): boolean {
    if (this.state.width != nextProps.width) {
      this.setState({width: nextProps.width})
      return true;
    } 
    return false;
  }

  render() {
    return (
      <canvas className='Trands canvas'
        key = {this.state.width}
        ref={element => element ? this.props.contextRef(element) : null}
      />
    )
  }
}