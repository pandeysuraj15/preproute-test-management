import { NavLink } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";
import { TbClipboardSearch } from "react-icons/tb";
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
            <FaRegEdit />
            <span>Test Creation</span>
          </NavLink>
        </li>

        <li>
          <button className="sidebar-link">
            <TbClipboardSearch />
            <span>Test Tracking</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
