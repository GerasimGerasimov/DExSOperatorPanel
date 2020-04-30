import React from 'react'
import {NavLink} from 'react-router-dom'

export const Navbar:React.FunctionComponent = ({}) => (
    <nav className="navbar navbar-dark bg-primary navbar-expand-lg">
        <div className="navbar-brand">
            DExS OP
        </div>
        <ul className="navbar-nav">
            <li className="nav-item">
                <NavLink exact to="/" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/about" className="nav-link">About</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/devsettings" className="nav-link">Settings</NavLink>
            </li>
            <li className="nav-item">
                <NavLink to="/devices" className="nav-link">Devices</NavLink>
            </li>            
        </ul>
    </nav>
)