import { useNavigate } from "react-router-dom";
import "./Navbar.scss";
import NavbarData from "./NavbarData";
import "./Navbar.css";
import { getDisplayName, patchUserState } from "../../API/apis";
import { IoExitOutline } from "react-icons/io5";

const Navbar = (props) => {
  let navigate = useNavigate();

  const saveUserState = async () => {
    try {
      const response = await patchUserState(
        JSON.parse(localStorage.getItem("persist:root"))
      );
      if (response.data) {
        console.log("state is saved");
      }
    } catch (e) {
      console.log("state not saved");
    }
  };

  const logout = () => {
    saveUserState();
    localStorage.clear();
    navigate("/");
    alert("You have logged out!");
    window.location.reload(false);
  };

  return (
    <div id="left" className={props.leftOpen}>
      <div className={props.iconColor} onClick={props.toggleSidebar}>
        &equiv;
      </div>
      <div className={`sidebar ${props.leftOpen}`}>
        <div className="header">
          <h3 className="title" id="logo_name">
            {" "}
            SINEW{" "}
          </h3>
        </div>
        <div>
          <p id="welcome">Welcome, {getDisplayName()}!</p>
        </div>
        <div id="main-content" className="content">
          <ul className="nav-menu-items">
            <NavbarData />
          </ul>
        </div>
        <div id="nav-bottom">
          <div id="nav-logout">
            <button id="logout" onClick={logout}>
              <IoExitOutline size={25} />
              &nbsp;<strong>Log Out</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
