//https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
//https://codepen.io/vasilly/pen/NRKyWL
//https://stackoverflow.com/questions/53661473/canvas-animation-reactjs-with-requestanimationframe

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
    private canvasRef: any = React.createRef();

    constructor (props: any){
      super(props);
      this.height = this.props.height;
      this.viewBox = this.props.viewBox;
    }

    componentDidMount() {
      window.addEventListener("resize", this.onResize);
      const canvas:any = this.canvasRef.current;
      const w: number = canvas.clientWidth;
      const h: number = canvas.clientHeight;
      this.viewBox.resize(w, h);
      this.viewBox.draw();
      var ctx: any = canvas.getContext("bitmaprenderer", { alpha: false })
      //ctx.drawImage(this.viewBox.Context.canvas, 0, 0);
      const bitmapOne = this.viewBox.Canvas.transferToImageBitmap();
      ctx.transferFromImageBitmap(bitmapOne);
    }

    private onResize(){
      console.log('resize');
      //this.canvasRef.current = React.createRef();
      //const canvas:any = this.canvasRef.current
      //if (canvas) {
      //  console.log(canvas)
      //}
      //const w: number = canvas.clientWidth;
      //const h: number = canvas.clientHeight;
    }

    componentWillMount() {
      //this.onResize();
  }
     
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    private setCanvasRef(element: any) {
      this.canvasRef = element;
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
            <canvas ref={this.canvasRef} className='Trands canvas' style={{background: '#f4f4f4'}}></canvas>
        </div>
      )
    }
}