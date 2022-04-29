import { useState, useEffect, useContext, createRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import moment from "moment";
import { set, reset } from "../../Store/Actions/DateAction";
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
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FilterExpandedChartMobile from "../../Components/Filter/FilterExpandedChartMobile";

const ParticipantChartsExpandGraph = () => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const view = "individual";
  const { navBarOpen } = useContext(CalendarContext);
  const { biomarkers, setBiomarkers } = useContext(CalendarContext);
  const [graph, setGraph] = useState("line graph");
  const [finalGraph, setFinalGraph] = useState("line graph");
  const [anomaly, setAnomaly] = useState({});
  const [plotBoxplot, setPlotBoxplot] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;
  const [period, setPeriod] = useState(date[view].period);
  const { formData, setFormData } = useContext(CalendarContext);

  let startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "individual"
  ).startDate;
  let endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "individual"
  ).endDate;

  const location = useLocation();

  const { biomarker, colour, participant_id } = location.state;

  const crumbs = [
    { pageLink: "/profile", pageName: "Individual Profile" },
    {
      pageLink: `/participant_charts/${participant_id}`,
      pageName: `Participant Charts ${participant_id}`,
    },
    {
      pageLink: `/participant_charts_expand/${participant_id}`,
      pageName: `Participant ${participant_id}`,
    },
  ];

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

  // Conditional Render
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  function handleGraphChange(event) {
    setGraph(event.target.value);
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
    if (date["individual"].graph !== null) {
      setFinalGraph(date["individual"].graph);
    }
  }, []);

  const fetchBiomarkerData = async () => {
    try {
      let periodicity;
      if (date[view].startDate !== null) {
        periodicity = date[view].period;
        setPeriod(date[view].period);
      } else periodicity = formData[view].period;

      const response = await getBiomarkers(
        startDate,
        endDate,
        "all",
        periodicity,
        [participant_id]
      );
      const boxplotResponse = await getBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        periodicity,
        [participant_id]
      );
      const data = JSON.parse(response.data);
      const boxplotData = JSON.parse(boxplotResponse.data);

      for (const biomarker of Object.keys(biomarkersList)) {
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          [biomarker]: getData(data[biomarker][0]),
        }));
        setAnomaly((prevAnomaly) => ({
          ...prevAnomaly,
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
      const response = await getBiomarkers(startDate, endDate, "all", "month", [
        participant_id,
      ]);
      const data = JSON.parse(response.data);

      const boxplotResponse = await getBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        "month",
        [participant_id]
      );
      const boxplotData = JSON.parse(boxplotResponse.data);

      const plotBoxplotResponse = await plotBiomarkersBoxPlot(
        startDate,
        endDate,
        "all",
        "month",
        [participant_id]
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
      let periodicity;
      if (date[view].startDate !== null) {
        periodicity = date[view].period;
        setPeriod(date[view].period);
      } else periodicity = formData[view].period;

      const response = await plotBiomarkersBoxPlot(
        startDate,
        endDate,
        biomarker,
        periodicity,
        [participant_id]
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
    fetchPlotBoxPlot();
    setFinalGraph(graph);
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
    dispatch(reset("individual"));
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
  }

  function downloadPDF() {
    const input = document.getElementById("Graph");
    const pdf = new jsPDF("landscape", "pt", "a4");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.setFontSize(20);
      pdf.text(`Graph for Participant ${participant_id} `, 20, 20);
      pdf.setFontSize(12);
      pdf.text("Period: " + formData[view].period, 20, 40);
      pdf.text("Start Date: " + startDate, 20, 60);
      pdf.text("End Date: " + endDate, 20, 80);
      pdf.addImage(imgData, "JPEG", 20, 90, 650, 500);
      pdf.save(`Graph for Participant ${participant_id}.pdf`);
    });
  }

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div>
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
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
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
                    participant_id={participant_id}
                    titleContainerClass="expandedTitleContainer"
                    graphClass="expandedGraphContainer"
                    titleClass="expandedGraphTitle"
                    navigate={`/participant_charts/${participant_id}`}
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
                    participant_id={participant_id}
                    navigate={`/participant_charts/${participant_id}`}
                  />
                ) : (
                  <Boxplot
                    title={biomarkersList[biomarker]}
                    biomarker={biomarker}
                    data={plotBoxplot}
                    periodicity={period}
                    colour={colour}
                    participant_id={participant_id}
                    titleContainerClass="expandedTitleContainer"
                    graphClass="expandedGraphContainer"
                    titleClass="expandedGraphTitle"
                    navigate={`/participant_charts/${participant_id}`}
                    individual="true"
                  />
                )}
              </Grid>

              <Grid item id="filter" xs={navBarOpen === "open" ? 3.5 : 2.8}>
                <FilterExpandedChart
                  onApply={handleApply}
                  onReset={handleReset}
                  changeGraph={handleGraphChange}
                  graphValue={graph}
                  id="individual"
                />
              </Grid>

              <Grid item xs={12}>
                <AnomalyTable
                  anomaly={anomaly[biomarker]}
                  data={biomarkers}
                  biomarker={biomarker}
                  colour={colour}
                  periodicity={period}
                  participantId={false}
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
                      id="individual"
                    />
                  </Modal>
                </Container>
              </Grid>

              <Grid item id="Graph" xs={12} sx={{ mx: "25px", mt: "8px" }}>
                {finalGraph === "line graph" ? (
                  <LineChart
                    title={biomarkersList[biomarker]}
                    labels={biomarkers[biomarker]["date"]}
                    data={biomarkers[biomarker]["value"]}
                    periodicity={period}
                    colour={colour}
                    participant_id={participant_id}
                    titleContainerClass="expandedTitleContainer"
                    graphClass="expandedGraphContainer"
                    titleClass="expandedGraphTitle"
                    navigate={`/participant_charts/${participant_id}`}
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
                    participant_id={participant_id}
                    navigate={`/participant_charts/${participant_id}`}
                  />
                ) : (
                  <Boxplot
                    title={biomarkersList[biomarker]}
                    biomarker={biomarker}
                    data={plotBoxplot}
                    periodicity={period}
                    colour={colour}
                    participant_id={participant_id}
                    titleContainerClass="expandedTitleContainer"
                    graphClass="expandedGraphContainer"
                    titleClass="expandedGraphTitle"
                    navigate={`/participant_charts/${participant_id}`}
                    individual="true"
                  />
                )}
                <Grid item xs={12}>
                  <AnomalyTable
                    anomaly={anomaly[biomarker]}
                    data={biomarkers}
                    biomarker={biomarker}
                    colour={colour}
                    periodicity={period}
                    participantId={false}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ParticipantChartsExpandGraph;
