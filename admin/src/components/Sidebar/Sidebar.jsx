import { assets } from "../../assets/assets"
import "./Sidebar.css"
import { NavLink } from "react-router-dom"



import React from 'react'

function Sidebar() {
  return (
    <div className="sidebar">
        <div className="sidebar-options">
            <NavLink to = "/add" className="sidebar-option">
                    <img src={assets.add_icon} alt="alt" />
                    <p>Add Items</p>
            </NavLink>
            <NavLink to="/list" className="sidebar-option">
                    <img src={assets.order_icon} alt="alt" />
                    <p>list items</p>
            </NavLink>
            <NavLink to="/orders" className="sidebar-option">
                    <img src={assets.order_icon} alt="alt" />
                    <p>orders</p>
            </NavLink>
        </div>
    </div>
  )
}

export default Sidebar
