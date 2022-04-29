import React, { useEffect, useState, createRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Button from "@mui/material/Button";
import { FaFilter } from "react-icons/fa";
import _ from "lodash";
import Modal from "@mui/material/Modal";
import moment from "moment";
import { set, reset } from "../../Store/Actions/DateAction";
import LineChart from "../../Components/LineChart/LineChart";
import { CalendarContext } from "../../Contexts/CalendarContext";
import { getBiomarkers } from "../../API/apis";
import FilterBm from "../../Components/Filter/FilterBm";
import FilterBmMobile from "../../Components/Filter/FilterBmMobile";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import CalendarDate from "../../utils/CalendarDate";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import { biomarkersList, colour } from "../../utils/Biomarker";
import "./ParticipantCharts.css";
import IdCards from "../../Components/IdCards/IdCards";
import WindowDimension from "../../utils/WindowDimension";

const ParticipantCharts = () => {
  const location = useLocation();
  const { participant_id } = location.state;
  const { biomarkers, setBiomarkers } = useContext(CalendarContext);
  const view = "individual";
  const [isLoading, setIsLoading] = useState(true);

  const GroupName = [`Participant ID: ${participant_id}`];
  const GroupNameColour = ["#B5D5E2"];

  const crumbs = [
    { pageLink: "/profile", pageName: "Individual Profile" },
    {
      pageLink: `/participant_charts/${participant_id}`,
      pageName: `Participant Charts ${participant_id}`,
    },
  ];

  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;
  const [period, setPeriod] = useState(date[view].period);
  const { formData, setFormData } = useContext(CalendarContext);

  var startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "individual"
  ).startDate;
  var endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "individual"
  ).endDate;

  function persistDate(
    id,
    startDate,
    endDate,
    period,
    graph,
    dayStart,
    dayEnd,
    weekStart,
    weekEnd,
    monthStart,
    monthEnd
  ) {
    dispatch(
      set(
        id,
        startDate,
        endDate,
        period,
        graph,
        dayStart,
        dayEnd,
        weekStart,
        weekEnd,
        monthStart,
        monthEnd
      )
    );
  }

  useEffect(() => {
    fetchBiomarkerData();
  }, []);

  const fetchBiomarkerData = async () => {
    try {
      setPeriod(formData[view].period);
      const response = await getBiomarkers(
        startDate,
        endDate,
        "all",
        formData[view].period,
        [participant_id]
      );
      const data = JSON.parse(response.data);
      for (const biomarker of Object.keys(biomarkersList)) {
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          [biomarker]: getData(data[biomarker][0]),
        }));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const resetBiomarkerData = async () => {
    try {
      const response = await getBiomarkers(startDate, endDate, "all", "month", [
        participant_id,
      ]);
      const data = JSON.parse(response.data);
      for (const biomarker of Object.keys(biomarkersList)) {
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          [biomarker]: getData(data[biomarker][0]),
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  function getData(data) {
    let date = [];
    let value = [];
    _.map(Object.keys(data), (key) => {
      date.push(key);
      value.push(data[key]);
    });
    return { date: date, value: value };
  }

  function resetData() {
    setPeriod("month");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [view]: {
        period: "month",
      },
    }));
    dispatch(reset("individual"));

    let startValue = new Date(); //latest data
    startDate = new Date(
      startValue.getFullYear(),
      startValue.getMonth() - 5,
      1
    );
    startDate = moment(startDate).format("YYYY-MM-DD");

    let endValue = new Date(); //latest data
    endDate = new Date(endValue.getFullYear(), endValue.getMonth() + 1, 0);
    endDate = moment(endDate).format("YYYY-MM-DD");

    resetBiomarkerData();
  }

  console.log(date);

  function filterData() {
    if (
      moment(startDate, "YYYY-MM-DD").toDate() >
      moment(endDate, "YYYY-MM-DD").toDate()
    ) {
      alert(
        "Start date is later than end date. Please ensure start date is before end date."
      );
      return;
    }
    persistDate(
      "individual",
      startDate,
      endDate,
      formData[view].period,
      "line graph",
      startDateDay,
      endDateDay,
      startDateWeek,
      endDateWeek,
      startDateMonth,
      endDateMonth
    );
    setPeriod(formData[view].period);
    fetchBiomarkerData();
  }

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = createRef();

  // Conditional Render of Filter
  const isDesktop = WindowDimension();

  // start test PDF
  function downloadPDF1() {
    const input = document.getElementById("Graphs");
    const pdf = new jsPDF("landscape", "pt", "a4");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.setFontSize(20);
      pdf.text("Participants Overview", 20, 20);
      pdf.setFontSize(12);
      pdf.text("Participant ID: " + participant_id, 20, 40);
      pdf.text("Period: " + formData[view].period, 20, 60);
      pdf.text("Start Date: " + startDate, 20, 80);
      pdf.text("End Date: " + endDate, 20, 100);
      pdf.addImage(imgData, "JPEG", 20, 120, 620, 470);
      pdf.save("ParticipantOverview.pdf");
    });
  }

  if (biomarkers === null) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <Container className="profile"></Container>
      {isDesktop ? (
        <div
          ClassName="stickyHeader"
          style={{
            background: "#E6ECF2",
            position: "sticky",
            top: 0,
            paddingTop: "5px",
            paddingBottom: "5px",
            zIndex: 2,
          }}
        >
          <div style={{ display: "inline-flex", width: "100%" }}>
            <PageBreadcrumb crumbs={crumbs} />
            <FileDownloadIcon
              onClick={() => {
                downloadPDF1();
              }}
              className="downloadIcon"
            />
          </div>
          <div className="IdCard">
            <IdCards GroupName={GroupName} GroupNameColour={GroupNameColour} />
          </div>
          <FilterBm
            toggleReset={resetData}
            toggleFilter={filterData}
            id="individual"
          />
        </div>
      ) : (
        <div>
          <div
            name="filter"
            style={{
              background: "#E6ECF2",
              position: "sticky",
              top: 0,
              paddingTop: "5px",
              paddingBottom: "5px",
              zIndex: 2,
              width: "100%",
            }}
          >
            <div style={{ display: "inline-flex", width: "100%" }}>
              <PageBreadcrumb crumbs={crumbs} />
            </div>
            <div className="IdCard">
              <IdCards
                GroupName={GroupName}
                GroupNameColour={GroupNameColour}
              />
            </div>
          </div>
          <Container>
            <Button
              id="mobileFilter"
              variant="contained"
              sx={{ bgcolor: "primary.dark", marginBottom: "8px" }}
              onClick={handleOpen}
            >
              <FaFilter /> &nbsp;Filter
            </Button>
            <Modal open={open}>
              <FilterBmMobile
                onClickClose={handleClose}
                toggleReset={resetData}
                toggleFilter={filterData}
                ref={ref}
                id="individual"
              />
            </Modal>
          </Container>
        </div>
      )}
      <Container component="main" sx={{ mb: 10 }}>
        <Grid
          container
          alignItems="center stretch"
          justifyContent="space-between"
          id="Graphs"
        >
          {_.map(Object.keys(biomarkers), (key) => {
            return (
              <Grid
                item
                key={key}
                xs={11}
                sm={6}
                md={4}
                sx={{ p: "4px" }}
                id={biomarkersList[key]}
              >
                <LineChart
                  title={biomarkersList[key]}
                  labels={biomarkers[key].date}
                  data={biomarkers[key].value}
                  periodicity={period}
                  colour={colour[key]}
                  id={key}
                  true="false"
                  titleContainerClass="overviewCardTitle"
                  graphClass="overviewCardContent"
                  titleClass="overviewGraphTitle"
                  individual_data={biomarkers}
                  participant_id={participant_id}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default ParticipantCharts;
