import React, {Component} from 'react'
import './ToolMenu.css';
import { ToolButton } from './buttons/ToolButton/ToolButton';
import { TougleButton } from './buttons/touglebutton/TougleButton';
import { IToolButtonProps } from './buttons/iToolButton';


export interface ITrandsMenuProps {
  elements: Array<IToolButtonProps>
}

export default class ToolMenu extends Component<ITrandsMenuProps,{}> {
  
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