//тренды вписанные в один блок графика
import { TTrand } from './trand';

interface ITrandsGroupProp {
  height: string,
  tags: Array<string>
}

class TTrandHeight {
  height: number = 0; //высота графика
  mu: string = 'px';  //единицы измерения
}

export class TTrandsGroup {
  private height: TTrandHeight;
  private tags: Map<string, TTrand>;

  constructor (props: ITrandsGroupProp) {
    this.height = this.setHeightProps(props.height);
    this.tags = this.setTagsProps(props.tags);
  }

  private setHeightProps(prop: string): TTrandHeight {
    const [height, mu] = prop.split(' ');
    return {
      height: Number(height),
      mu
    }
  }

  private setTagsProps(props: Array<string>): Map<string, TTrand> {
    const tags: Map<string, TTrand> = new Map();
    for (const key in props) {
      const value: any = props[key];
      const trand: TTrand = new TTrand(key, value);
      tags.set(key, trand)
      console.log(value)
    }
    return tags;
  }

  
}