import React, {Component} from 'react'

export default class Modal extends Component<{}, {}> {

  constructor (props: any){
    super(props)
  }

  render() {
    return (
    <div className="modal">
      {this.props.children}
    </div>
  )}
}