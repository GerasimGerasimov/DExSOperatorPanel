import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';
import TViewBoxLegend, { ILegendItem } from '../../components/Legend/TViewBoxLegend';

export enum ELegendViewMode {
  EndIndex,
  SelectedIndex
}

export interface ISelected {
  Index: number;
  Left: number;
}

export interface IDrawCanvasProps {
  viewBoxModel: TViewBoxModel;
  width: number;
  Selected: ISelected;
  ViewMode: ELegendViewMode;
  isMeasure: boolean;
}

export default class Canvas extends Component <IDrawCanvasProps, {}>{
  private ctx: any;
  private LegendItemsStaticData: Array<ILegendItem> = [];
  //private copyOffscreenCanvasToCanvasHandler: any;
  //private RAFID: any;

  constructor(props: IDrawCanvasProps) {
    super(props);
    this.LegendItemsStaticData = this.props.viewBoxModel.getLegendStaticData();
  }

  saveContext(element: any) {
    this.ctx = element.getContext('bitmaprenderer', { alpha: false });
    const width: number = element.clientWidth;
    const height: number = element.clientHeight;
    this.props.viewBoxModel.resize(width, height);
  }

  componentDidMount() {
    this.draw();
    //this.copyOffscreenCanvasToCanvasHandler = this.copyOffscreenCanvasToCanvas.bind(this)
    //this.RAFID = requestAnimationFrame(this.copyOffscreenCanvasToCanvasHandler)
  }

  componentDidUpdate() {
    setTimeout(()=>{
      this.draw();
    },0)
  }
  
  /* componentWillUnmount(){
    cancelAnimationFrame(this.RAFID)
  }*/

  private drawSelectingPointer(left: number) {
    const canvas = this.props.viewBoxModel.Context; 
    canvas.strokeStyle = "gray";
    canvas.moveTo(left, 0);
    canvas.lineTo(left, canvas.canvas.height);
    canvas.stroke();
  }

  private draw() {
    this.props.viewBoxModel.draw();
    if (this.props.isMeasure)
      {this.drawSelectingPointer(this.props.Selected.Left)}
    const bitmapOne = this.props.viewBoxModel.Canvas.transferToImageBitmap();
    this.ctx.transferFromImageBitmap(bitmapOne);
  }

  /*
  private copyOffscreenCanvasToCanvas() {
    this.props.viewBoxModel.draw();
    const bitmapOne = this.props.viewBoxModel.Canvas.transferToImageBitmap();
    this.ctx.transferFromImageBitmap(bitmapOne);
    requestAnimationFrame(this.copyOffscreenCanvasToCanvasHandler)
  }
  */
  private getLegendIndexByMode(mode: ELegendViewMode): number {
    let index: number = 0;
    switch (mode) {
      case ELegendViewMode.EndIndex:
        index =  this.props.viewBoxModel.getModelEndIndex();
        break;
      case ELegendViewMode.SelectedIndex:
        index = this.props.Selected.Index;
        break;
    }
    return index;
  }

  private getLegendItems(fromIndex: number, source: Array<ILegendItem>, model: TViewBoxModel): Array<ILegendItem> {
    const items:Array<ILegendItem> = source;
    const values: Array<string> = model.getLegendValues(fromIndex);
    values.forEach((value, index)=>{
      items[index].value = value
    })
    return items;
  }

  render() {
    return (
      <>
        <OutCanvas width={this.props.width} contextRef={this.saveContext.bind(this)} />
        <TViewBoxLegend Items={
            this.getLegendItems(
              this.getLegendIndexByMode(this.props.ViewMode),
                this.LegendItemsStaticData,
                  this.props.viewBoxModel)}/>
      </>
    )
  }
}