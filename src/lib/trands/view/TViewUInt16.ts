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

  public draw(props: IViewTrandDrawMethodProps): void {
    props.ctx.beginPath();
    const s = `${this.TrandProp.tag}: ${this.model.EndIndex}`;// max: ${max}
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
    //вычислить вертикальную шкалу HScale
    this.Scales.HScale = this.getHScale(props.fromIdx);
    //собственна график
    this.drawLineGraph(props.ctx, this.model.EndIndex);//props.fromIdx);
  }
  
  private drawAxis(props: IAxisProps) {
    props.ctx.moveTo(0, props.AxisY);
    props.ctx.lineTo(props.width, props.AxisY);
    props.ctx.stroke();
  }

  private drawLineGraph(ctx: any, fromIdx: number) {
    let count: number = this.Sizes.count;
    let idx: number = fromIdx;
    let y: number = this.getScaledY(idx++)
    let x: number = 0;
    ctx.moveTo(x,y)
    while (count-- != 0) {
      y = this.getScaledY(idx++);
      x += this.Scales.WScale;
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
    const HScale: number = (this.Scales.Axis / max);
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
    this.Scales.WScale = width / (count || 1);
    //this.Scales.HScale зависит от maxValue и каждый раз перерасчитывается при выводе
  }

}