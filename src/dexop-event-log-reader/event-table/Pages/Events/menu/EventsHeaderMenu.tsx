import React, { Component } from "react";
import ToolMenu from "../../../../../components/TrandsMenu/ToolMenu";

interface IToolMenuHandler {
  (name: string, status: boolean): void;
}

interface IToolMenuProps {
  toolMenuHandler: IToolMenuHandler;
  isTougle: boolean;
}

export default class EventsHeaderMenu extends Component <IToolMenuProps, {}> {
  render () {
    return (
      <div>
        <ToolMenu elements = {[
            {
              name: 'Search',
              type: 'TougleButton',
              icon: ['fa-trash', 'fa-filter'],
              isTougle: this.props.isTougle,
              onClick: this.props.toolMenuHandler
            }
          ]}/>
      </div>
    )
  }
}
