import { IEventFunction } from "./IEventFunction";

export interface IKeyBoardProps {
  onClick: IEventFunction;
  data: {
      name: string;
      value: string;
      comment: string;
      msu: string;
  }
}