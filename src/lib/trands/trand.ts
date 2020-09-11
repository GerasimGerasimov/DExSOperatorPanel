import { devicesInfoStore, TParameter } from "../../store/devices/devicesinfo";
import { TModel, IModelProp, EMaxValueMode} from "./models/TModel";
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
    MaxValueMode: defaultMaxValueMode,
  };

  private model: TModel;
  private parameter: TParameter | undefined;

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.TrandProps.tag = prop.tag;
    this.TrandProps.deep = prop.deep;
    this.TrandProps.color =prop.color || 'red';
    this.TrandProps.signed = prop.signed || false;
    this.TrandProps.fraction = prop.fraction || 0;
    this.TrandProps.offset = prop.offset || '0';
    this.TrandProps.MaxValueMode = prop.MaxValueMode || defaultMaxValueMode;
    this.model = this.getTagPropertiesForTrand(this.tag);
    this.parameter = this.getDeviceParameter();
  }

  public get TrandTagProps(): ITrandTagProperties {
    return this.TrandProps;
  }

  public getModelEndIndex(): number {
    return this.model.EndIndex
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
      MaxValueMode: this.TrandProps.MaxValueMode,
      msu,
      fraction: this.TrandProps.fraction
    }
    const model: TModel = ModelFactory(objType, props)
    return model;
  }

  private getDeviceParameter(): TParameter | undefined {
    const parameter:TParameter | undefined= devicesInfoStore.getParameter(this.tag);
    return parameter;
  }

  public getTagValue(): any {
    //const value: string = devicesInfoStore.getTagValue (this.tag);
    const value: string = this.parameter?.value || '0';
    return value
  }

  public setValueToModel(value: any) {
    this.model.setValue(value);
  }

  public getValueByIndex(index: number): any {
    return this.model.getValueByIndex(index)
  }
}