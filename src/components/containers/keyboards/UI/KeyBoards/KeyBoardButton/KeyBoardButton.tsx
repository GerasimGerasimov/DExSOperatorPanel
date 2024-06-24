import React, { Component } from 'react';
import { IKeyBoardButtonProps } from '../../../../../../interfaces/IKeyBoardButtonProps';

export default class KeyBoardButton extends Component<IKeyBoardButtonProps, {}> {
  render () {
    return (
        <div className={this.props.position}>
            <button
                className="KeyBoardButton"
                onClick = {this.props.onClick}>{this.props.value}
            </button>
        </div>
    )
  }
}
