import { useNavigate } from "react-router-dom";
import { useState, useEffect, createRef } from "react";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import _ from "lodash";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import Typography from "@mui/material/Typography";
import {
  getAllParticipant,
  getAllDeviceByArea,
  getAlertDataByArea,
} from "../../API/apis";
import SensorCards from "../../Components/SensorCards/SensorCards";
import Search from "../../Components/Search/Search";
import FilterSArea from "../../Components/Filter/FilterSArea";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import AlertTable from "../../Components/Table/AlertTable";
import FilterSAreaMobile from "../../Components/Filter/FilterSAreaMobile";
import PieChart from "../../Components/PieChart/PieChart";
import WindowDimension from "../../utils/WindowDimension";
import "./SensorOverview.css";
import NoMotionModal from "../../Components/NoMotionModal/NoMotionModal";
import { postalDistrictList } from "../../utils/PostalDistrict";

const SensorOverview = () => {
  const crumbs = [{ pageLink: "/sensoroverview", pageName: "Sensor Overview" }];
  const ref = createRef();
  const popStatus = useSelector((state) => state.popStatus);

  // isDesktop
  const isDesktop = WindowDimension();

  // Offline devices, Low Battery, Sensor Health, Summary of sensors (Houses)
  const [area, setArea] = useState("all");

  const [sensorsData, setSensorsData] = useState(null);
  const [sensorsDataAll, setSensorsDataAll] = useState();

  useEffect(() => {
    fetchAllDevice();
    fetchAllParticipant();
    fetchAlertData();
  }, []);

  const fetchAllDevice = async () => {
    try {
      const response = await getAllDeviceByArea(area);
      const data = JSON.parse(response.data);
      setSensorsData(data);
      if (area === "all") {
        setSensorsDataAll(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Pie Chart
  const pieChartLabels = [
    "High Battery",
    "Medium Battery",
    "Low Battery",
    "Offline devices",
  ];

  if (sensorsData !== null) {
    var lostSignal =
      sensorsData.lost_signal.beacon +
      sensorsData.lost_signal.door +
      sensorsData.lost_signal.bed +
      sensorsData.lost_signal.miband +
      sensorsData.lost_signal.gateway +
      sensorsData.lost_signal.motion;
    var data = [
      sensorsData.sensor_health.high,
      sensorsData.sensor_health.medium,
      sensorsData.sensor_health.low,
      lostSignal,
    ];
  }

  // Handle Search
  const [searchData, setSearchData] = useState("");
  const [allPostalCode, setAllPostalCode] = useState({
    postalCode: "",
    area: "",
  });

  let searchOptions = [
    ...new Set(_.map(allPostalCode, (details) => details.postalCode)),
  ].sort();
  let areaOptions = [
    ...new Set(_.map(allPostalCode, (details) => details.area)),
  ];
  areaOptions = [
    areaOptions.map((item) => [postalDistrictList[item], item]),
  ][0].sort();

  const fetchAllParticipant = async () => {
    try {
      const response = await getAllParticipant();
      setAllPostalCode(
        _.map(response.data, (details) => {
          return {
            postalCode: details.postal_code.toString(),
            area: details.postal_district,
          };
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const navigate = useNavigate();

  function handleSearchClick() {
    if (searchData !== "") {
      const searchArea = allPostalCode.filter(
        (item) => item.postalCode === searchData
      );
      navigate("/postalcode", {
        state: searchArea,
      });
    }
  }

  // Alert Table
  const [alertData, setAlertData] = useState();
  const [alertDataAll, setAlertDataAll] = useState();
  const [alertDataArea, setAlertDataArea] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [remarks, setRemarks] = useState();
  const [pageReset, setPageReset] = useState(false);
  const [participantList] = useState([]);

  const fetchAlertData = async () => {
    try {
      const response = await getAlertDataByArea(area);
      const data = JSON.parse(response.data);
      const processedData = _.map(data, (details) => {
        participantList.push(details[0]);
        const processed = getData(details[1]);
        if (processed.sensorType.size > 0) {
          return {
            pid: details[0],
            daysDown: processed.daysDown.toString() + " days",
            type: [...processed.sensorType].sort().join(", "),
            isAlert: false,
            toInclude: true,
            noMotion: processed.noMotion,
          };
        } else {
          return { toInclude: false };
        }
      });
      setAlertData(processedData.filter((item) => item.toInclude === true));
      setAlertDataArea(processedData.filter((item) => item.toInclude === true));
      if (area === "all") {
        setAlertDataAll(
          processedData.filter((item) => item.toInclude === true)
        );
      }
      setRemarks(data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  function getData(data) {
    let processed = {
      daysDown: 0,
      sensorType: new Set(),
      isAlert: false,
      noMotion: false,
      remarks: null,
    };
    for (const [key, value] of Object.entries(data)) {
      if (key === "participant_ok" && value === false) {
        processed.noMotion = true;
      }
      if (value.days_down > processed.daysDown) {
        processed.daysDown = value.days_down;
      }
      if (key !== "participant_ok") {
        processed.sensorType.add(
          value.status === "offline" || value.battery_level === "low"
            ? value.type
            : ""
        );
      }
    }
    return processed;
  }

  // Handle Clicks
  function handleApply() {
    fetchAllDevice();
    fetchAlertData();
    setPageReset(!pageReset);

    if (!isDesktop) {
      setOpen(false);
    }
  }

  function handleChange(event, option) {
    setArea(option.value);
  }

  const [reset, setReset] = useState(false);
  function handleReset() {
    setArea("all");
    setSensorsData(sensorsDataAll);
    setAlertData(alertDataAll);
    setPageReset(!pageReset);
    setCardId(null);
    setReset(!reset);

    if (!isDesktop) {
      setOpen(false);
    }
  }

  const [cardId, setCardId] = useState(null);
  function handleClick(event) {
    setCardId(event.target.offsetParent.id);
    let participant = participantList;
    if (event.target.offsetParent.id === "houseLowBattery") {
      participant = sensorsData.summary_of_sensors.participant_id_w_low_battery;
    } else if (event.target.offsetParent.id === "houseNoMotion") {
      participant = sensorsData.summary_of_sensors.participant_id_w_no_motion;
    } else if (event.target.offsetParent.id === "houseOff") {
      participant = sensorsData.summary_of_sensors.participant_id_w_offline;
    }
    setAlertData(
      alertDataAll.filter((item) => participant.includes(parseInt(item.pid)))
    );
    setPageReset(!pageReset);
  }

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleViewAllAlert() {
    setCardId(null);
    setAlertData(alertDataArea);
    setPageReset(!pageReset);
  }

  if (sensorsData === null) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div id="sensorsOverview">
          {!popStatus && <NoMotionModal />}
          {isDesktop ? (
            <div
              name="breadcrumb"
              style={{
                background: "#E6ECF2",
                position: "-webkit-sticky",
                position: "sticky",
                top: 0,
                paddingTop: "5px",
                paddingBottom: "5px",
                zIndex: 2,
              }}
            >
              <div style={{ display: "inline-flex", width: "100%" }}>
                <PageBreadcrumb crumbs={crumbs} />
              </div>
              <div id="filterSearch">
                <FilterSArea
                  onApply={handleApply}
                  onReset={handleReset}
                  onChange={handleChange}
                  reset={reset}
                  options={areaOptions}
                />
                <Search
                  placeholder="Search by Postal Code"
                  className={"searchDesktop"}
                  onInputChange={(event, newPostal) => setSearchData(newPostal)}
                  value={searchData}
                  options={searchOptions}
                  onClick={handleSearchClick}
                />
              </div>
            </div>
          ) : (
            <div
              name="breadcrumb"
              style={{
                background: "#E6ECF2",
                position: "-webkit-sticky",
                position: "sticky",
                top: 0,
                paddingTop: "5px",
                paddingBottom: "5px",
                zIndex: 2,
              }}
            >
              <div style={{ display: "inline-flex", width: "100%" }}>
                <PageBreadcrumb crumbs={crumbs} />
              </div>
              <Grid container component="main" display="fluid" sx={{ m: 0 }}>
                <Search
                  placeholder="Search by Postal Code"
                  className={"searchMobile"}
                  onInputChange={(event, newPostal) => setSearchData(newPostal)}
                  value={searchData}
                  options={searchOptions}
                  onClick={handleSearchClick}
                />
                <Container>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "primary.dark", mb: "8px" }}
                    onClick={handleOpen}
                  >
                    <FaFilter /> &nbsp;Filter
                  </Button>
                  <Modal open={open}>
                    <FilterSAreaMobile
                      onClickClose={handleClose}
                      onApply={handleApply}
                      onReset={handleReset}
                      onChange={handleChange}
                      reset={reset}
                      options={areaOptions}
                      ref={ref}
                    />
                  </Modal>
                </Container>
              </Grid>
            </div>
          )}

          <Container sx={{ width: 1 }}>
            <Grid container spacing={2}>
              <Grid container item xs={12} spacing={2} id="sensorsOverview">
                <Grid
                  container
                  item
                  xs={12}
                  md={7}
                  alignItems="center stretch"
                  justifyContent="space-between"
                >
                  <Card className="cardContainer">
                    <Typography className="sensorCardHeader">
                      Offline Devices
                    </Typography>
                    <CardContent>
                      <Grid container>
                        {_.map(
                          Object.keys(sensorsData.lost_signal).sort(),
                          (type) => {
                            return (
                              <Grid item xs={4} key={`${type}LostSignal`}>
                                <SensorCards
                                  data={sensorsData.lost_signal[type]}
                                  text={type}
                                  contentClassName="sensorContent"
                                  sx={{ backgroundColor: "#DADADA" }}
                                />
                              </Grid>
                            );
                          }
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={5}
                  alignItems="center stretch"
                  justifyContent="space-evenly"
                  gap={2}
                >
                  <Card id="housesDeployedCount" className="cardContainer">
                    <CardContent component="span">
                      <Typography className="sensorValueInline">
                        {sensorsData.summary_of_sensors.total_houses_deployed}
                      </Typography>
                      <Typography className="sensorDesc">
                        houses deployed
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="cardContainer">
                    <Typography className="sensorCardHeader">
                      Low Battery
                    </Typography>
                    <CardContent>
                      <Grid container>
                        {_.map(
                          Object.keys(sensorsData.low_battery).sort(),
                          (type) => {
                            return (
                              <Grid item xs={4} key={`${type}LowBattery`}>
                                <SensorCards
                                  data={sensorsData.low_battery[type]}
                                  text={type}
                                  contentClassName="sensorContent"
                                  sx={{ backgroundColor: "#F5E2E4" }}
                                />
                              </Grid>
                            );
                          }
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={4}
                  alignItems="center stretch"
                  justifyContent="space-between"
                >
                  <Card className="cardContainer">
                    <Typography className="sensorCardHeader">
                      Sensor Health
                    </Typography>
                    <CardContent>
                      <PieChart labels={pieChartLabels} data={data} />
                      <Typography className="instructions">
                        Click on the legend to filter the pie chart
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={8}
                  alignItems="center stretch"
                  justifyContent="space-evenly"
                >
                  <Card className="cardContainer">
                    <Typography className="sensorCardHeader">
                      Summary of Sensors
                    </Typography>
                    <CardContent>
                      <Grid container>
                        <Grid item xs={12}>
                          <SensorCards
                            data={
                              sensorsData.summary_of_sensors
                                .total_houses_w_no_motion
                            }
                            text="houses with no motion detected"
                            contentClassName="summaryContent"
                            id="houseNoMotion"
                            sx={{ backgroundColor: "#690000", m: 0, p: 0 }}
                            onClick={handleClick}
                            isButton
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SensorCards
                            data={
                              sensorsData.summary_of_sensors
                                .total_houses_w_low_battery
                            }
                            text="houses with ≥1 sensor(s) low battery"
                            contentClassName="summaryContent"
                            id="houseLowBattery"
                            sx={{ backgroundColor: "#F5E2E4", m: 0, p: 0 }}
                            onClick={handleClick}
                            isButton
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <SensorCards
                            data={
                              sensorsData.summary_of_sensors
                                .total_houses_w_offline
                            }
                            text="houses with ≥1 sensor(s) off"
                            contentClassName="summaryContent"
                            id="houseOff"
                            sx={{ backgroundColor: "#DADADA", m: 0, p: 0 }}
                            onClick={handleClick}
                            isButton
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            className="instructions"
                            paddingTop={"10px"}
                          >
                            Select the buttons to filter the Alert table
                          </Typography>
                        </Grid>
                        <Grid item xs={12} id="viewAllAlert">
                          {cardId !== null ? (
                            <Button
                              variant="contained"
                              onClick={handleViewAllAlert}
                              sx={{ background: "#748AA1" }}
                            >
                              View All Alert
                            </Button>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Grid container item xs={12} id="alertTable">
                <Card
                  sx={{
                    pl: -2,
                    mb: 2,
                    width: 1,
                    minHeight: 300,
                    backgroundColor: "#DADADA",
                  }}
                >
                  <CardHeader
                    title={
                      cardId === null
                        ? "ALERT"
                        : cardId === "houseLowBattery"
                        ? "HOUSES WITH ≥1 SENSOR(S) LOW BATTERY"
                        : cardId === "houseNoMotion"
                        ? "HOUSES WITH NO MOTION DETECTED"
                        : "HOUSES WITH ≥1 SENSOR(S) LOST SIGNAL"
                    }
                    id={
                      cardId === null
                        ? "alertHeader"
                        : cardId === "houseLowBattery"
                        ? "alertLowBatteryHeader"
                        : cardId === "houseNoMotion"
                        ? "alertNoMotionHeader"
                        : "alertLostSignalHeader"
                    }
                  />
                  {isLoading ? (
                    <LoadingAnimation />
                  ) : (
                    <AlertTable
                      rowsPerPage={3}
                      data={alertData}
                      isLoading={isLoading}
                      resetPage={pageReset}
                      remarks={remarks}
                      minHeight="300px"
                      sx={{
                        borderTopRightRadius: "0px",
                        borderTopLeftRadius: "0px",
                      }}
                    />
                  )}
                </Card>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </>
  );
};

export default SensorOverview;
