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
  
  public getLegendProps(): any {
    const res = {
      tag: this.TrandProp.tag,
      color: this.TrandProp.color,
      value: '',
      msu: this.model.msu
    }
    return res;
  }

  public getModelEndIndex(): number {
    return this.model.EndIndex;
  }
  
  public getModelNextIndex(index: number): number {
    return this.model.getLoopIndex(index);
  }
  
  public getLegendModelValue(index: number): string {
    return this.model.getStringValueByIndex(index)
  }

  public getStartPosition(index: number, offset: number): number {
    let revOffset: number = offset;
    let res: number = index - this.Sizes.count - revOffset;
    let mod: number = res % this.deep;
    if (res < 0) {
      res = (mod === 0)? 0: this.deep + mod;
    }
    return res;
  }

  protected getScaledY(index: number): number {
    const value: number = this.model.getValueByIndex(index);
    const scaledValue: number = value * this.Scales.HScale;
    const res = this.Scales.Axis - scaledValue;
    return res | 0
  }

  protected getHScale(fromIdx: number): number {
    const max: number = this.model.getMaxValue(fromIdx, this.Sizes.count);
    const HScale: number = (this.Scales.Axis / ((max !== 0)? max : this.Scales.Axis));
    return HScale;
  }

  public resize(sizes: IViewTrandSizeProp): void {
    const {width, height, count} = {...sizes};
    //при ресайзе меняются:
    //0) ширина-высота области отображения
    this.Sizes.count = count;
    this.Sizes.height = height;
    this.Sizes.width = width;
    //1) Положение оси (задано в % от высоты)
    this.Scales.Axis = this.getOffsetInPixels(this.TrandProp.offset);
    //2) Шкалы: вертикальная и горизонтальная
    this.Scales.WScale = width / count;
    //this.Scales.HScale зависит от maxValue и каждый раз перерасчитывается при выводе
  }

  public setCount(count: number) {
    this.Sizes.count = count;
    this.Scales.WScale = this.Sizes.width / count;
  }

  protected getOffsetInPixels(sOffset: string): number {
    let res: number = 0;
    const s: Array<string> = sOffset.split(' ');
    const [value, msu] = [...s];
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