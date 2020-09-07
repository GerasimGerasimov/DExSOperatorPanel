//https://philna.sh/blog/2018/09/27/techniques-for-animating-on-the-canvas-in-react/
//https://codepen.io/vasilly/pen/NRKyWL
//https://stackoverflow.com/questions/53661473/canvas-animation-reactjs-with-requestanimationframe

import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas from './TDrawCanvas';
import { Trands } from '../../lib/trands/trands';
import TViewBoxLegend from '../../components/Legend/TViewBoxLegend';

export interface IViewBoxProps {
  height: TTrandHeight;
  viewBox: TViewBoxModel;
  scrollPosition: number;
  widthScale: number;
}

export interface ISaveContextFunction {
  (element: any): void;
}

interface IViewBoxState {
  width: number;
  changeCount: number;
}

export default class TViewBox extends Component<IViewBoxProps, IViewBoxState> {
    private heightProp: TTrandHeight;
    private viewBoxModel: TViewBoxModel;
    private scrollPosition: number;
    private UpdateID: string = '';
    private widthScale: number;

    constructor (props: IViewBoxProps){
      super(props);
      this.state = {
        width: window.innerWidth,
        changeCount: 0
      }
      this.heightProp = this.props.height;
      this.scrollPosition = this.props.scrollPosition;
      this.viewBoxModel = this.props.viewBox;
      this.widthScale = this.props.widthScale;
    }

    componentDidMount() {
      window.addEventListener("resize", this.onResize.bind(this));
      this.UpdateID = Trands.setOnUpdate(this.onDataUpdate.bind(this));
    }

    private onDataUpdate(){
      this.setState(state=> ({
        changeCount: state.changeCount + 1
      }))
    }

    private onResize(){
      console.log('resize');
      this.setState(state=>({
        width: window.innerWidth,
      }));
    }
    
    componentWillUnmount() {
      window.removeEventListener("resize", this.onResize);
      Trands.deleteOnUpdateByID(this.UpdateID);
    }

    shouldComponentUpdate(nextProps:IViewBoxProps): boolean{
      this.scrollPosition = nextProps.scrollPosition;
      if (nextProps.widthScale != this.widthScale) {
        this.widthScale = nextProps.widthScale;
        this.viewBoxModel.WidthScale = this.widthScale;
      }
      return true;
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
              width={this.state.width}
              viewBoxModel = {this.viewBoxModel}
              scrollPosition = {this.scrollPosition}
             />
             <TViewBoxLegend Items={[]}/>
        </div>
      )
    }
}