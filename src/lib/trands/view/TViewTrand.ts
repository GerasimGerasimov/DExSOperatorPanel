import { ITrandTagProperties } from "../itrand";
import { TModel } from "../models/TModel";

export interface IViewTrandProp {
  TrandProp: ITrandTagProperties;
  model: TModel;
  width: number;
  height: number;
  deep: number;
}

export interface IViewTrandDrawMethodProps {
  ctx: any;
  fromIdx: number;
}

export interface IViewTrandSizeProp {
  count: number;//сколько точек умещать в заданной ширине
  width: number;
  height: number;
}

export interface IViewTrandScalesProps{
  HScale: number;//вертикальная шкала
  WScale: number;//горизонтальная шкала
  Axis: number; //положение оси (offset пересчитанный в пикселы)
}

export abstract class TViewTrand {
  protected TrandProp: ITrandTagProperties;
  protected Scales: IViewTrandScalesProps;
  protected Sizes: IViewTrandSizeProp;
  protected model: TModel;
  protected deep: number;

  constructor(props: IViewTrandProp) {
    this.TrandProp = props.TrandProp;
    this.model = props.model;
    this.deep = props.deep;
    
    this.Sizes = {
      count: props.width, //по умолчанию, кол-во выводимых точек равно ширине
      width: props.width,
      height: props.height
    }

    this.Scales = {
      Axis: 1,
      WScale: 1,
      HScale: 1
    }
  }

  public abstract draw(props: IViewTrandDrawMethodProps): void;

  public abstract resize(sizes: IViewTrandSizeProp): void;
  
  protected getOffsetInPixels(sOffset: string): number {
    let res: number = 0;
    const s: Array<string> = sOffset.split(' ');
    const [value, msu] = [... s];
    switch (msu) {
      case '%':
          res = this.getAxisPosFromPrc(Number(value || 0), this.Sizes.height)
        break;
      default:
        res = this.getAxisPosFromPx(Number(value || 0), this.Sizes.height)
          break
    }
    return res;
  }

  private getAxisPosFromPrc(offsetInPrc: number, height: number): number {
    const offsetInPx: number = (height * offsetInPrc)/100;
    const AxisPosInPx: number = height - offsetInPx;
    return AxisPosInPx | 0; //округение до целых вместо Math.floor
  }

  private getAxisPosFromPx(offsetInPx: number, height: number): number {
    const AxisPosInPx: number = height - offsetInPx;
    return AxisPosInPx;
  }
}