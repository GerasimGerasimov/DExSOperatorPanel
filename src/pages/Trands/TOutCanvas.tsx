import React, {Component} from 'react'
import './Trands.css'

export interface IOutCanvasProps {
  contextRef: any;
  width: number;
}

export default class TOutCanvas extends React.Component <IOutCanvasProps, {}> {
  
  constructor(props: IOutCanvasProps) {
    super(props);
  }
   
  render() {
    return (
      <canvas className='Trands canvas'
        key = {this.props.width}
        ref={element => element ? this.props.contextRef(element) : null}
      />
    )
  }
}