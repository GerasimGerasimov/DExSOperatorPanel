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
  width: number
}

export default class TViewBox extends Component<IViewBoxProps, IViewBoxState> {
    private heightProp: TTrandHeight;
    private viewBox: TViewBoxModel;

    constructor (props: any){
      super(props);
      this.state = {
        count: 0,
        width: window.innerWidth
      }

      this.heightProp = this.props.height;
      this.viewBox = this.props.viewBox;
    }

    componentDidMount() {
      window.addEventListener("resize", this.onResize.bind(this));
    }

    private onResize(){
      console.log('resize');
      this.setState(state=>({
        width: window.innerWidth,
      }));
    }
    
    componentWillUnmount() {
      window.removeEventListener("resize", this.onResize);
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
              width={this.state.width}
              viewBox = {this.viewBox}
             />
          <button className='Trands btn' onClick={()=>{this.handleClick()}}>{`Count ${this.state.count}`}</button>
        </div>
      )
    }
}