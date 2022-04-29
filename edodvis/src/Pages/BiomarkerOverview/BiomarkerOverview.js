import React, { useEffect, useState, createRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { FaFilter } from "react-icons/fa";
import moment from "moment";
import { set, reset } from "../../Store/Actions/DateAction";
import { CalendarContext } from "../../Contexts/CalendarContext";
import LineChart from "../../Components/LineChart/LineChart";
import { getBiomarkers } from "../../API/apis";
import FilterBm from "../../Components/Filter/FilterBm";
import FilterBmMobile from "../../Components/Filter/FilterBmMobile";
import PageBreadCrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import CalendarDate from "../../utils/CalendarDate";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import { biomarkersList, colour } from "../../utils/Biomarker";
import NoMotionModal from "../../Components/NoMotionModal/NoMotionModal";
import WindowDimension from "../../utils/WindowDimension";
import "./BiomarkerOverview.css";

const BiomarkerOverview = () => {
  const crumbs = [
    { pageLink: "/biomarkersoverview", pageName: "Biomarker Overview" },
  ];
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const popStatus = useSelector((state) => state.popStatus);
  const view = "overview";

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

  const [period, setPeriod] = useState(date[view].period);
  const { biomarkers, setBiomarkers } = useContext(CalendarContext);
  const [isLoading, setIsLoading] = useState(true);
  const { formData, setFormData } = useContext(CalendarContext);

  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;

  var startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "overview"
  ).startDate;
  var endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "overview"
  ).endDate;

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
        []
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
      const response = await getBiomarkers(
        startDate,
        endDate,
        "all",
        "month",
        []
      );
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
    dispatch(reset("overview"));

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
    setOpen(false);
  }

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
      "overview",
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
    setOpen(false);
  }

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = createRef();
  // Conditional Render of Filter
  const isDesktop = WindowDimension();

  function downloadPDF() {
    const input = document.getElementById("Graphs");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.setFillColor(255, 255, 255);
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.setFontSize(20);
      pdf.text("Biomarkers Overview", 20, 20);
      pdf.setFontSize(12);
      pdf.text("Date Generated: " + new Date().toLocaleString(), 20, 40);
      pdf.text("Periodicity: " + formData[view].period, 20, 60);
      pdf.text("Start Date: " + startDate, 20, 80);
      pdf.text("End Date: " + endDate, 150, 80);
      pdf.addImage(imgData, "JPEG", 20, 90, 650, 500);
      pdf.save("BiomarkerOverview.pdf");
    });
  }

  if (biomarkers === null) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      {isDesktop ? (
        <div
          name="filter"
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
            <PageBreadCrumb crumbs={crumbs} />
            <FileDownloadIcon
              onClick={() => {
                downloadPDF();
              }}
              className="downloadIcon"
            />
          </div>
          <FilterBm
            toggleReset={resetData}
            toggleFilter={filterData}
            id="overview"
          />
        </div>
      ) : (
        <div
          name="filter"
          style={{
            background: "#E6ECF2",
            position: "-webkit-sticky",
            top: 0,
            paddingTop: "5px",
            paddingBottom: "5px",
            zIndex: 2,
            width: "100%",
          }}
        >
          <div style={{ display: "inline-flex", width: "100%" }}>
            <PageBreadCrumb crumbs={crumbs} />
          </div>
          <Button
            variant="contained"
            onClick={handleOpen}
            className="filterButton"
          >
            <FaFilter /> &nbsp;Filter
          </Button>
          <Modal open={open}>
            <FilterBmMobile
              onClickClose={handleClose}
              toggleReset={resetData}
              toggleFilter={filterData}
              ref={ref}
              id="overview"
            />
          </Modal>
        </div>
      )}
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <Container component="main" sx={{ mb: 10 }}>
          {!popStatus && <NoMotionModal />}
          <Grid
            container
            alignItems="center"
            justifyContent="center"
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
                    biomarker={biomarkers}
                    titleContainerClass="overviewCardTitle"
                    graphClass="overviewCardContent"
                    titleClass="overviewGraphTitle"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default BiomarkerOverview;
