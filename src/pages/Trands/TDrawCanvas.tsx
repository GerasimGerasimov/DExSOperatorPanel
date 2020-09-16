import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';
import TViewBoxLegend, { ILegendItem } from '../../components/Legend/TViewBoxLegend';

export enum ELegendViewMode {
  EndIndex,
  SelectedIndex
}

export interface IDrawCanvasProps {
  viewBoxModel: TViewBoxModel;
  width: number;
  scrollPosition: number;
  LegendSelectedIndex: number;
  ViewMode: ELegendViewMode;
}

export default class Canvas extends Component <IDrawCanvasProps, {}>{
  private ctx: any;
  private viewBoxModel: TViewBoxModel;
  private height: number = 0;
  private width: number = 0;
  private LegendItems: Array<ILegendItem> = [];
  private LegendIndex: number = 0;
  private ViewMode: ELegendViewMode;

  constructor(props: IDrawCanvasProps) {
    super(props);
    this.viewBoxModel = this.props.viewBoxModel;
    this.viewBoxModel.ScrollPosition = this.props.scrollPosition;
    this.width = this.props.width;
    this.ViewMode = this.props.ViewMode;
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
    //console.log('LegendSelectedIndex:',nextProps.LegendSelectedIndex)
    this.ViewMode = nextProps.ViewMode;
    switch (this.ViewMode) {
      case ELegendViewMode.EndIndex:
        this.LegendIndex = this.viewBoxModel.getModelEndIndex();
        break;
      case ELegendViewMode.SelectedIndex:
        this.LegendIndex = nextProps.LegendSelectedIndex;
        break;
    }
    return true;
  }

  private fillLegendValueItems(){
    const index: number = this.LegendIndex;
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