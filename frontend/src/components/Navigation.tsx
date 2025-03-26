import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import Menu from "./Menu";
import { useAuth } from "../AuthContext";

export default function Navigation() {
  const [showMenu, SetshowMenu] = useState(false);
  const { loggedIn } = useAuth();

  const handleToggle = () => {
    SetshowMenu(!showMenu);
  };

  return (
    <>
      <nav className="main-nav p-5 flex gap:5% items-center justify-between">
        <Link to="/home" className="flex-[0_0_15%]">
          <Logo />
        </Link>
        {loggedIn && (
          <div className="nav-toggle">
            <button
              onClick={handleToggle}
              className="flex flex-col justify-center items-center cursor-pointer"
            >
              <span
                className={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm my-1.5`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out 
                    h-0.5 w-6 rounded-sm`}
              ></span>
            </button>
          </div>
        )}
      </nav>
      <Menu onClose={() => SetshowMenu(false)} show={showMenu}>
        <NavLink to="/home">My Contacts</NavLink>
        <NavLink to="/my-profile">My Profile</NavLink>
        <NavLink to="/edit-profile">Edit Profile</NavLink>
        <NavLink to="/logout">Logout</NavLink>
      </Menu>
    </>
  );
}
