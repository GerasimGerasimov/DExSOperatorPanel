interface ITrandProp {
  color: string,
  signed?: boolean,
  fraction?: number
}

export class TTrand {
  private tag: string;
  private color: string;
  private signed: boolean;
  private fraction: number;

  constructor(tag: string, prop: ITrandProp){
    this.tag = tag;
    this.color = prop.color || 'red';
    this.signed = prop.signed || false;
    this.fraction = prop.fraction || 0;
  }

}