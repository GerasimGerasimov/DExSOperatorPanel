import React, {Component} from 'react'
import './Modal.css'

export default class Modal extends Component<{}, {}> {

  constructor (props: any){
    super(props)
  }

  render() {
    return (
    <div className="Modal">
      {this.props.children}
    </div>
  )}
}