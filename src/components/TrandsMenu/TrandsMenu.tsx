import React, {Component} from 'react'
import './TrandsMenu.css';
import { MenuButton } from './buttons/MenuButton';
import { TougleButton } from './touglebutton/TougleButton';

export interface IToolButton {
  type: string;
  icon: Array<string>;
  isTougle?: boolean;
  onClick: (e: any, state: boolean) => any;
}

export interface ITrandsMenuProps {
  buttons: Array<IToolButton>
}

export default class TrandsMenu extends Component<ITrandsMenuProps,{}> {
  constructor (props:ITrandsMenuProps) {
    super(props)
  }

  private factory(prop:IToolButton, key: number): any {
    const Types: {[type: string]: any} = {
      'TougleButton'  : () => {return (
                        <TougleButton
                          key = {key}
                          icon={prop.icon}
                          isTougle = {prop.isTougle || false}
                          onClick={prop.onClick}/>)},
      'Button' : () => {return (
                        <MenuButton
                          key = {key}
                          icon={prop.icon[0]}
                          onClick={prop.onClick}/>)},
      'default': () => {
          console.log(`${prop.type} not found`)
          return null;
      }
  }
    return (Types[prop.type] || Types['default'])()
  }

  render() {
    const buttons = this.props.buttons.map((value:IToolButton, index: number) =>{
      return this.factory(value, index)
    })

    return (
      <div className="TrandsMenu">
        {buttons}
      </div>
    )
  }
}