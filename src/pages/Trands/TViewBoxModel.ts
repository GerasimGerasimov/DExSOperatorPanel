import { TTrandHeight, TTrandsGroup } from '../../lib/trands/trandsgroup'
import { TTrand } from '../../lib/trands/trand';

export interface IViewBoxModelProps {
  height: TTrandHeight;
  models: TTrandsGroup;
}

interface ICanvasSize {
  width: number;
  height: number;
}
export default class TViewBoxModel {
    private canvas: OffscreenCanvas;
    private ctx: any;
    private height: TTrandHeight;
    private models: TTrandsGroup;
    private ctxsize: ICanvasSize = {
      width : 0,
      height: 0
    }

    constructor (props: IViewBoxModelProps){
      this.height = props.height;
      this.models = props.models;
      this.ctxsize = {width:1024, height:this.height.height}
      this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
      this.ctx = this.canvas.getContext("2d");
    }

    public get Context(): any {
      return this.ctx
    }

    public get Canvas(): any {
      return this.canvas
    }

    public draw() {
      this.ctx.fillStyle = '#FD0';
      this.ctx.beginPath();
      this.ctx.rect(0,0,10,10);
      this.ctx.stroke();
    }

    public resize(width: number, height: number) {
      this.ctxsize = {width, height}
      //this.canvas.width = width;
      //this.canvas.height = height;
      this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
      this.ctx = this.canvas.getContext("2d"/*, { alpha: false }*/);
      this.ctx.imageSmoothingEnabled = false;
    }

    public get Height():TTrandHeight {
      return this.height;
    }

    public get Models(): Map<string, TTrand> {
      return this.models.Trands;
    }
}