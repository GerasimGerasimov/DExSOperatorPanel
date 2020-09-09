import React, {Component} from 'react'
import './Trands.css'
import { TTrandHeight } from '../../lib/trands/trandsgroup'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas from './TDrawCanvas';
import { Trands } from '../../lib/trands/trands';

export interface IViewBoxProps {
  height: TTrandHeight;
  viewBox: TViewBoxModel;
  scrollPosition: number;
  widthScale: number;
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
    private onResizeHandler: any;

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
      this.onResizeHandler = this.onResize.bind(this)
    }

    componentDidMount() {
      window.addEventListener("resize", this.onResizeHandler);
      this.UpdateID = Trands.setOnUpdate(this.onDataUpdate.bind(this));
    }

    private onDataUpdate(){
      this.setState(state=> ({
        changeCount: state.changeCount + 1
      }))
    }

    private onResize(){
      this.setState(state=>({
        width: window.innerWidth,
      }));
    }
    
    componentWillUnmount() {
      window.removeEventListener("resize", this.onResizeHandler);
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
        </div>
      )
    }
}