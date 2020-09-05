import React, {Component} from 'react'
import './ToolMenu.css';
import { ToolButton } from './buttons/ToolButton/ToolButton';
import { TougleButton } from './buttons/touglebutton/TougleButton';


export interface IToolButtonProps {
  name: string;
  type: string;
  icon: Array<string>;
  isTougle?: boolean;
  onClick: any;//(name: string, state: boolean) => any;
}

export interface ITrandsMenuProps {
  elements: Array<IToolButtonProps>
}

export default class ToolMenu extends Component<ITrandsMenuProps,{}> {
  constructor (props:ITrandsMenuProps) {
    super(props)
  }

  private factory(prop:IToolButtonProps, key: number): any {
    const Types: {[type: string]: any} = {
      'TougleButton'  : () => {return (
                        <TougleButton
                          {... prop}
                          key = {key}
                          />)},
      'ToolButton' : () => {return (
                        <ToolButton
                          {... prop}
                          key = {key}
                          />)},
      'default': () => {
          console.log(`${prop.type} not found`)
          return null;
      }
  }
    return (Types[prop.type] || Types['default'])()
  }

  render() {
    const buttons = this.props.elements.map((value:IToolButtonProps, index: number) =>{
      return this.factory(value, index)
    })

    return (
      <div className="ToolMenu">
        {buttons}
      </div>
    )
  }
}