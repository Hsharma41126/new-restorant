import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserGear,
    faCartShopping,
    faPrint,
    faBriefcase,
    faUser,
    faCalendarCheck,
    faReceipt,
    faClock,
    faHistory,
    faChartBar,
    faHome,
    faUsers,
    faFileAlt,
    faUserTie,
    faDesktopAlt,
    faUtensils
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");

    // Define menu items based on roles
    const adminMenuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: faHome },
        { name: "Staff Management", path: "/admin/staffmanagement", icon: faUserTie },
        { name: "Table & Plug Setup", path: "/admin/tableplugsetup", icon: faUserGear },
         { name: "Add Items", path: "/admin/additems", icon: faUtensils },
        { name: "Printer Setup", path: "/admin/printersetup", icon: faUsers },
        { name: "Business Settings", path: "/admin/businesssettings", icon: faFileAlt },
        { name: "Reports Analytics", path: "/admin/reportanalytics", icon: faBriefcase },
        { name: "Device Monitor", path: "/admin/devicemonitor", icon: faDesktopAlt  },
    ];

    const staffMenuItems = [
        { name: "Tables", path: "/staff/tablesmanagement", icon: faHome },
        { name: "Orders ​", path: "/staff/ordermanagement", icon: faBriefcase },
        { name: "KOT Queue ​", path: "/staff/kotqueue", icon: faFileAlt },
        { name: "Reservations", path: "/staff/reservationsmanagement", icon: faBriefcase },
        { name: "Billing ​", path: "/staff/billingpayment", icon: faFileAlt },
        { name: "Alerts", path: "/staff/alertsnotifications", icon: faDesktopAlt },
    ];

    const userMenuItems = [
        { name: "Book Table", path: "/user/booktable", icon: faHome },
        { name: "My Reservations", path: "/user/myreservations", icon: faCalendarCheck },
        { name: "My Bill", path: "/user/mybilling", icon: faReceipt },
        { name: "Session Tracker", path: "/user/sessiontracker", icon: faClock },
        { name: "Session History", path: "/user/sessionhistory", icon: faHistory },
    ];

    // Get menu items based on role
    const getMenuItems = () => {
        switch (role) {
            case "Admin":
                return adminMenuItems;
            case "Staff":
                return staffMenuItems;
            case "User":
                return userMenuItems;
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    const isActive = (path) => location.pathname === path;

    const handleMenuItemClick = (path) => {
        navigate(path);
        // Check if window width is mobile size (768px or less)
        if (window.innerWidth <= 768) {
            setCollapsed(true);
        }
    };

    return (
        <div className={`sidebar-container shadow-sm  ${collapsed ? "collapsed" : ""}`}>
            <div className="sidebar">
                <ul className="menu">
                    {menuItems.map((item, index) => (
                        <li
                            key={index}
                            className={`menu-item ${isActive(item.path) ? "active" : ""}`}
                            data-tooltip={collapsed ? item.name : ""}
                        >
                            <div
                                className="menu-link"
                                onClick={() => handleMenuItemClick(item.path)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                                {!collapsed && <span className="menu-text">{item.name}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;