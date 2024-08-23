import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import Modal from '../../HOC/Modal/Modal';
import { MenuTougle } from '../../MenuTougle/MenuTougle';
import { BackHistory } from '../../BackHistory/BackHistory';

type NavbarProps = {
};

export const Navbar: React.FunctionComponent = (props: NavbarProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const cls = [
        'navbar-dark',
        'bg-primary',
        'h-100'
    ];

    const NavLinkCls: string = "nav-link p-1 bg-primary NavLinkFont";

    const tougleMenu = () => {
        setIsVisible(!isVisible)
    }

    const handleClose = () => {
        setIsVisible(false)
    }

    const navbar = (
      <div className="NavBarWrapper">
        <div className="NavBarSizes"></div>
        <nav className={cls.join(' ')} onClick={handleClose}>
          <ul className="navbar-nav">
            <li><NavLink exact to="/" className={NavLinkCls}>Home</NavLink></li>
            <li><NavLink to="/trands" className={NavLinkCls}>Trands</NavLink></li>
            <li><NavLink to="/users" className={NavLinkCls}>Users</NavLink></li>
            <li><NavLink to="/devices" className={NavLinkCls}>Devices</NavLink></li>
            <li><NavLink to="/events" className={NavLinkCls}>Events</NavLink></li>
            <li><NavLink to="/system" className={NavLinkCls}>System</NavLink></li>
            <li><NavLink to="/about" className={NavLinkCls}>About</NavLink></li>
          </ul>
        </nav>
      </div>
    )

    const menubar = (
        <div
          className="NavBar">
          <BackHistory
              onBack={() => {
                if (window.history.state !== null) {
                  window.history.back();
                }
              }}
          />
          <MenuTougle
              isOpen={isVisible}
              onTougle={tougleMenu}
          />
        </div>
    )

    const modal = (isVisible)
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
