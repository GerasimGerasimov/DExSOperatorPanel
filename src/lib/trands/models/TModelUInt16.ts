import { TModel, IModelProp } from "./TModel";

export class TModelUInt16 extends TModel {
  private data: Uint16Array;

  constructor(props: IModelProp) {
    super(props);
    this.data = new Uint16Array(this.deep)
  }
}