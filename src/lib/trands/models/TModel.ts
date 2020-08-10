export enum EMaxValueMode {
  MaxOfAllRange = "MaxOfAllRange",
  MaxOfSelectedRange = "MaxOfSelectedRange",
  Fixed = "Fixed"
}

const defaultMaxValueMode: string =  `${EMaxValueMode.Fixed} 100`;

export interface IMaxValueMode {
  mode: string,// "MaxOfAllRange", "MaxOfSelectedRange", "Fixed 600"
  // режим масштабирования по амплидуде
  value: number// для режима Fixed
}

export interface IModelProp {
  objType: string;
  deep: number, //глубина архива
  MaxValueMode: string;
}

export class TModel {
  protected objType: string;
  protected deep: number;
  protected endIndex: number = 0;
  protected MaxValueMode: IMaxValueMode = {
    mode: `${EMaxValueMode.Fixed}`,
    value: 100
  }
  //варианты максимального значения
  protected FixedMaxValue: number = 0;
  protected MaxOfAllRange: number = 0;
  protected MaxOfSelectedRange: number = 0;
  protected TemporaryMaxValue: number = 0;

  constructor(props: IModelProp) {
    this.objType = props.objType;
    this.deep = props.deep;
    this.MaxValueMode = this.setMaxValueMode(props.MaxValueMode)
  }
  
  public get EndIndex(): number {
    return this.endIndex;
  }
  
  public get ObjType(): string {
    return this.objType;
  }

  public setMaxValueMode (prop: string | undefined, defaultProp: string = defaultMaxValueMode): IMaxValueMode {
    const modeValue: string = prop || defaultProp;
    const [mode, value] =  modeValue.split(' ');
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

  public getMaxValue(FromIdx?: number, Count?:number): number {
    const {mode} = {... this.MaxValueMode}
    let res: number = 0;
    switch (mode) {
      case EMaxValueMode.Fixed:
          res = this.FixedMaxValue;
        break;
      case EMaxValueMode.MaxOfAllRange:
        res = this.MaxOfAllRange;
        break;
      case EMaxValueMode.MaxOfSelectedRange:
          res = this.MaxOfSelectedRange = this.getMaxValueOfselectedRange(FromIdx || 0, Count || 0)
        break;
      default: res = this.FixedMaxValue;
        break;
    }
    return res;
  }

  protected getMaxValueOfselectedRange(FromIdx: number, Count: number): number {
    return 0;
  }

  protected setMaxOfAllRange(value: number) {
    const absValue: number = Math.abs(value);
    if ( absValue > this.MaxOfAllRange) {
      this.MaxOfAllRange = absValue;
    }
  }

  public setValue(value: any) {

  }

  public getValueByIndex(index: number): any {
    return 0;
  }
}