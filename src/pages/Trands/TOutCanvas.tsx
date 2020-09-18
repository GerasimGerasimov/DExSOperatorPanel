import React, {Component} from 'react'
import './Trands.css'

export interface IOutCanvasProps {
  contextRef: any;
  width: number;
}

export default class TOutCanvas extends Component <IOutCanvasProps, {}> {

  shouldComponentUpdate(nextProps: IOutCanvasProps): boolean {
    return (this.props.width !== nextProps.width)
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