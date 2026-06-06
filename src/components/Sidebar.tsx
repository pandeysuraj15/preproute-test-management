import { NavLink } from "react-router-dom";
import { FiTrendingUp, FiEdit3, FiClipboard } from "react-icons/fi";
import logo from "../assets/images/preproute_logo.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} />
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard">
            <FiTrendingUp />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/create-test">
            <FiEdit3 />
            <span>Test Creation</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/tracking">
            <FiClipboard />
            <span>Test Tracking</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
