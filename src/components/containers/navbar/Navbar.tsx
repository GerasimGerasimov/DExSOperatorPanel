import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css' //'./  Navbar.css'

export const Navbar:React.FunctionComponent = (props) => {
    const cls = [
        //'NavBar',
        //'fa',
        //'navbar',
        'navbar-dark',
        'bg-primary',
        //'navbar-expand-lg'
    ]

    return (
        <div>
            <div className="burger"></div>
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
    )
}