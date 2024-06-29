import React from 'react';
import { Routes, Route, Link, useNavigate, BrowserRouter, NavLink, useNavigation } from 'react-router-dom';
import { DropdownButton, Button, Dropdown } from 'react-bootstrap';

const userData = localStorage.getItem("user_data");
  if (!userData) {
    throw new Error("No user data found in local storage");
  }

  const user = (userData?JSON.parse(userData):"");



const SideMenu = () => {
  const navigate = useNavigate();
  const logout = () => {

    localStorage.removeItem("user_data");
    navigate("/");
  }
  return (
    <>
      <div className="wrapper">
        <div className="sidebar">
          <div className="brand-logo">
            <a href="index.html">
              <img src={`${process.env.PUBLIC_URL}/logo-img.png`} width="150" height="55" alt="" />
            </a>
          </div>
          <ul className="nav">
            <li>
              <Link to="/dashboard">
                <span className="fa fa-desktop"></span>Dashboard</Link>

            </li>
            <li>
              <Link to="/personal">
                  <span className="fas fa-university"></span> Personal Discussion
              </Link>
            </li>
            <li>
              <Link to="#">
                  <span className="fa fa-regular fa-file-import"></span>Import PD
              </Link>
            </li>
            <li>
              <Link to="#">
                  <span className="fa fa-regular fa-file-export"></span>Export
              </Link>
            </li>
            <li>
              <Link to="/users">
                  <span className="fa fa-regular fas fa-mobile-alt"></span>Users
              </Link>
            </li>
          </ul>
        </div>
        <div className="top-bar" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
            <span className="icon-menu"></span>
          </Button>
          <ul className="navbar-nav ml-auto" style={{marginRight:'18px'}}>
            <li className="nav-item dropdown no-arrow user-menu">
              <Dropdown>
                <Dropdown.Toggle as="a" className="nav-link dropdown-toggle" id="userDropdown" role="button">
                  <span className="user-avatar-icon">
                    {(user?user.username:"")} <span className="fa fa-cog fa-lg"></span>
                  </span>
                  <span className="d-none d-lg-inline text-gray-600 small"></span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow animated--grow-in">
                 
                  <Dropdown.Item href="javascript:void(0)" onClick={logout}>
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SideMenu;