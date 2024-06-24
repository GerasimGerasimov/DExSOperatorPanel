import React, { Component } from "react";
import ToolMenu from "../../../components/TrandsMenu/ToolMenu";
import { IToolMenuProps } from "../../../interfaces/IToolMenuProps";

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
              onClick: this.props.ToolMenuHandler
            }
          ]}/>
      </div>
    )
  }
}
