import React, {Component} from 'react'
import './ToolMenu.css';
import { MenuButton } from './buttons/MenuButton';
import { TougleButton } from './touglebutton/TougleButton';

export interface IToolButton {
  name: string;
  type: string;
  icon: Array<string>;
  isTougle?: boolean;
  onClick: any;//(name: string, state: boolean) => any;
}

export interface ITrandsMenuProps {
  elements: Array<IToolButton>
}

export default class ToolMenu extends Component<ITrandsMenuProps,{}> {
  constructor (props:ITrandsMenuProps) {
    super(props)
  }

  private factory(prop:IToolButton, key: number): any {
    const Types: {[type: string]: any} = {
      'TougleButton'  : () => {return (
                        <TougleButton
                          key = {key}
                          name = {prop.name}
                          icon={prop.icon}
                          isTougle = {prop.isTougle || false}
                          onClick={prop.onClick}/>)},
      'Button' : () => {return (
                        <MenuButton
                          key = {key}
                          name = {prop.name}
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
    const buttons = this.props.elements.map((value:IToolButton, index: number) =>{
      return this.factory(value, index)
    })

    return (
      <div className="ToolMenu">
        {buttons}
      </div>
    )
  }
}