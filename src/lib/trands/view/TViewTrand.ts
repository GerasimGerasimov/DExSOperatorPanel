import { ITrandTagProperties } from "../itrand";
import { TModel } from "../models/TModel";

export interface IViewTrandProp {
  TrandProp: ITrandTagProperties;
  model: TModel;
  width: number;
  height: number;
}

export interface IViewTrandDrawProps {
  ctx: any;
  fromIdx: number;
  count: number;
}

export class TViewTrand {
  protected TrandProp: ITrandTagProperties;
  protected model: TModel;
  protected width: number;
  protected height: number;

  constructor(props: IViewTrandProp) {
    this.TrandProp = props.TrandProp;
    this.model = props.model;
    this.width = props.width;
    this.height = props.height;
  }

  public draw(props: IViewTrandDrawProps){

  }
  
}