export interface IMenuToolButtonProp {
  name: string;
  type: string;
  icon: Array<string> | string;
  onClick: any;//(name: string, state: boolean) => any;
}