import React, {Component} from 'react'
import './Trands.css'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas, { ELegendViewMode } from './TDrawCanvas';
import { Trands } from '../../lib/trands/trands';
export interface IViewBoxGetSelectedIndex {
  (index: any): void;
}

export interface IViewBoxProps {
  viewBox: TViewBoxModel;
  SelectedIndex: number;
  onSetSelectedIndex: IViewBoxGetSelectedIndex;
}

interface IViewBoxState {
  width: number;
  changeCount: number;
}

export default class TViewBox extends Component<IViewBoxProps, IViewBoxState> {
    private UpdateID: string = '';
    private onResizeHandler: any;

    constructor (props: IViewBoxProps){
      super(props);
      this.state = {
        width: window.innerWidth,
        changeCount: 0
      }
      this.onResizeHandler = this.onResize.bind(this);
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
      this.setState({width: window.innerWidth});
    }
    
    componentWillUnmount() {
      window.removeEventListener("resize", this.onResizeHandler);
      Trands.deleteOnUpdateByID(this.UpdateID);
    }

    private onClickHandler(e: any) {
      const x: number = e.clientX;
      const position:number = this.props.viewBox.getIndexByClickXCoordinate(x);
      this.props.onSetSelectedIndex(position);
    }

    private getLegendViewMode():ELegendViewMode {
      return (Trands.Run)
        ? ELegendViewMode.EndIndex
        : ELegendViewMode.SelectedIndex
    }

    render() {
      const {height, mu} = {...this.props.viewBox.Height}
      return (
        <div
          className='Trands box'
          style={{height: `${height}${mu}`}}
          onClick = {(e)=>this.onClickHandler(e)}
        >
            <DrawCanvas
              width={this.state.width}
              viewBoxModel = {this.props.viewBox}
              LegendSelectedIndex = {this.props.SelectedIndex}
              ViewMode = {this.getLegendViewMode()}
             />
        </div>
      )
    }
}
//<span style={{position: `relative`}}>Index:{this.state.SelectedIndex}</span>