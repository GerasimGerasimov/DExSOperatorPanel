export interface ITougleButtonProp {
  isTougle?: boolean;
}

export interface IToolButtonProps extends ITougleButtonProp {
  name: string;
  type: string;
  icon: Array<string> | string;
  onClick: any;//(name: string, state: boolean) => any;
}