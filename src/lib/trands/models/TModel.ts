export interface IModelProp {
  deep: number, //глубина архива
}

export class TModel {
  protected deep: number;

  constructor(props: IModelProp) {
    this.deep = props.deep;
  }
}