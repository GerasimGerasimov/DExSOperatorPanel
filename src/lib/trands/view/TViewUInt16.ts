import { TViewTrand, IViewTrandProp, IViewTrandDrawMethodProps, IViewTrandSizeProp } from "./TViewTrand";


export class TViewUInt16 extends TViewTrand {

  constructor(props: IViewTrandProp) {
    super(props);
    console.log('TViewUInt16')
  }

  public draw(props: IViewTrandDrawMethodProps): void {
    const max = this.model.getMaxValue(props.fromIdx, this.Sizes.count);
    const s = `${this.TrandProp.tag}: ${this.model.EndIndex} max: ${max}`
    props.ctx.strokeStyle = this.TrandProp.color;
    props.ctx.strokeText(s, 150, 20);
    //TODO написать функцию отрисовки графика
  }
  
  public resize(sizes: IViewTrandSizeProp): void {
    const {width, height, count} = {... sizes};
    //при ресайзе меняются:
    //0) ширина-высота области отображения
    this.Sizes.height = height;
    this.Sizes.width = width;
    //1) Положение оси (задано в % от высоты)
    this.Scales.Axis = this.getOffsetInPixels(this.TrandProp.offset);
    //2) Шкалы: вертикальная и горизонтальная
    this.Scales.WScale = width / (count || 1);
    //this.Scales.HScale зависит от maxValue и каждый раз перерасчитывается при выводе
  }

}