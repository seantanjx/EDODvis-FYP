import { useContext } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import GroupsIcon from "@mui/icons-material/Groups";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SensorsIcon from "@mui/icons-material/Sensors";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { CalendarContext } from "../../Contexts/CalendarContext";
import "./PageBreadcrumb.css";

const PageBreadcrumb = ({ crumbs }) => {
  const { navBarOpen } = useContext(CalendarContext);

  // define icons for pages here
  const getIcon = function (page) {
    if (page === "/comparegroups") {
      return <GroupsIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/comparegroups/results") {
      return <EqualizerIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/biomarkersoverview") {
      return <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/profile") {
      return <PersonIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/sensoroverview") {
      return <SensorsIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/postalcode") {
      return <TravelExploreIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/participanthouse") {
      return <MapsHomeWorkIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else if (page === "/sensors") {
      return <AnnouncementIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    } else {
      return <BarChartIcon sx={{ mr: 0.5 }} fontSize="inherit" />;
    }
  };

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      className={navBarOpen === "open" ? "breadCrumbsOpen" : "breadCrumbsClose"}
    >
      {crumbs.map((crumb, index) => (
        <Link
          underline="hover"
          sx={{ display: "flex", alignItems: "center" }}
          color="inherit"
          href={crumb.pageLink}
          key={crumb}
        >
          {getIcon(crumb.pageLink)}
          {crumb.pageName}
        </Link>
      ))}
    </Breadcrumbs>
  );
};
export default PageBreadcrumb;
