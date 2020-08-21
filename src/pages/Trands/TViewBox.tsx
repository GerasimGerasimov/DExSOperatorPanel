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
  scrollPosition: number;
}

export interface ISaveContextFunction {
  (element: any): void;
}

interface IViewBoxState {
  count: number;
  width: number;
  scrollPosition: number;
}

export default class TViewBox extends Component<IViewBoxProps, IViewBoxState> {
    private heightProp: TTrandHeight;
    private viewBoxModel: TViewBoxModel;

    constructor (props: any){
      super(props);
      this.state = {
        count: 0,
        width: window.innerWidth,
        scrollPosition: this.props.scrollPosition
      }

      this.heightProp = this.props.height;
      this.viewBoxModel = this.props.viewBox;
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
            <DrawCanvas
              changeCount={this.state.count}
              width={this.state.width}
              viewBoxModel = {this.viewBoxModel}
              scrollPosition = {this.state.scrollPosition}
             />
             <h3 className='Trands h3'>TViewBox</h3>
          <button className='Trands btn' onClick={()=>{this.handleClick()}}>{`Count ${this.state.count}`}</button>
        </div>
      )
    }
}