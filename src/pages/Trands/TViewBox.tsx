import React, {Component} from 'react'
import './Trands.css'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas, { ELegendViewMode, ISelected } from './TDrawCanvas';
import { Trands } from '../../lib/trands/trands';

export interface IViewBoxGetSelectedIndex {
  (position: ISelected): void;
}

export interface IViewBoxProps {
  viewBox: TViewBoxModel;
  Selected: ISelected;
  onSetSelectedIndex: IViewBoxGetSelectedIndex;
  isMeasure: boolean;
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

    private getLegendViewMode():ELegendViewMode {
      return (Trands.Run)
        ? ELegendViewMode.EndIndex
        : ELegendViewMode.SelectedIndex
    }

    private onClickHandler(e: any) {
      const Left: number = e.clientX;
      const Index:number = this.props.viewBox.getIndexByClickXCoordinate(Left);
      this.props.onSetSelectedIndex({Index, Left});
    }

    render() {
      return (
        <div
          className='Trands box'
          style={{height: this.props.viewBox.Height}}
          onClick = {(e)=>this.onClickHandler(e)}
        >
            <DrawCanvas
              width={this.state.width}
              viewBoxModel = {this.props.viewBox}
              Selected = {this.props.Selected}
              ViewMode = {this.getLegendViewMode()}
              isMeasure = {this.props.isMeasure}
             />
        </div>
      )
    }
}