import { useState, useEffect, useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { getUser, getRole } from "../../API/apis";
import { CalendarContext } from "../../Contexts/CalendarContext";
import "./ProtectedRoute.css";

const ProtectedRoute = ({ allowedRole }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [authRole, setAuthRole] = useState(false);
  const location = useLocation();

  const [leftOpen, setOpen] = useState(true);
  const [showNavbar, setNavbar] = useState("open");
  const [iconColor, setIconColor] = useState("icon");
  const { setNavBarOpen } = useContext(CalendarContext);

  const toggleSidebar = () => {
    setOpen(!leftOpen);
    if (leftOpen) {
      setNavbar("open");
      setIconColor("icon");
      setNavBarOpen("open");
    } else {
      setNavbar("closed");
      setIconColor("icon-closed");
      setNavBarOpen("closed");
    }
  };

  useEffect(() => {
    getUser()
      .then((response) => {
        if (response.status === 200) {
          setAuthRole(allowedRole.includes(getRole()));
          setAuth(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        localStorage.removeItem("token");
        setIsLoading(false);
      });
  }, [allowedRole]);

  return isLoading ? (
    <div></div>
  ) : authRole ? (
    <>
      <Navbar
        leftOpen={showNavbar}
        toggleSidebar={toggleSidebar}
        iconColor={iconColor}
      />
      <div id="main">
        {/* <Topnav /> */}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  ) : auth ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace={true} />
  ) : (
    <Navigate to="/" state={{ from: location }} replace={true} />
  );
};

export default ProtectedRoute;
