import { TViewTrand, IViewTrandDrawMethodProps} from "./TViewTrand";
import { IAxisProps } from "./IView";

export class TViewBool extends TViewTrand {

  protected getScaledY(index: number): number {
    const value: number = this.model.getValueByIndex(index);
    const scaledValue: number = (value !== 0)? 10 : 0;//value * this.Scales.HScale;
    const res = this.Scales.Axis - scaledValue;
    return res | 0
  }

  public draw(props: IViewTrandDrawMethodProps): void {
    props.ctx.beginPath();
    //const s = `${this.TrandProp.tag}: ${this.model.EndIndex} fromIdx: ${props.fromIdx}`;
    props.ctx.strokeStyle = this.TrandProp.color;
    props.ctx.fillStyle = this.TrandProp.color;
    //props.ctx.strokeText(s, 150, 20);
    //отрисовка Оси
    const AxisProps: IAxisProps = {
      ctx: props.ctx,
      AxisY: this.Scales.Axis,
      width: this.Sizes.width,
      color: this.TrandProp.color
    }
    this.drawAxis(AxisProps);
    const startPosition: number = this.getStartPosition(this.model.EndIndex, props.fromIdx)
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
    let dY: number = 0;
    while (count-- !== 0) {
      y = this.getScaledY(idx);
      x += this.Scales.WScale;
      idx = this.model.getNextIndex(idx);
      dY = this.Scales.Axis-y;
      if (dY) {ctx.fillRect(x, y, this.Scales.WScale, dY)};
    }
  }
}