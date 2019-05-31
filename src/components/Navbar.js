import React from "react";
import { Menu as Nav, Icon, Button } from "element-react";
import { NavLink } from 'react-router-dom';


// Navbar is a Functional Component

const Navbar = ({ user, handleSignout }) => (
    //* default Active = 1 makes our first menu item our active  item *//
    <Nav mode="horizontal" theme = "dark" defaultActive = "1">
        <div className="nav-container">
            {/* App title /icon */}
            <Nav.Item index="1">
                <NavLink to="/" className="nav-link">
                    <span className="app-title">
                        <img src="https://icon.now.sh/account_balance/f90" alt="App Icon" 
                        className="app-icon" />
                        AmplifyAgora
                    </span>
                </NavLink>
            </Nav.Item>

            {/* Navbar Items */}
            <div className="nav-items justify-content-end">
                <Nav.Item index="2">
                    <span className="app-user">Hello, {user.username}</span>
                </Nav.Item>
                <Nav.Item index="3">
                    <NavLink to="/profile" className="nav-link">
                        <Icon name="setting"/>
                            Profile              
                    </NavLink>
                </Nav.Item>
                <Nav.Item index="4">
                    <Button type="warning" onClick={handleSignout}>Sign Out</Button>
                </Nav.Item>
            </div>
        </div>
    </Nav>
    
)

export default Navbar;
