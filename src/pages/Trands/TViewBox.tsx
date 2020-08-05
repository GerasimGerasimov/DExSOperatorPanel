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
    private canasRef: any = React.createRef();

    constructor (props: any){
      super(props);
      this.height = this.props.height;
      this.viewBox = this.props.viewBox;
    }

    componentDidMount() {
      const canvas:any = this.canasRef.current;// this.refs.canvas;
      const w: number = canvas.clientWidth;
      const h: number = canvas.clientHeight;
      this.viewBox.resize(w, h);
      this.viewBox.draw();
      var ctx: any = canvas.getContext("bitmaprenderer", { alpha: false })
      //ctx.drawImage(this.viewBox.Context.canvas, 0, 0);
      const bitmapOne = this.viewBox.Canvas.transferToImageBitmap();
      ctx.transferFromImageBitmap(bitmapOne);
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
            <canvas ref={this.canasRef} className='Trands canvas' style={{background: '#f4f4f4'}}></canvas>
        </div>
      )
    }
}