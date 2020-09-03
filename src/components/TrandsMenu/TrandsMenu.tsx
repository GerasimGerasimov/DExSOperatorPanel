import React, {Component} from 'react'
import './TrandsMenu.css';
import { MenuButton } from './buttons/MenuButton';

interface ITrandsMenuProps {

}

export default class TrandsMenu extends Component<ITrandsMenuProps,{}> {
  constructor (props:ITrandsMenuProps) {
    super(props)
  }

  render() {
    const handlerOnLine = () => {
      console.log('OnLine')
    }

    const handlerDB = () => {
      console.log('DB')
    }

  const menu = (
      <div>
        <MenuButton
          icon={'fa-network-wired'}
          isPressed = {true}
          onClick={handlerOnLine}
        />
        <MenuButton
          icon={'fa-database'}
          isPressed = {false}
          onClick={handlerDB}
        />
      </div>
  )
    return (
      <div className="TrandsMenu">
        {menu}
      </div>
    )
  }
}