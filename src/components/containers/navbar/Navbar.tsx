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

    const click = ()=> {
        setVisible(!visible)
        console.log('click', visible)
    }

    const navbar = (visible)
        ? (
            <div>
                <div>
                    <Modal></Modal>
                </div>
                <div>
                    <nav className={cls.join(' ')}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink exact to="/" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/about" className="nav-link">About</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/devices" className="nav-link">Devices</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        )
        : null;
    
    return (
        <div>
            {navbar}
            <div
                className="burger2"
            >
                <MenuTougle
                    isOpen={visible}
                    onTougle={click}
                />
            </div>
        </div>
    )
}