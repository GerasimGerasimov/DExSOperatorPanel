import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'
import TViewBoxModel from './TViewBoxModel';

export interface IViewBoxProps {
  height: TTrandHeight;
  viewBox: TViewBoxModel;
}

export default class TViewBox extends Component<IViewBoxProps, {}> {
    private height: TTrandHeight;
    private viewBox: TViewBoxModel;

    constructor (props: any){
      super(props);
      this.height = this.props.height;
      this.viewBox = this.props.viewBox;
    }

    componentDidMount() {
      const canvas:any = this.refs.canvas
      const ctx: any = canvas.getContext("2d")
      this.viewBox.draw();
      ctx.drawImage(this.viewBox.Context.canvas, 0, 0);
      // img.onload = () => {
      //   ctx.drawImage(img, 0, 0)
      //   ctx.font = "40px Courier"
      //   ctx.fillText(this.props.text, 210, 75)
      // }
    }

    render() {
      const {height, mu} = {...this.height}
      return (
        <div
          className='Trands box'
          style={{
            height: `${height}${mu}`
          }}>
            <h3>TViewBox</h3>
            <canvas ref="canvas" className='Trands canvas'></canvas>
        </div>
      )
    }
}