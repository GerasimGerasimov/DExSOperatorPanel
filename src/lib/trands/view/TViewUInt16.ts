import { TViewTrand, IViewTrandProp, IViewTrandDrawProps } from "./TViewTrand";


export class TViewUInt16 extends TViewTrand {

  constructor(props: IViewTrandProp) {
    super(props);
    console.log('TViewUInt16')
  }

  public draw(props: IViewTrandDrawProps){
    const max = this.model.getMaxValue(props.fromIdx, props.count);
    const s = `${this.TrandProp.tag}: ${this.model.EndIndex} max: ${max}`
    props.ctx.strokeStyle = this.TrandProp.color;
    props.ctx.strokeText(s, 150, 20);
    //TODO написать функцию отрисовки графика
  }
  
}