import { devicesInfoStore } from "../../store/devices/devicesinfo";
import { TModel, IModelProp, EMaxValueMode, IMaxValueMode } from "./models/TModel";
import { factory } from "./models/ModelFactory";

export interface ITrandProp {
  tag: string,//название тега типа U1/RAM/Uexc
  deep: number, //глубина архива
  color: string, //цвет линии тренда
  signed?: boolean, //имеет ли знак (для знаковых нужна ось)
  fraction?: number,
  offset?: string, //"10 %" расположение оси. в примере 10% от нижней линии окна
  MaxValueMode?: string// "MaxOfAllRange", "MaxOfSelectedRange", "Fixed 600"
                       // режим масштабирования по амплидуде 
}

interface ITrandTagProperties {
  deep: number, //глубина архива
  color: string, //цвет линии тренда
  signed: boolean, //имеет ли знак (для знаковых нужна ось)
  fraction: number,
  offset: string, //"10 %" расположение оси. в примере 10% от нижней линии окна
  MaxValueMode: string;
}

const defaultMaxValueMode: string =  `${EMaxValueMode.Fixed} 100`;
const ATagProperties: Array<string> = ['msu','value','comment','objType'];

export class TTrand {
  private tag: string;
  private TrandProps: ITrandTagProperties = {
    deep:0,
    color: 'red',
    signed: false,
    fraction: 0,
    offset: '0',
    MaxValueMode: defaultMaxValueMode
  };

  private model: TModel;

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.TrandProps.deep = prop.deep;
    this.TrandProps.color =prop.color || 'red';
    this.TrandProps.signed = prop.signed || false;
    this.TrandProps.fraction = prop.fraction || 0;
    this.TrandProps.offset = prop.offset || '0';
    this.TrandProps.MaxValueMode = prop.MaxValueMode || defaultMaxValueMode;
    this.model = this.getTagPropertiesForTrand(this.tag)
  }

  public get Model():TModel {
    return this.model;
  }

  private getTagPropertiesForTrand(tag: string): TModel {
    const  {msu, comment, objType} = devicesInfoStore.getTagProperties (tag, ATagProperties);
    const props: IModelProp = {
      deep: this.TrandProps.deep,
      MaxValueMode: this.TrandProps.MaxValueMode
    }
    const model: TModel = factory(objType, props)
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