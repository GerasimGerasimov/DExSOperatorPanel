import { IMaxValueMode } from "../../../interfaces/IMaxValueMode";
import { IModelProps } from "../../../interfaces/IModelProp";

export enum EMaxValueMode {
  MaxOfAllRange = "MaxOfAllRange",
  MaxOfSelectedRange = "MaxOfSelectedRange",
  Fixed = "Fixed"
}

const defaultMaxValueMode: string = `${EMaxValueMode.Fixed} 100`;

type TypedArray =
  Int8Array |
  Uint8Array |
  Uint8ClampedArray |
  Int16Array |
  Uint16Array |
  Int32Array |
  Uint32Array |
  Float32Array |
  Float64Array;

export abstract class TModel {
  protected data: TypedArray | [] = [];
  public readonly msu: string; // единицы измерения
  public readonly fraction: number; // кол-во знаков после запятой
  protected objType: string;
  protected deep: number;
  protected endIndex: number = 0;
  protected MaxValueMode: IMaxValueMode = {
    mode: `${EMaxValueMode.Fixed}`,
    value: 100
  }

  // варианты максимального значения
  protected FixedMaxValue: number = 0;
  protected MaxOfAllRange: number = 0;
  protected MaxOfSelectedRange: number = 0;
  protected TemporaryMaxValue: number = 0;

  constructor (props: IModelProps) {
    this.objType = props.objType;
    this.deep = props.deep;
    this.msu = props.msu;
    this.fraction = props.fraction;
    this.MaxValueMode = this.setMaxValueMode(props.MaxValueMode)
  }

  public setValue (value: any) {
    this.data[this.endIndex] = value;
    const endIndex = ++this.endIndex;
    this.endIndex = (endIndex >= this.deep) ? 0 : endIndex;
  }

  public getStringValueByIndex (index: number): string {
    return this.data[index].toFixed(this.fraction);
  }

  public getValueByIndex (index: number): any {
    return this.data[index];
  }

  public get EndIndex (): number {
    let idx = this.endIndex;
    const res = (--idx < 0) ? this.deep - 1 : idx;
    return res;
  }

  public get ObjType (): string {
    return this.objType;
  }

  public getLoopIndex (index: number): number {
    let res: number = 0;
    const mod: number = index % this.deep;
    res = (mod === 0) ? index : mod;
    return res;
  }

  public getNextIndex (index: number): number {
    let idx: number = index;
    if (++idx >= this.deep) {
      idx = 0
    }
    return idx;
  }

  public setMaxValueMode (prop: string | undefined, defaultProp: string = defaultMaxValueMode): IMaxValueMode {
    const modeValue: string = prop || defaultProp;
    const [mode, value] = modeValue.split(' ');
    const result: IMaxValueMode = {
      mode,
      value: Number(value) | 0
    }
    this.FixedMaxValue = result.value;
    this.MaxOfAllRange = 0;
    this.MaxOfSelectedRange = 0;
    this.TemporaryMaxValue = 0;
    return result;
  }

  public getMaxValue (fromIdx?: number, count?: number): number { // gets maximum values from tags for updating of graph scaling
    const { mode } = { ...this.MaxValueMode }
    let res: number = 0;
    switch (mode) {
      case EMaxValueMode.Fixed:
          res = this.FixedMaxValue;
        break;
      case EMaxValueMode.MaxOfAllRange:
        res = this.MaxOfAllRange;
        break;
      case EMaxValueMode.MaxOfSelectedRange:
          res = this.MaxOfSelectedRange = this.getMaxValueOfselectedRange(fromIdx || 0, count || 0)
        break;
      default: res = this.FixedMaxValue;
        break;
    }
    return res;
  }

  protected abstract getMaxValueOfselectedRange (FromIdx: number, Count: number): number;

  protected setMaxOfAllRange (value: number) {
    const absValue: number = Math.abs(value);
    if (absValue > this.MaxOfAllRange) {
      this.MaxOfAllRange = absValue;
    }
  }
}
