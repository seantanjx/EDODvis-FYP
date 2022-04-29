import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";
import BiomarkerOverview from "./Pages/BiomarkerOverview/BiomarkerOverview";
import CompareGroups from "./Pages/CompareGroups/CompareGroups";
import CompareGroupsResult from "./Pages/CompareGroups/CompareGroupsResult";
import Login from "./Pages/Login/Login";
import SensorOverview from "./Pages/SensorOverview/SensorOverview";
import Sensors from "./Pages/Sensors/Sensors";
import Profile from "./Pages/Profile/Profile";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CalendarContext } from "./Contexts/CalendarContext";
import { useState } from "react";
import PostalCode from "./Pages/PostalCode/PostalCode";
import ParticipantHouse from "./Pages/ParticipantHouse/ParticipantHouse";
import BiomarkerOverviewExpandGraph from "./Pages/BiomarkerOverview/BiomarkerOverviewExpandGraph";
import BiomarkerOverviewAnomaly from "./Pages/Anomaly/BiomarkerOverviewAnomaly";
import ParticipantCharts from "./Pages/ParticipantCharts/ParticipantCharts";
import ParticipantChartsExpandGraph from "./Pages/ParticipantCharts/ParticipantChartsExpandGraph";
import CompareGroupsResultExpandGraph from "./Pages/CompareGroups/CompareGroupsResultExpandGraph";
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import NotFound from "./Pages/NotFound/NotFound";
import Unauthorized from "./Pages/Unauthorized/Unauthorized";

const theme = createTheme({
  palette: {
    primary: {
      dark: "#748AA1",
      main: "#FFFFF",
      contrastText: "#fff",
    },
    background: {
      default: "#FFFFFF",
    },
    text: {
      primary: "#31394D",
    },
  },
});

function App() {
  const date = useSelector((state) => state.persistDate);
  const [formData, setFormData] = useState({
    overview: {
      period: date["overview"].period,
    },
    individual: {
      period: date["individual"].period,
    },
    groups: {
      period: date["groups"].period,
    },
  });
  const [biomarkers, setBiomarkers] = useState(null);
  const [period, setPeriod] = useState("month");
  const [compareAgainstAverage, setCompareAgainstAverage] = useState(true);
  const [navBarOpen, setNavBarOpen] = useState("open");

  return (
    <div id="layout">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CalendarContext.Provider
          value={{
            formData,
            setFormData,
            biomarkers,
            setBiomarkers,
            period,
            setPeriod,
            compareAgainstAverage,
            setCompareAgainstAverage,
            navBarOpen,
            setNavBarOpen,
          }}
        >
          <Router>
            <Routes>
              {/* public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />

              {/* routes only for super users and healthcare professionals */}
              <Route element={<ProtectedRoute allowedRole={["SU", "HP"]} />}>
                <Route
                  path="/biomarkersoverview"
                  element={<BiomarkerOverview />}
                />
                <Route
                  path="/biomarkersoverview/:id"
                  element={<BiomarkerOverviewExpandGraph />}
                />
                <Route
                  path="/anomaly/:id"
                  element={<BiomarkerOverviewAnomaly />}
                />
                <Route
                  path="/participant_charts/:id"
                  element={<ParticipantCharts />}
                />
                <Route
                  path="/participant_charts_expand/:id"
                  element={<ParticipantChartsExpandGraph />}
                />
                <Route path="/comparegroups" element={<CompareGroups />} />
                <Route
                  path="/comparegroups/results"
                  element={<CompareGroupsResult />}
                />
                <Route
                  path="/comparegroups/results/:id"
                  element={<CompareGroupsResultExpandGraph />}
                />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* routes only for super users and data engineers */}
              <Route element={<ProtectedRoute allowedRole={["SU", "DE"]} />}>
                <Route path="/sensoroverview" element={<SensorOverview />} />
                <Route path="/postalcode" element={<PostalCode />} />
                <Route
                  path="/participanthouse"
                  element={<ParticipantHouse />}
                />
                <Route path="/sensors" element={<Sensors />} />
              </Route>
            </Routes>
          </Router>
        </CalendarContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
