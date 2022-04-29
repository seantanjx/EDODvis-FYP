import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "@mui/material";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import clsx from "clsx";
import _ from "lodash";
import "./Sensors.css";
import FilterS from "../../Components/Filter/FilterS";
import Table from "../../Components/Table/Table";
import Search from "../../Components/Search/Search";
import FilterSMobile from "../../Components/Filter/FilterSMobile";
import { getAllDevice, getAllParticipant } from "../../API/apis";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import WindowDimension from "../../utils/WindowDimension";
import { reset } from "../../Store/Actions/DateAction";
import { postalDistrictList } from "../../utils/PostalDistrict";

const Sensors = () => {
  const crumbs = [{ pageLink: "/sensors", pageName: "All Sensors" }];
  const dispatch = useDispatch();

  // isDesktop
  const isDesktop = WindowDimension();

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add data to table
  const [isLoading, setIsLoading] = useState(true);
  const [allDevice, setAllDevice] = useState();
  const [device, setDevice] = useState();
  const [allParticipant, setAllParticipant] = useState([]);

  useEffect(() => {
    fetchAllDevice();
    fetchAllParticipant();
  }, []);

  const fetchAllDevice = async () => {
    try {
      const response = await getAllDevice();
      const data = JSON.parse(response.data);
      const processedData = _.map(data, (details) => getData(details));
      setAllDevice(processedData);
      setDevice(processedData);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const fetchAllParticipant = async () => {
    try {
      const response = await getAllParticipant();
      let participantObject = new Object();
      _.map(response.data, (details) => {
        if (details.postal_district in participantObject) {
          participantObject[details.postal_district] = [
            ...participantObject[details.postal_district],
            details.participant_id,
          ];
        } else {
          participantObject[details.postal_district] = [details.participant_id];
        }
      });
      setAllParticipant(participantObject);
    } catch (e) {
      console.log(e);
    }
  };

  function getData(details) {
    return {
      id: details.name,
      pid: details.participant,
      name: details.name,
      type: details.type,
      location: details.location.replace("_", " "),
      lastServiced:
        moment(details.last_serviced).format("YYYY-MM-DD") === null
          ? "-"
          : moment(details.last_serviced).format("YYYY-MM-DD"),
      battery:
        details.battery_level === null ? "unknown" : details.battery_level,
      status:
        details.status === "offline" ? `off (${details.days_down} days)` : "on",
    };
  }

  const searchOptions = [
    ...new Set(_.map(allDevice, (details) => details.name.toString())),
  ];

  // Handle search
  const [searchData, setSearchData] = useState("");

  function handleSearchClick() {
    // onClick on search button
    if (searchData !== "" && searchData.includes("-")) {
      // for device name
      setDevice(allDevice.filter((item) => item.name.includes(searchData)));
      setIsLoading(false);
    } else if (searchData !== "") {
      // for participant
      setDevice(allDevice.filter((item) => item.pid === parseInt(searchData)));
      setIsLoading(false);
    }

    setDataFilter({ type: "", status: "", battery: "", area: "" });
    setStartDateDay(null);
    setEndDateDay(null);
  }

  function handleSearchBar(event, newId) {
    // InputChange on search
    setSearchData(newId);

    if (newId === "") {
      setDevice(allDevice);
      setIsLoading(false);

      setDataFilter({ type: "", status: "", battery: "", area: "" });
      setStartDateDay(null);
      setEndDateDay(null);
    }
  }

  // Handle Filter
  const areaOptions = [
    Object.keys(allParticipant).map((item) => [postalDistrictList[item], item]),
  ][0].sort();

  const [dataFilter, setDataFilter] = useState({
    type: "",
    status: "",
    battery: "",
    area: "",
  });
  const [resetPage, setResetPage] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setDataFilter((prevFilterData) => ({
      ...prevFilterData,
      [name]: value,
    }));
    setResetPage(false);
  }

  function areaHandleChange(event, option) {
    setDataFilter((prevFilterData) => ({
      ...prevFilterData,
      area: option.value,
    }));
    setResetPage(false);
  }

  const date = useSelector((state) => state.persistDate);
  const [startDateDay, setStartDateDay] = useState(
    date["sensors"].dayStartDate
  );
  const [endDateDay, setEndDateDay] = useState(date["sensors"].dayEndDate);

  let startDate;
  if (startDateDay !== null) {
    startDate = moment(startDateDay).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }

  let endDate;
  if (endDateDay !== null) {
    endDate = moment(endDateDay).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
  }

  let useData;
  if (searchData === "") {
    useData = allDevice;
  } else if (searchData.includes("-")) {
    useData = allDevice.filter((item) => item.name.includes(searchData));
  } else {
    useData = allDevice.filter((item) => item.pid === parseInt(searchData));
  }

  useEffect(() => {
    setStartDateDay(date["sensors"].dayStartDate);
    setEndDateDay(date["sensors"].dayEndDate);
  }, [date["sensors"].dayStartDate || date["sensors"].dayEndDate]);

  // Handle Apply Button (OnClick)
  function handleApply() {
    let typeData = useData;
    let statusData = useData;
    let batteryData = useData;
    let start = useData;
    let end = useData;
    let areaData = useData;

    if (dataFilter.type !== "") {
      typeData = useData.filter((item) => item.type === dataFilter.type);
    }

    if (dataFilter.status !== "") {
      statusData = useData.filter((item) =>
        item.status.includes(dataFilter.status)
      );
    }

    if (dataFilter.battery !== "") {
      batteryData = useData.filter(
        (item) => item.battery === dataFilter.battery
      );
    }

    if (startDate && endDate) {
      if (
        moment(startDate, "YYYY-MM-DD").toDate() >
        moment(endDate, "YYYY-MM-DD").toDate()
      ) {
        alert(
          "Start date is later than end date. Please ensure start date is before end date."
        );
        return;
      }
    }

    if (startDate !== undefined) {
      start = useData.filter((item) => {
        return (
          moment(item.lastServiced)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .isAfter(startDate) ||
          moment(item.lastServiced)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .isSame(startDate)
        );
      });
    }

    if (endDate !== undefined) {
      end = useData.filter((item) => {
        return (
          moment(item.lastServiced)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .isBefore(endDate) ||
          moment(item.lastServiced)
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            .isSame(endDate)
        );
      });
    }

    if (dataFilter.area !== "") {
      areaData = useData.filter((item) =>
        allParticipant[dataFilter.area].includes(item.pid)
      );
    }

    let filterData = typeData.filter((td) =>
      batteryData.some((bd) => td.id === bd.id)
    );
    filterData = filterData.filter((fd) =>
      statusData.some((sd) => fd.id === sd.id)
    );
    filterData = filterData.filter((fd) => start.some((sd) => fd.id === sd.id));
    filterData = filterData.filter((fd) => end.some((ed) => fd.id === ed.id));
    filterData = filterData.filter((fd) =>
      areaData.some((ad) => fd.id === ad.id)
    );

    setDevice(filterData);
    setResetPage(true);
    setIsLoading(false);

    if (
      !isDesktop &&
      (dataFilter.type !== "" ||
        dataFilter.status !== "" ||
        dataFilter.startDate !== undefined ||
        dataFilter.endDate !== undefined ||
        dataFilter.battery !== "" ||
        dataFilter.area !== "")
    ) {
      setOpen(false);
    }
  }

  // Handle Reset Button (onClick)
  const [resetFilter, setResetFilter] = useState(false);
  function handleReset() {
    setDataFilter(() => {
      return { type: "", status: "", battery: "", area: "" };
    });
    setStartDateDay(null);
    setEndDateDay(null);
    dispatch(reset("sensors"));
    setResetFilter(!resetFilter);
    setDevice(useData);
    setResetPage(true);
    setIsLoading(false);

    if (
      !isDesktop &&
      (dataFilter.type !== "" ||
        dataFilter.status !== "" ||
        dataFilter.startDate !== undefined ||
        dataFilter.endDate !== undefined ||
        dataFilter.battery !== "" ||
        dataFilter.area !== "")
    ) {
      setOpen(false);
    }
  }

  // Handle Link (onClick)
  const navigate = useNavigate();
  function handleLink(event) {
    navigate("/participanthouse", {
      state: event.target.name,
    });
  }

  return (
    <div>
      {isDesktop ? (
        <>
          <div
            name="breadcrumbs"
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
            <div className="searchPidSid">
              <Search
                placeholder="Search by Participant ID or Sensor ID"
                className={"searchDesktop"}
                onInputChange={handleSearchBar}
                value={searchData}
                options={searchOptions}
                onClick={handleSearchClick}
              />
            </div>
          </div>
          <Grid
            container
            component="main"
            display="fluid"
            justifyContent="center"
            sx={{ m: 0 }}
          >
            <Grid item xs sx={{ ml: "32px", mr: "8px" }}>
              <Table
                isLoading={isLoading}
                rows={device}
                columns={[
                  {
                    field: "pid",
                    headerName: "Participant ID",
                    minWidth: 150,
                    flex: 1.1,
                    renderCell: (cellValues) => {
                      return (
                        <Link
                          onClick={handleLink}
                          name={cellValues.row.pid}
                          className="link"
                        >
                          {cellValues.row.pid}
                        </Link>
                      );
                    },
                  },
                  {
                    field: "name",
                    headerName: "Sensor ID",
                    minWidth: 200,
                    flex: 1.5,
                  },
                  { field: "type", headerName: "Type", minWidth: 100, flex: 1 },
                  {
                    field: "location",
                    headerName: "Location",
                    minWidth: 100,
                    flex: 1,
                  },
                  {
                    field: "lastServiced",
                    headerName: "Last Serviced",
                    minWidth: 150,
                    flex: 1,
                  },
                  {
                    field: "battery",
                    headerName: "Battery",
                    minWidth: 100,
                    flex: 1,
                    cellClassName: (params) =>
                      clsx("battery", {
                        low: params.value === "low",
                        medium: params.value === "medium",
                        high: params.value === "high",
                      }),
                  },
                  {
                    field: "status",
                    headerName: "Status",
                    minWidth: 130,
                    flex: 1,
                  },
                ]}
                sx={{
                  "& .battery.low": { color: "#ED5B5B" },
                  "& .battery.medium": { color: "#FBA018" },
                  "& .battery.high": { color: "#1F9E8A" },
                }}
                filename="Sensors Data"
                fields={[
                  "pid",
                  "name",
                  "type",
                  "location",
                  "lastServiced",
                  "battery",
                  "status",
                ]}
                resetPage={resetPage}
              />
            </Grid>
            <Grid item id="filter" xs="auto" sx={{ mr: "32px" }}>
              <FilterS
                onChange={handleChange}
                value={dataFilter}
                onApply={handleApply}
                onReset={handleReset}
                areaOptions={areaOptions}
                areaOnChange={areaHandleChange}
                reset={resetFilter}
                id="sensors"
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <div
            name="breadcrumbs"
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
            <Grid
              container
              component="main"
              display="fluid"
              gap={1}
              sx={{ m: 0 }}
            >
              <div style={{ display: "inline-flex", width: "100%" }}>
                <PageBreadcrumb crumbs={crumbs} />
              </div>

              <div className="searchPidSid">
                <Search
                  placeholder="Search by Participant ID or Sensor ID"
                  className={"searchMobile"}
                  onInputChange={handleSearchBar}
                  value={searchData}
                  options={searchOptions}
                  onClick={handleSearchClick}
                />
              </div>

              <Container component="main" display="inline-flex">
                <Button
                  variant="contained"
                  sx={{ bgcolor: "primary.dark", mb: 1 }}
                  onClick={handleOpen}
                >
                  <FaFilter /> &nbsp;Filter
                </Button>
                <Modal open={open}>
                  <FilterSMobile
                    onClickClose={handleClose}
                    onChange={handleChange}
                    value={dataFilter}
                    onApply={handleApply}
                    onReset={handleReset}
                    areaOptions={areaOptions}
                    areaOnChange={areaHandleChange}
                    reset={resetFilter}
                    id="sensors"
                  />
                </Modal>
              </Container>
            </Grid>
          </div>
          <Container>
            <Table
              isLoading={isLoading}
              rows={device}
              columns={[
                {
                  field: "pid",
                  headerName: "Participant ID",
                  minWidth: 150,
                  flex: 1.1,
                },
                {
                  field: "name",
                  headerName: "Sensor ID",
                  minWidth: 200,
                  flex: 1.5,
                },
                { field: "type", headerName: "Type", minWidth: 100, flex: 1 },
                {
                  field: "location",
                  headerName: "Location",
                  minWidth: 100,
                  flex: 1,
                },
                {
                  field: "lastServiced",
                  headerName: "Last Serviced",
                  minWidth: 150,
                  flex: 1,
                },
                {
                  field: "battery",
                  headerName: "Battery",
                  minWidth: 100,
                  flex: 1,
                  cellClassName: (params) =>
                    clsx("battery", {
                      low: params.value === "low",
                      medium: params.value === "medium",
                      high: params.value === "high",
                    }),
                },
                {
                  field: "status",
                  headerName: "Status",
                  minWidth: 130,
                  flex: 1,
                },
                {
                  field: "Route",
                  headerName: "",
                  minWidth: 150,
                  flex: 1.2,
                  renderCell: (cellValues) => {
                    return (
                      <Link
                        onClick={handleLink}
                        name={cellValues.row.pid}
                        className="link"
                      >
                        View Participant
                      </Link>
                    );
                  },
                },
              ]}
              sx={{
                "& .battery.low": { color: "#ED5B5B" },
                "& .battery.medium": { color: "#FBA018" },
                "& .battery.high": { color: "#1F9E8A" },
              }}
              filename="Sensors Data"
              fields={[
                "pid",
                "name",
                "type",
                "location",
                "lastServiced",
                "battery",
                "status",
              ]}
              resetPage={resetPage}
            />
          </Container>
        </>
      )}
    </div>
  );
};

export default Sensors;
