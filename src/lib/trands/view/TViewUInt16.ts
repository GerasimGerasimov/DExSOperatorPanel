import { TViewTrand, IViewTrandProp, IViewTrandDrawMethodProps, IViewTrandSizeProp } from "./TViewTrand";

interface IAxisProps {
  ctx: any,
  AxisY: number,
  width: number,
  color: string
}

export class TViewUInt16 extends TViewTrand {

  constructor(props: IViewTrandProp) {
    super(props);
  }

  private getStartPosition(index: number, offset: number): number {
    let revOffset: number = offset;
    let res: number = index - this.Sizes.count - revOffset;
    let mod: number = res % this.deep;
    if (res < 0) {
      res = (mod == 0)? 0: this.deep + mod;
    }
    return res;
  }

  public draw(props: IViewTrandDrawMethodProps): void {
    props.ctx.beginPath();
    const s = `${this.TrandProp.tag}: ${this.model.EndIndex} fromIdx: ${props.fromIdx}`;
    props.ctx.strokeStyle = this.TrandProp.color;
    props.ctx.strokeText(s, 150, 20);
    //отрисовка Оси
    const AxisProps: IAxisProps = {
      ctx: props.ctx,
      AxisY: this.Scales.Axis,
      width: this.Sizes.width,
      color: this.TrandProp.color
    }
    this.drawAxis(AxisProps);
    const startPosition: number = this.getStartPosition(this.model.EndIndex, props.fromIdx)
    //вычислить вертикальную шкалу HScale
    this.Scales.HScale = this.getHScale(startPosition);
    //собственна график
    this.drawLineGraph(props.ctx, startPosition);
  }
  
  private drawAxis(props: IAxisProps) {
    props.ctx.moveTo(0, props.AxisY);
    props.ctx.lineTo(props.width, props.AxisY);
    props.ctx.stroke();
  }

  private drawLineGraph(ctx: any, fromIdx: number) {
    let count: number = this.Sizes.count;
    let y: number = this.getScaledY(fromIdx);
    let idx: number = this.model.getNextIndex(fromIdx);
    let x: number = 0;
    ctx.moveTo(x,y)
    //console.log(`draw idx:${idx} y:${y} x:${x}`);
    while (count-- != 0) {
      y = this.getScaledY(idx);
      x += this.Scales.WScale;
      idx = this.model.getNextIndex(idx);
      ctx.lineTo(x,y);
    }
    ctx.stroke();
  }

  private getScaledY(index: number): number {
    const value: number = this.model.getValueByIndex(index);
    const scaledValue: number = value * this.Scales.HScale;
    const res = this.Scales.Axis - scaledValue;
    return res | 0
  }

  private getHScale(fromIdx: number): number {
    const max: number = this.model.getMaxValue(fromIdx, this.Sizes.count);
    const HScale: number = (this.Scales.Axis / ((max != 0)? max : this.Scales.Axis));
    return HScale;
  }

  public resize(sizes: IViewTrandSizeProp): void {
    const {width, height, count} = {... sizes};
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

}