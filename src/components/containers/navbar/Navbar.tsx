import React , { useState }  from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import { MenuTougle } from '../../MenuTougle/MenuTougle';
import Modal from '../../HOC/Modal/Modal';

export const Navbar:React.FunctionComponent = (props) => {
    
    const [visible, setVisible] = useState(false);

    const cls = [
        'navbar-dark',
        'bg-primary',
    ]

    const NavLinkCls: string = "nav-link p-1 bg-primary";

    const tougleMenu = () => {
        setVisible(!visible)
    }

    const handleClose = () => {
        setVisible(false)
    }

    const navbar = (visible)
        ? (
            <div>
              <Modal classes="content-right">
                <nav className={cls.join(' ')} onClick={handleClose}>
                  <ul className="navbar-nav">
                    <li>
                      <NavLink exact to="/" className={NavLinkCls}>Home</NavLink>
                    </li>
                    <li>
                      <NavLink to="/devices" className={NavLinkCls}>Devices</NavLink>
                    </li>
                    <li>
                      <NavLink to="/about" className={NavLinkCls}>About</NavLink>
                    </li>
                  </ul>
                </nav>
              </Modal>
            </div>
        )
        : null;
    
    return (
        <div>
            {navbar}
            <div
                className="NavBar">
                <MenuTougle
                    isOpen={visible}
                    onTougle={tougleMenu}
                />
            </div>
        </div>
    )
}