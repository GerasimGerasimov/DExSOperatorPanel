import { TModel, IModelProp } from "./TModel";

export class TModelUInt16 extends TModel {
  private data: Uint16Array;

  constructor(props: IModelProp) {
    super(props);
    this.data = new Uint16Array(this.deep)
  }

  public setValue(value: any) {
    super.setMaxOfAllRange(value);
    this.data[this.endIndex] = value;
    const endIndex = ++this.endIndex;
    this.endIndex = (endIndex >= this.deep)
                    ? 0
                    : endIndex;
  }

  public getMaxValueOfselectedRange(FromIdx: number, Count: number): number {
    let max: number = 0;
    let value: number = 0;
    let index: number = FromIdx;
    let idx: number = 0;
    while (Count-- != 0) {
      if ((idx = index++) >= this.deep) {
        idx = idx - this.deep;
      }
      if ((value = Math.abs(this.data[idx])) > max) {
        max = value
      }
    }
    return max;
  }

  public getValueByIndex(index: number): any {
    return this.data[index]
  }
}