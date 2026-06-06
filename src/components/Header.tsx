import { HiOutlineBell } from "react-icons/hi2";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formattedRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : "";

  return (
    <header className="header">
      <div className="header-right">
        <div className="notification">
          <HiOutlineBell />
        </div>

        <div className="avatar">{user?.name?.charAt(0)}</div>

        <div className="user-info">
          <h6>
            {user?.name
              ?.split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")}
          </h6>
          <span>{formattedRole}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
