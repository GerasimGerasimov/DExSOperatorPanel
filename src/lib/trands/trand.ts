import { devicesInfoStore } from "../../store/devices/devicesinfo";
import { TModel, IModelProp } from "./models/TModel";
import { factory } from "./models/ModelFactory";

export interface ITrandProp {
  tag: string,//название тега типа U1/RAM/Uexc
  deep: number, //глубина архива
  color: string,
  signed?: boolean,
  fraction?: number
}

export class TTrand {
  private tag: string;
  private deep: number;
  private color: string;
  private signed: boolean;
  private fraction: number;
  private model: TModel;

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.deep = prop.deep;
    this.color = prop.color || 'red';
    this.signed = prop.signed || false;
    this.fraction = prop.fraction || 0;
    this.model = this.getTagPropertiesForTrand(this.tag)
  }

  private getTagPropertiesForTrand(tag: string): TModel {
    const  {msu, comment, objType} = devicesInfoStore.getTagProperties (tag, ['msu','value','comment','objType']);
    const props: IModelProp = {
      deep: this.deep
    }
    const model: TModel = factory(objType, props)
    return model;
  }

  public setValueToEnd(value: any) {
    this.model.setValueToEnd(value);
  }

  public getValueByIndex(index: number): any {
    return this.model.getValueByIndex(index)
  }
}