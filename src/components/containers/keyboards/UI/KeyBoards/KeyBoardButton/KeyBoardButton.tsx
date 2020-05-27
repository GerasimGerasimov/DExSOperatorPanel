import React, {Component} from 'react'
import {IKeyBoardButtonProps } from '../IKeyBoards';

export default class KeyBoardButton extends Component<IKeyBoardButtonProps, {}> {

  constructor (props: any){
    super(props)
  }

  render() {
    return(
        <div className={this.props.position}>
            <button
                className="KeyBoardButton"
                onClick = {this.props.onClick}>{this.props.value}
            </button>
        </div>
    )
  }
}