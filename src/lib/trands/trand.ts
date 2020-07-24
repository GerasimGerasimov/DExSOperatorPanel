import { devicesInfoStore } from "../../store/devices/devicesinfo";
import { TModel, IModelProp } from "./models/TModel";
import { factory } from "./models/ModelFactory";

export enum EMaxValueMode {
  MaxOfAllRange = "MaxOfAllRange",
  MaxOfSelectedRange = "MaxOfSelectedRange",
  Fixed = "Fixed"
}

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

interface IMaxValueMode {
  mode: string,// "MaxOfAllRange", "MaxOfSelectedRange", "Fixed 600"
  // режим масштабирования по амплидуде
  value: number// для режима Fixed
}

interface ITrandTagProperties {
  deep: number, //глубина архива
  color: string, //цвет линии тренда
  signed: boolean, //имеет ли знак (для знаковых нужна ось)
  fraction: number,
  offset: string, //"10 %" расположение оси. в примере 10% от нижней линии окна
  MaxValueMode: IMaxValueMode;
}



export class TTrand {
  private tag: string;
  private TrandProps: ITrandTagProperties = {
    deep:0,
    color: 'red',
    signed: false,
    fraction: 0,
    offset: '0',
    MaxValueMode: {
      mode: `${EMaxValueMode.Fixed}`,
      value: 100
    }
  };

  private model: TModel;

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.TrandProps.deep = prop.deep;
    this.TrandProps.color =prop.color || 'red';
    this.TrandProps.signed = prop.signed || false;
    this.TrandProps.fraction = prop.fraction || 0;
    this.TrandProps.offset = prop.offset || '0';
    this.TrandProps.MaxValueMode = this.setMaxValueMode(prop.MaxValueMode)
    this.model = this.getTagPropertiesForTrand(this.tag)
  }

  private setMaxValueMode (prop: string | undefined, defaultProp: string = `${EMaxValueMode.Fixed} 100`): IMaxValueMode {
    const modeValue: string = prop || defaultProp;
    const [mode, value] =  modeValue.split(' ');
    const result: IMaxValueMode = {
      mode,
      value: Number(value) | 0
    }
    return result;
  }

  private getTagPropertiesForTrand(tag: string): TModel {
    const  {msu, comment, objType} = devicesInfoStore.getTagProperties (tag, ['msu','value','comment','objType']);
    const props: IModelProp = {
      deep: this.TrandProps.deep
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