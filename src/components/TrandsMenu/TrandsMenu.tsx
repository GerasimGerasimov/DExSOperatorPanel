import React, {Component} from 'react'
import './TrandsMenu.css';
import { OnLineButton } from './buttons/OnLine/OnLineButton';
import { DBButton } from './buttons/DB/DBButton';

interface ITrandsMenuProps {

}

export default class TrandsMenu extends Component<ITrandsMenuProps,{}> {
  constructor (props:ITrandsMenuProps) {
    super(props)
  }

  render() {
    const tougleMenu = () => {
      //setVisible(!visible)
    }

    const handleClose = () => {
      //setVisible(false)
    }

  const menu = (
      <div>
        <OnLineButton
            isOpen={true}
            onTougle={tougleMenu}
        />
        <DBButton
            isOpen={true}
            onTougle={tougleMenu}
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