import React, { Component } from "react";
import ToolMenu from "../../../../components/ToolMenu/ToolMenu";

interface IToolMenuHandler {
  (name: string, status: boolean): void;
}

export interface IToolMenuProps {
  ToolMenuHandler: IToolMenuHandler;
  isTougle: boolean;
}

export default class EventsHeaderMenu extends Component <IToolMenuProps,{}> {

  constructor(props: IToolMenuProps) {
    super(props);

  }

  render () {
    return (
      <div>
        <ToolMenu elements = {[
            { name: 'Search', type:'TougleButton', icon:['fa-trash', 'fa-filter'],
              isTougle: this.props.isTougle,
              onClick:this.props.ToolMenuHandler}
          ]}/>
      </div>
    )
  }
}