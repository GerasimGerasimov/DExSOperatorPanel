import { TModel, IModelProp } from "./TModel";

export class TModelBool extends TModel {

  constructor(props: IModelProp) {
    super(props);
    this.data = new Uint8Array(this.deep)
  }

  public setValue(value: any) {
    super.setValue((value !==0 )?1:0);
    //super.setValue((value > 64 )?1:0);//TODO убрать после отладки
  }

  protected getMaxValueOfselectedRange(FromIdx: number, Count: number): number {
    return 1;
  }

}