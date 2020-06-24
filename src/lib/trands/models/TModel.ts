export interface IModelProp {
  deep: number, //глубина архива
}

export class TModel {
  protected deep: number;
  protected endIndex: number = 0;

  constructor(props: IModelProp) {
    this.deep = props.deep;
  }

  public setValueToEnd(value: any) {

  }

  public getValueByIndex(index: number): any {
    return 0;
  }
}