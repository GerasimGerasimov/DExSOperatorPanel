import React, {Component} from 'react'
import './Modal.css'

export interface IModalProps {
  classes?: string;
  children?: any;
}

export default class Modal extends Component<IModalProps, {}> {
  private cls: Array<string> = [
    'Modal',
    this.props.classes || ''
  ];

  render() {
    return (
    <div className={this.cls.join(' ')}>
      {this.props.children}
    </div>
  )}
}