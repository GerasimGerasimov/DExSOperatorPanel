//тренды вписанные в один блок графика
import { TTrand, ITrandProp } from './trand';

interface ITrandsGroupProp {
  height: string,
  tags: Array<string>
}

export class TTrandHeight {
  height: number = 0; //высота графика
  mu: string = 'px';  //единицы измерения
}

export class TTrandsGroup {
  private deep: number; //глубина архива
  private height: TTrandHeight;
  private tags: Map<string, TTrand>;

  constructor (deep: number, props: ITrandsGroupProp) {
    this.deep = deep;
    this.height = this.setHeightProps(props.height);
    this.tags = this.setTagsProps(props.tags);
  }

  public getTagNameList(): string{
    return 'TTrandsGroup'
  }

  public getBoxHeight():TTrandHeight{
    return this.height;
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
      const trandProp: ITrandProp = {
        tag: key,
        deep: this.deep,
        ...value
      }
      const trand: TTrand = new TTrand(trandProp);
      tags.set(key, trand)
      console.log(value)
    }
    return tags;
  }

  public setTagsValues() {
    this.tags.forEach((tag:TTrand) => {
      tag.setValueToEnd(Math.random()*256)
    })
  }
}