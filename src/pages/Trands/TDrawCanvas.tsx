import React, {Component} from 'react'
import './Trands.css'
import OutCanvas from './TOutCanvas';
import TViewBoxModel from './TViewBoxModel';

export interface IDrawCanvasProps {
  changeCount: any;
  viewBoxModel: TViewBoxModel;
  width: number;
  scrollPosition: number;
}

interface IDrawCanvasState {
  scrollPosition: number;
}

export default class Canvas extends React.Component <IDrawCanvasProps, IDrawCanvasState>{
  private ctx: any;
  private viewBoxModel: TViewBoxModel;
  private height: number = 0;
  private width: number = 0;

  constructor(props: IDrawCanvasProps) {
    super(props);
    this.viewBoxModel = this.props.viewBoxModel;
    this.state = {
      scrollPosition: this.props.scrollPosition
    }
    this.viewBoxModel.ScrollPosition = this.state.scrollPosition;
  }

  saveContext(element: any) {
    this.ctx = element.getContext('bitmaprenderer');
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.viewBoxModel.resize(this.width, this.height);
  }

  componentDidUpdate() {
    this.draw()
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