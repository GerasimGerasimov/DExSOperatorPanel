//https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
//https://codepen.io/vasilly/pen/NRKyWL
//https://stackoverflow.com/questions/53661473/canvas-animation-reactjs-with-requestanimationframe

import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas from './TDrawCanvas';

export interface IViewBoxProps {
  height: TTrandHeight;
  viewBox: TViewBoxModel;
}

export interface ISaveContextFunction {
  (element: any): void;
}

interface IViewBoxState {
  count: number;
}

export default class TViewBox extends Component<IViewBoxProps, IViewBoxState> {
    private heightProp: TTrandHeight;
    private viewBox: TViewBoxModel;

    constructor (props: any){
      super(props);
      this.state = {
        count: 0
      }

      this.heightProp = this.props.height;
      this.viewBox = this.props.viewBox;
    }

    componentDidMount() {
      //window.addEventListener("resize", this.onResize);
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
      //window.removeEventListener("resize", this.onResize);
    }

    private handleClick(){
      console.log('click', this.state.count);
      this.setState(state=> ({
          count: state.count + 1
        })
      )
    }

    render() {
      const {height, mu} = {...this.heightProp}
      return (
        <div
          className='Trands box'
          style={{
            height: `${height}${mu}`
          }}>
            <h3>TViewBox</h3>
            <DrawCanvas
              changeCount={this.state.count}
              viewBox = {this.viewBox}
             />
          <button className='Trands btn' onClick={()=>{this.handleClick()}}>{`Count ${this.state.count}`}</button>
        </div>
      )
    }
}

//<canvas ref={this.canvasRef} className='Trands canvas' style={{background: '#f4f4f4'}}></canvas>