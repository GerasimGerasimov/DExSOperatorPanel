import React, { Component } from 'react';
import './ToolMenu.css';
import { ToolButton } from './buttons/ToolButton/ToolButton';
import { TougleButton } from './buttons/touglebutton/TougleButton';
import { ITrandsMenuProps } from '../../interfaces/ITrandsMenuProps';
import { IToolButtonProps } from '../../interfaces/IToolButtonProps';

export default class ToolMenu extends Component<ITrandsMenuProps, {}> {
  private factory (props: IToolButtonProps, key: number): any {
    const types: {[type: string]: any} = {
      'TougleButton': () => {
          return (
            <TougleButton
              { ... props }
              key = {key}
              />
          )
        },
      'ToolButton': () => {
          return (
            <ToolButton
              { ...props }
              key = {key}
              />
          )
        },
      'default': () => {
          console.log(`${props.type} not found`)
          return null;
        }
  }
    return (types[props.type] || types['default'])()
  }

  render () {
    const buttons = this.props.elements.map((value:IToolButtonProps, index: number) => {
      return this.factory(value, index);
    })

    return (
      <div className="ToolMenu">
        {buttons}
      </div>
    )
  }
}
