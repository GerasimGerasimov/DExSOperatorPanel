import { TModel, IModelProp } from "./TModel";

export class TModelInt16 extends TModel {
  constructor(props: IModelProp) {
    super(props);
  }

  public setValue(value: any): void {}

  public getValueByIndex(index: number): any {}
  
  protected getMaxValueOfselectedRange(FromIdx: number, Count: number): number {
    return 0;
  }
}