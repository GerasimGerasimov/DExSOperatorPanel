import React, {Component} from 'react'
import './Trands.css'
import TViewBoxModel from './TViewBoxModel';
import DrawCanvas, { ELegendViewMode, ISelected } from './TDrawCanvas';
import { Trands } from '../../lib/trands/trands';

export interface IViewBoxSelectedPosition {
  position: number;//позиция в массиве
  left: number; //координата Х в месте клика
}

export interface IViewBoxGetSelectedIndex {
  (position: IViewBoxSelectedPosition): void;
}

export interface IViewBoxProps {
  viewBox: TViewBoxModel;
  Selected: ISelected;
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

    private getLegendViewMode():ELegendViewMode {
      return (Trands.Run)
        ? ELegendViewMode.EndIndex
        : ELegendViewMode.SelectedIndex
    }

    private onClickHandler(e: any) {
      const left: number = e.clientX;
      const position:number = this.props.viewBox.getIndexByClickXCoordinate(left);
      this.props.onSetSelectedIndex({position, left});
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
              LegendSelected = {this.props.Selected}
              ViewMode = {this.getLegendViewMode()}
             />
        </div>
      )
    }
}