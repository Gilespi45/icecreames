import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/navbar.css'

const Navbar = ({ totalOrders }) => {

 
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link  to="/take_order" style={{textDecoration:"none"}}>Take Order</Link>
          </li>
          <li>
            <Link to="/order" style={{textDecoration:"none"}}>Order <sup>{totalOrders}</sup> </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
