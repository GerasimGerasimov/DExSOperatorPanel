import {TTrandsGroup } from '../../lib/trands/trandsgroup'
import { TTrand } from '../../lib/trands/trand';
import { TViewTrand, IViewTrandProp, IViewTrandDrawMethodProps, IViewTrandSizeProp } from '../../lib/trands/view/TViewTrand';
import ViewFactory from '../../lib/trands/view/ViewTrandFactoty';

export interface IViewBoxModelProps {
  height: string;
  models: TTrandsGroup;
  deep: number;
  WidthScale: number;
}

interface ICanvasSize {
  width: number;
  height: number;
}

export default class TViewBoxModel {
    private widthScale: number = 1;
    private count: number = 0;
    private deep: number = 0;
    private canvas: OffscreenCanvas;
    private ctx: any;
    private height: string;
    private models: TTrandsGroup;
    private views: Map<string, TViewTrand>;
    private ctxsize: ICanvasSize = {
      width : 0,
      height: 0
    }
    private scrollPosition: number = 0;

    constructor (props: IViewBoxModelProps){
      this.widthScale = props.WidthScale;
      this.deep = props.deep;
      this.height = props.height;
      this.models = props.models;
      this.ctxsize = {width:0, height:0}
      this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
      this.ctx = this.canvas.getContext("2d",{ alpha: false });
      this.views = this.createModelDependentView();
    }

    public set ScrollPosition(value: number) {
      this.scrollPosition = value;
    }

    public get ScrollPosition(): number {
      return this.scrollPosition;
    }
    
    private createModelDependentView(): Map<string, TViewTrand> {
      const views: Map<string, TViewTrand> = new Map();
      this.models.Trands.forEach((trand:TTrand, key: string)=>{
        const objType: string = trand.Model.ObjType
        const props: IViewTrandProp = {
          TrandProp: trand.TrandTagProps,
          model: trand.Model,
          width:  this.ctxsize.width,
          height: this.ctxsize.height,
          deep: this.deep
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
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.ctxsize.width, this.ctxsize.height);
      this.drawLineChart();
    }

    public getLegendStaticData():Array<any> {
      const res: Array<any> = [];
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          res.push(view.getLegendProps());
        }
      })
      return res;
    }

    public getModelEndIndex(): number {
      let res: number = 0;
      for (const [key , value] of this.views) {
        res = value.getModelEndIndex();
        break;
      }
      return res;
    }

    public getStartPosition(): number {
      let res: number = 0;
      for (const [key, value] of this.views) {
        const EndIndex: number = value.getModelEndIndex();
        res = value.getStartPosition(EndIndex, this.scrollPosition)
        break;
      }
      return res;
    }

    public getLegendValues(index: number): Array<string> {
      const res: Array<string> = [];
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          res.push(view.getLegendModelValue(index));
        }
      })
      return res;
    }

    private drawLineChart(){
      let props: IViewTrandDrawMethodProps = {
        ctx: this.ctx,
        fromIdx: this.scrollPosition
      }
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          view.draw(props)
        }
      })

    }

    public resize(width: number, height: number) {
      if ((width !== this.ctxsize.width) || 
          (height !== this.ctxsize.height)) {
            this.ctxsize = {width, height}
            this.canvas = new OffscreenCanvas(this.ctxsize.width, this.ctxsize.height);
            this.ctx = this.canvas.getContext("2d", { alpha: false });
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.lineWidth = 1;
            this.resizeViews();
      }
    }

    private resizeViews() {
      this.count = (this.ctxsize.width * this.widthScale) | 0;
      if (this.count > this.deep) {
        this.count = this.deep;
      }
      let props: IViewTrandSizeProp = {
        count: this.count,
        width: this.ctxsize.width,
        height: this.ctxsize.height
      }
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          view.resize(props)
        }
      })
    }

    public get Height():string {
      return this.height;
    }

    public get Models(): Map<string, TTrand> {
      return this.models.Trands;
    }
    
    public set WidthScale(value: number) {
      this.widthScale = value;
      this.count = (this.ctxsize.width * this.widthScale) | 0;
      this.views.forEach((view: TViewTrand)=>{
        if (view) {
          view.setCount(this.count)}
      })
    }
 
    public get WidthScale():number {
      return this.widthScale;
    }

    public getIndexByClickXCoordinate(x: number): number {
      const startPosition: number = this.getStartPosition();
      const widthToClickIndex: number = x * this.WidthScale;
      const index: number = (startPosition+widthToClickIndex) | 0;
      const res:number = this.getModelLoopIndex(index);
      return res;
    }

    private getModelLoopIndex(index: number): number {
      let res: number = 0;
      for (const [key, value] of this.views) {
        res = value.getModelNextIndex(index)
        break;
      }
      return res;
    }
}