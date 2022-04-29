import { MdOutlineSensors } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { VscGitCompare } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";

import { NavLink } from "react-router-dom";
import { getRole } from "../../API/apis";

const NavbarData = () => {
  var data = [];

  const HPData = [
    {
      title: "Overview (Biomarkers)",
      path: "/biomarkersoverview",
      icon: <MdDashboard />,
      cName: "nav-text",
      activeClassName: "isActive",
    },
    {
      title: "Compare Groups",
      path: "/comparegroups",
      icon: <VscGitCompare />,
      cName: "nav-text",
      activeClassName: "isActive",
    },
    {
      title: "Individual Profile",
      path: "/profile",
      icon: <CgProfile />,
      cName: "nav-text",
      activeClassName: "isActive",
    },
  ];

  const DEData = [
    {
      title: "Overview (Sensors)",
      path: "/sensoroverview",
      icon: <AiFillDashboard />,
      cName: "nav-text",
      activeClassName: "isActive",
    },
    {
      title: "All Sensors",
      path: "/sensors",
      icon: <MdOutlineSensors />,
      cName: "nav-text",
      activeClassName: "isActive",
    },
  ];

  try {
    const role = getRole();
    if (role === "SU") {
      data = [...HPData, ...DEData];
    } else if (role === "HP") {
      data = data.concat(HPData);
      data = [...HPData];
    } else data = [...DEData];
  } catch (e) {
    console.log(e);
  }

  return (
    <>
      {data.map((item, index) => {
        return (
          <li key={index} className={item.cName} id={item.title}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? "#fff" : "#545e6f",
              })}
            >
              {item.icon}
              <span className="item-title">{item.title}</span>
            </NavLink>
          </li>
        );
      })}
    </>
  );
};

export default NavbarData;
