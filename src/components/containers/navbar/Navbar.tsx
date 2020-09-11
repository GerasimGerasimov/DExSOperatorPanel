import React , { useState }  from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import Modal from '../../HOC/Modal/Modal';
import { MenuTougle } from '../../MenuTougle/MenuTougle';
import { BackHistory } from '../../BackHistory/BackHistory';

export const Navbar:React.FunctionComponent = (props) => {
    
    const [visible, setVisible] = useState(false);
    
    const cls = [
        'navbar-dark',
        'bg-primary',
        'h-100'
    ]

    const NavLinkCls: string = "nav-link p-1 bg-primary";

    const tougleMenu = () => {
        setVisible(!visible)
    }

    const handleClose = () => {
        setVisible(false)
    }

    const navbar = (
      <div className="NavBarWrapper">
        <div className="NavBarSizes"></div>
        <nav className={cls.join(' ')} onClick={handleClose}>
          <ul className="navbar-nav">
            <li><NavLink exact to="/" className={NavLinkCls}>Home</NavLink></li>
            <li><NavLink to="/trands" className={NavLinkCls}>Trands</NavLink></li>
            <li><NavLink to="/devices" className={NavLinkCls}>Devices</NavLink></li>
            <li><NavLink to="/about" className={NavLinkCls}>About</NavLink></li>
          </ul>
        </nav>
      </div>
    )

    const menubar = (
        <div
          className="NavBar">
          <BackHistory
              onBack={()=>{
                if (window.history.state !== null) {
                  window.history.back();
                }
              }}
          />
          <MenuTougle
              isOpen={visible}
              onTougle={tougleMenu}
          />
        </div>
    )

    const modal = (visible)
        ? (
            <div>
              <Modal classes="content-right">
                {navbar}
              </Modal>
            </div>
        )
        : null;

    return (
        <div>
            {modal}
            {menubar}
        </div>
    )
}