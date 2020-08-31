import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';

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

  constructor(props: IDrawCanvasProps) {
    super(props);
    this.viewBoxModel = this.props.viewBoxModel;
    this.viewBoxModel.ScrollPosition = this.props.scrollPosition;
  }

  saveContext(element: any) {
    this.ctx = element.getContext('bitmaprenderer', { alpha: false });
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.viewBoxModel.resize(this.width, this.height);
  }

  componentDidUpdate() {
    this.draw()
  }

  shouldComponentUpdate(nextProps:IDrawCanvasProps): boolean{
    this.viewBoxModel.ScrollPosition = 
        nextProps.scrollPosition;
    return true;
  }

  private draw() {
    this.viewBoxModel.draw();
    const bitmapOne = this.viewBoxModel.Canvas.transferToImageBitmap();
    this.ctx.transferFromImageBitmap(bitmapOne);
  }

  render() {
    return <OutCanvas width={this.props.width} contextRef={this.saveContext.bind(this)} />;
  }
}