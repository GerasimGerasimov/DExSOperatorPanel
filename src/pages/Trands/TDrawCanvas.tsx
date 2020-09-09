import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';
import TViewBoxLegend, { ILegendItem } from '../../components/Legend/TViewBoxLegend';

export interface IDrawCanvasProps {
  viewBoxModel: TViewBoxModel;
  width: number;
  scrollPosition: number;
}

export default class Canvas extends Component <IDrawCanvasProps, {}>{
  private ctx: any;
  private viewBoxModel: TViewBoxModel;
  private height: number = 0;
  private width: number = 0;
  private LegendItems: Array<ILegendItem> = [];

  constructor(props: IDrawCanvasProps) {
    super(props);
    this.viewBoxModel = this.props.viewBoxModel;
    this.viewBoxModel.ScrollPosition = this.props.scrollPosition;
    this.width = this.props.width;
    this.LegendItems = this.viewBoxModel.getLegendStaticData();
  }

  saveContext(element: any) {
    this.ctx = element.getContext('bitmaprenderer', { alpha: false });
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.viewBoxModel.resize(this.width, this.height);
  }

  componentDidMount() {
    this.update()
  }

  componentDidUpdate() {
    this.update()
  }

  private update(){
    setTimeout(() => {
      this.draw();
    },0);
    this.fillLegendValueItems();
  }

  shouldComponentUpdate(nextProps:IDrawCanvasProps): boolean{
    this.viewBoxModel.ScrollPosition = 
        nextProps.scrollPosition;
    return true;
  }

  private fillLegendValueItems(){
    const index: number = this.viewBoxModel.getModelEndIndex();
    const values: Array<string> = this.viewBoxModel.getLegendValues(index);
    values.forEach((value, index)=>{
      this.LegendItems[index].value = value
    })
  }

  private draw() {
    this.viewBoxModel.draw();
    const bitmapOne = this.viewBoxModel.Canvas.transferToImageBitmap();
    this.ctx.transferFromImageBitmap(bitmapOne);
  }

  render() {
    return (
      <>
        <OutCanvas width={this.props.width} contextRef={this.saveContext.bind(this)} />
        <TViewBoxLegend Items={this.LegendItems}/>
      </>
    )
  }
}
//TODO проверить на реактивность - должны рендерится только значения