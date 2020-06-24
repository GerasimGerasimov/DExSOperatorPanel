import { devicesInfoStore } from "../../store/devices/devicesinfo";

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

  constructor(prop: ITrandProp){
    this.tag = prop.tag;
    this.deep = prop.deep;
    this.color = prop.color || 'red';
    this.signed = prop.signed || false;
    this.fraction = prop.fraction || 0;
    this.getTagPropertiesForTrand(this.tag)
    
  }

  private getTagPropertiesForTrand(tag: string) {
    const  {msu, comment, objType, value} = devicesInfoStore.getTagProperties (tag, ['msu','value','comment','objType']);
    console.log(msu, comment, objType, value);
  }
}