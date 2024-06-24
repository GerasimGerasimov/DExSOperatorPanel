import React, { Component } from "react";
import ToolMenu from "../../components/TrandsMenu/ToolMenu";
import { IToolButtonProps } from "../../interfaces/IToolButtonProps";

interface IToolMenuHandler {
  (name: string, status: boolean): void;
}

interface ITrandsHeaderMenuProps {
  ToolMenuHandler: IToolMenuHandler;
  isTougle: boolean;
}

export default class TrandsHeaderMenu extends Component <ITrandsHeaderMenuProps, {}> {
  private ToolMenu: Array<IToolButtonProps> = [
    {
      name: 'onLine',
      type: 'ToolButton',
      icon: ['fa-network-wired'],
      onClick: this.props.ToolMenuHandler
    },
    {
      name: 'DB',
      type: 'ToolButton',
      icon: ['fa-database'],
      onClick: this.props.ToolMenuHandler
    },
    {
      name: 'PlayPause',
      type: 'TougleButton',
      icon: ['fa-pause-circle', 'fa-play-circle'],
      isTougle: this.props.isTougle, // Trands.Run,
      onClick: this.props.ToolMenuHandler
    },
    {
      name: 'ZoomMinus',
      type: 'ToolButton',
      icon: ['fa-search-minus'],
      onClick: this.props.ToolMenuHandler
    },
    {
      name: 'ZoomPlus',
      type: 'ToolButton',
      icon: ['fa-search-plus'],
      onClick: this.props.ToolMenuHandler
    }
  ]

  render () {
    return (
      <div>
        <ToolMenu elements = {this.ToolMenu}/>
      </div>
    )
  }
}
