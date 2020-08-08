import React, {Component} from 'react'
import './Trands.css'

export interface IOutCanvasProps {
  contextRef: any;
}

export default class TOutCanvas extends React.Component <IOutCanvasProps, {}> {
  
  shouldComponentUpdate() {
    return false;
  }
  
  render() {
    return (
      <canvas className='Trands canvas'
        ref={element => element ? this.props.contextRef(element) : null}
      />
    )
  }
}

//ref={element => element ? this.props.contextRef(element.getContext('bitmaprenderer')) : null}