interface ITrandProp {
  height: string,
  tags: Array<string>
}

class TTrandHeight {
  height: number = 0; //высота графика
  mu: string = 'px';  //единицы измерения
}

export class TTrand {
  private height: TTrandHeight;

  constructor(prop: ITrandProp){
    const [height, mu] = prop.height.split(' ');
    this.height = {
      height: Number(height),
      mu
    }
  }
}