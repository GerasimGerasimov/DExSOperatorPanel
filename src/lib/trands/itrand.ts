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

export interface ITrandTagProperties {
  tag: string,//название тега типа U1/RAM/Uexc
  deep: number, //глубина архива
  color: string, //цвет линии тренда
  signed: boolean, //имеет ли знак (для знаковых нужна ось)
  fraction: number,
  offset: string, //"10 %" расположение оси. в примере 10% от нижней линии окна
                  // для пересчёта в пикселы px при ресайзе
  MaxValueMode: string;
}