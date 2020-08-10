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
  constructor(props: IViewTrandProp) {

  }

  public draw(props: IViewTrandDrawProps){

  }
  
}