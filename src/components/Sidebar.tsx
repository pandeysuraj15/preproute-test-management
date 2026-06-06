import { NavLink } from "react-router-dom";
import { FiTrendingUp, FiEdit3, FiClipboard } from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>PrepRoute</h2>
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
