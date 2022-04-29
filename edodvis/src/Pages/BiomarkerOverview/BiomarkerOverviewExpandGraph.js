import { useState, useEffect, useContext, createRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import moment from "moment";
import { set, reset } from "../../Store/Actions/DateAction";
import FilterExpandedChartMobile from "../../Components/Filter/FilterExpandedChartMobile";
import { CalendarContext } from "../../Contexts/CalendarContext";
import FilterExpandedChart from "../../Components/Filter/FilterExpandedChart";
import LineChart from "../../Components/LineChart/LineChart";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import BarChart from "../../Components/BarChart/BarChart";
import {
  getBiomarkers,
  getBiomarkersBoxPlot,
  plotBiomarkersBoxPlot,
} from "../../API/apis";
import Boxplot from "../../Components/Boxplot/Boxplot";
import CalendarDate from "../../utils/CalendarDate";
import { biomarkersList } from "../../utils/Biomarker";
import AnomalyTable from "../../Components/AnomalyTable/AnomalyTable";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import WindowDimension from "../../utils/WindowDimension";
import "./BiomarkerOverview.css";

const BiomarkerOverviewExpandGraph = () => {
  const { navBarOpen } = useContext(CalendarContext);
  const { biomarkers, setBiomarkers } = useContext(CalendarContext);
  const [graph, setGraph] = useState("line graph");
  const [finalGraph, setFinalGraph] = useState("line graph");
  const [anomaly, setAnomaly] = useState({});
  const [plotBoxplot, setPlotBoxplot] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { biomarker, colour } = location.state;
  const crumbs = [
    { pageLink: "/biomarkersoverview", pageName: "Biomarker Overview" },
    {
      pageLink: `/biomarkersoverview/${biomarker}`,
      pageName: `${biomarkersList[biomarker]}`,
    },
  ];

  // Conditional Render
  const isDesktop = WindowDimension();

  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const view = "overview";
  const [period, setPeriod] = useState(date[view].period);
  const { formData, setFormData } = useContext(CalendarContext);
  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;

  let startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "overview"
  ).startDate;
  let endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "overview"
  ).endDate;

  function handleGraphChange(event) {
    setGraph(event.target.value);
  }

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

  function getData(data) {
    let date = [];
    let value = [];
    _.map(Object.keys(data), (key) => {
      date.push(key);
      value.push(data[key]);
    });
    return { date: date, value: value };
  }

  useEffect(() => {
    fetchBiomarkerData();
    fetchPlotBoxPlot();
    if (date[view].graph !== null) {
      setFinalGraph(date[view].graph);
    }
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
      const boxplotResponse = await getBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        formData[view].period,
        []
      );
      const data = JSON.parse(response.data);
      const boxplotData = JSON.parse(boxplotResponse.data);

      for (const biomarker of Object.keys(biomarkersList)) {
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          [biomarker]: getData(data[biomarker][0]),
        }));
        setAnomaly((prevAnomalyData) => ({
          ...prevAnomalyData,
          [biomarker]: boxplotData[biomarker],
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

      const boxplotResponse = await getBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        "month",
        []
      );
      const boxplotData = JSON.parse(boxplotResponse.data);
      const plotBoxplotResponse = await plotBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        "month",
        []
      );
      const plotBoxplotData = JSON.parse(plotBoxplotResponse.data);
      setPlotBoxplot(plotBoxplotData[biomarker]);

      for (const biomarker of Object.keys(biomarkersList)) {
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          [biomarker]: getData(data[biomarker][0]),
        }));
        setAnomaly((prevAnomalyData) => ({
          ...prevAnomalyData,
          [biomarker]: boxplotData[biomarker],
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPlotBoxPlot = async () => {
    try {
      setPeriod(formData[view].period);
      const response = await plotBiomarkersBoxPlot(
        startDate,
        endDate,
        biomarker,
        formData[view].period,
        []
      );
      const data = JSON.parse(response.data);

      setPlotBoxplot(data);
    } catch (e) {
      console.log(e);
    }
  };

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = createRef();

  // Handle Apply Button (OnClick)

  function handleApply() {
    if (
      moment(startDate, "YYYY-MM-DD").toDate() >
      moment(endDate, "YYYY-MM-DD").toDate()
    ) {
      alert(
        "Start date is later than end date. Please ensure start date is before end date."
      );
      return;
    }
    setFinalGraph(graph);
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
    fetchPlotBoxPlot();
    setOpen(false);
  }

  // Handle Reset Button (onClick)
  function handleReset() {
    setPeriod("month");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [view]: {
        period: "month",
      },
    }));

    dispatch(reset("overview"));
    setFinalGraph("line graph");
    setGraph("line graph");

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

  // start test PDF
  function downloadPDF() {
    const input = document.getElementById("Graph");
    const pdf = new jsPDF("landscape", "pt", "a4");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.setFontSize(20);
      pdf.text("Biomarkers Overview: " + biomarkersList[biomarker], 20, 20);
      pdf.setFontSize(12);
      pdf.text("Date Generated: " + new Date().toLocaleString(), 20, 40);
      pdf.text("Periodicity: " + formData[view].period, 20, 60);
      pdf.text("Start Date: " + startDate, 20, 80);
      pdf.text("End Date: " + endDate, 150, 80);
      pdf.addImage(imgData, "JPEG", 300, 60, 470, 370);
      pdf.save(`${biomarkersList[biomarker]}.pdf`);
    });
  }
  // end test PDF

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div>
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
          display: "inline-flex",
          width: "100%",
        }}
      >
        <PageBreadcrumb crumbs={crumbs} />
        <FileDownloadIcon
          onClick={() => {
            downloadPDF();
          }}
          className="downloadIcon"
        />
      </div>
      {isDesktop ? (
        <Grid
          container
          component="main"
          display="fluid"
          justifyContent="center"
        >
          <Grid
            item
            id="Graph"
            xs={navBarOpen === "open" ? 8 : 8.6}
            sx={{ mr: "8px" }}
          >
            {finalGraph === "line graph" ? (
              <LineChart
                title={biomarkersList[biomarker]}
                labels={biomarkers[biomarker]["date"]}
                data={biomarkers[biomarker]["value"]}
                periodicity={period}
                colour={colour}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                navigate="/biomarkersoverview/"
              />
            ) : finalGraph === "barchart" ? (
              <BarChart
                title={biomarkersList[biomarker]}
                labels={biomarkers[biomarker]["date"]}
                data={biomarkers[biomarker]["value"]}
                periodicity={period}
                colour={colour}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                navigate="/biomarkersoverview/"
              />
            ) : (
              <Boxplot
                title={biomarkersList[biomarker]}
                biomarker={biomarker}
                data={plotBoxplot}
                periodicity={period}
                colour={colour}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                navigate="/biomarkersoverview/"
              />
            )}
          </Grid>
          <Grid item id="filter" xs={navBarOpen === "open" ? 3.5 : 2.8}>
            <FilterExpandedChart
              id="overview"
              onApply={handleApply}
              onReset={handleReset}
              changeGraph={handleGraphChange}
              graphValue={graph}
            />
          </Grid>

          <Grid item xs={12}>
            <AnomalyTable
              anomaly={anomaly[biomarker]}
              dataset={biomarkers}
              biomarker={biomarker}
              colour={colour}
              periodicity={period}
              participantId={true}
              overview={true}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid
            container
            component="main"
            display="fluid"
            gap={1}
            sx={{ m: 0 }}
          >
            <Container component="main" display="inline-flex">
              <Button
                variant="contained"
                sx={{ bgcolor: "primary.dark", mb: 1 }}
                onClick={handleOpen}
              >
                <FaFilter /> &nbsp;Filter
              </Button>
              <Modal open={open}>
                <FilterExpandedChartMobile
                  onClickClose={handleClose}
                  onApply={handleApply}
                  onReset={handleReset}
                  changeGraph={handleGraphChange}
                  graphValue={graph}
                  ref={ref}
                  id="overview"
                />
              </Modal>
            </Container>
          </Grid>
          <Grid
            container
            component="main"
            display="fluid"
            justifyContent="center"
          >
            <Grid item id="Graph" xs={12} sx={{ mx: "25px", mt: "8px" }}>
              {finalGraph === "line graph" ? (
                <LineChart
                  title={biomarkersList[biomarker]}
                  labels={biomarkers[biomarker]["date"]}
                  data={biomarkers[biomarker]["value"]}
                  periodicity={period}
                  colour={colour}
                  titleContainerClass="expandedTitleContainer"
                  graphClass="expandedGraphContainer"
                  titleClass="expandedGraphTitle"
                  navigate="/biomarkersoverview/"
                />
              ) : finalGraph === "barchart" ? (
                <BarChart
                  title={biomarkersList[biomarker]}
                  labels={biomarkers[biomarker]["date"]}
                  data={biomarkers[biomarker]["value"]}
                  periodicity={period}
                  colour={colour}
                  navigate="/biomarkersoverview/"
                />
              ) : (
                <Boxplot
                  title={biomarkersList[biomarker]}
                  biomarker={biomarker}
                  data={plotBoxplot}
                  periodicity={period}
                  colour={colour}
                  navigate="/biomarkersoverview/"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <AnomalyTable
                anomaly={anomaly[biomarker]}
                dataset={biomarkers}
                biomarker={biomarker}
                colour={colour}
                periodicity={period}
                participantId={true}
                overview={true}
              />
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default BiomarkerOverviewExpandGraph;
