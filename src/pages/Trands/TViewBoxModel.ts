import { TTrandHeight, TTrandsGroup } from '../../lib/trands/trandsgroup'
import { TTrand } from '../../lib/trands/trand';
import { TViewTrand, IViewTrandProp, IViewTrandDrawProps } from '../../lib/trands/view/TViewTrand';
import ViewFactory from '../../lib/trands/view/ViewTrandFactoty';

export interface IViewBoxModelProps {
  height: TTrandHeight;
  models: TTrandsGroup;
}

interface ICanvasSize {
  width: number;
  height: number;
}

export default class TViewBoxModel {
    private count: number = 0;
    private canvas: OffscreenCanvas;
    private ctx: any;
    private height: TTrandHeight;
    private models: TTrandsGroup;
    private views: Map<string, TViewTrand>;
    private ctxsize: ICanvasSize = {
      width : 0,
      height: 0
    }

    constructor (props: IViewBoxModelProps){
      this.height = props.height;
      this.models = props.models;
      this.ctxsize = {width:0, height:0}
      this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
      this.ctx = this.canvas.getContext("2d");
      this.views = this.createModelDependentView();
    }

    private createModelDependentView(): Map<string, TViewTrand> {
      const views: Map<string, TViewTrand> = new Map();
      //TODO coздать отображения View специфичные для моделей
      this.models.Trands.forEach((trand:TTrand, key: string)=>{
        const objType: string = trand.Model.ObjType
        const props: IViewTrandProp = {
          TrandProp: trand.TrandTagProps,
          model: trand.Model,
          width:  this.ctxsize.width,
          height: this.ctxsize.height
        }
        const view: TViewTrand = ViewFactory(objType, props);
        views.set(key, view)
      })
      return views;
    }

    public get Context(): any {
      return this.ctx
    }

    public get Canvas(): any {
      return this.canvas
    }

    public draw() {
      this.ctx.strokeStyle = "blue";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.rect(0,0,this.ctxsize.height,this.ctxsize.height);
      this.ctx.stroke();
      this.ctx.strokeStyle = "red";
      this.ctx.font = "16px serif";
      this.ctx.strokeText(`${this.ctxsize.width} x ${this.ctxsize.height} : ${this.count++}`, 2, 18);
      this.drawLineChart();
    }

    private drawLineChart(){
      let props: IViewTrandDrawProps = {
        ctx: this.ctx,
        fromIdx: 0,
        count: 100,
      }
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          view.draw(props)
        }
      })

    }

    public resize(width: number, height: number) {
      if ((width != this.ctxsize.width) || 
          (height != this.ctxsize.height)) {
            this.ctxsize = {width, height}
            this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
            this.ctx = this.canvas.getContext("2d");
            this.ctx.imageSmoothingEnabled = false;
      }
    }

    public get Height():TTrandHeight {
      return this.height;
    }

    public get Models(): Map<string, TTrand> {
      return this.models.Trands;
    }
}