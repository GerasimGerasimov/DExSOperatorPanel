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
                        <ul className="navbar-nav p-1">
                            <li className="nav-item">
                                <NavLink exact to="/" className="nav-link" >Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/devices" className="nav-link">Devices</NavLink>
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
                className="NavBar"
            >
                <MenuTougle
                    isOpen={visible}
                    onTougle={tougleMenu}
                />
            </div>
        </div>
    )
}