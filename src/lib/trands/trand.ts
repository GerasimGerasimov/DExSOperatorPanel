import { devicesInfoStore } from "../../store/devices/devicesinfo";
import { TModel, IModelProp, EMaxValueMode, IMaxValueMode } from "./models/TModel";
import ModelFactory from "./models/ModelFactory";
import { ITrandTagProperties, ITrandProp } from "./itrand";

const defaultMaxValueMode: string =  `${EMaxValueMode.Fixed} 100`;
const ATagProperties: Array<string> = ['msu','value','comment','objType'];

export class TTrand {
  private tag: string;
  private TrandProps: ITrandTagProperties = {
    tag:'',
    deep:0,
    color: 'red',
    signed: false,
    fraction: 0,
    offset: '100',//100% соответсвует нижнему расположению оси
    MaxValueMode: defaultMaxValueMode
  };

  private model: TModel;

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.TrandProps.tag = prop.tag;
    this.TrandProps.deep = prop.deep;
    this.TrandProps.color =prop.color || 'red';
    this.TrandProps.signed = prop.signed || false;
    this.TrandProps.fraction = prop.fraction || 0;
    this.TrandProps.offset = prop.offset || '0';
    this.TrandProps.MaxValueMode = prop.MaxValueMode || defaultMaxValueMode;
    this.model = this.getTagPropertiesForTrand(this.tag)
  }

  public get TrandTagProps(): ITrandTagProperties {
    return this.TrandProps;
  }

  public get Color(): string {
    return this.TrandProps.color;
  }

  public get Tag(): string {
    return this.tag;
  }

  public get Model():TModel {
    return this.model;
  }

  private getTagPropertiesForTrand(tag: string): TModel {
    const  {msu, comment, objType} = devicesInfoStore.getTagProperties (tag, ATagProperties);
    const props: IModelProp = {
      objType,
      deep: this.TrandProps.deep,
      MaxValueMode: this.TrandProps.MaxValueMode
    }
    const model: TModel = ModelFactory(objType, props)
    return model;
  }

  public setValueToModel(value: any) {
    //const max: number = this.model.getMaxValue(0, 5);
    //console.log(`tag ${this.tag} max: ${max}`)
    this.model.setValue(value);
  }

  public getValueByIndex(index: number): any {
    return this.model.getValueByIndex(index)
  }
}