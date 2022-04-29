import { useState, useEffect, useContext, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { set, reset } from "../../Store/Actions/DateAction";
import { CalendarContext } from "../../Contexts/CalendarContext";
import FilterExpandedChartMobile from "../../Components/Filter/FilterExpandedChartMobile";
import FilterExpandedChart from "../../Components/Filter/FilterExpandedChart";
import LineChart from "../../Components/LineChart/LineChart";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import BarChart from "../../Components/BarChart/BarChart";
import AnomalyTable from "../../Components/AnomalyTable/AnomalyTable";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import Boxplot from "../../Components/Boxplot/Boxplot";
import CalendarDate from "../../utils/CalendarDate";
import { biomarkersList } from "../../utils/Biomarker";
import {
  getBiomarkers,
  getBiomarkersBoxPlot,
  plotBiomarkersBoxPlot,
} from "../../API/apis";

const CompareGroupsResultExpandGraph = () => {
  const { navBarOpen } = useContext(CalendarContext);
  const compareParticipants = useSelector((state) => state.compareGroups);
  const [biomarkers, setBiomarkers] = useState(null);
  const view = "groups";
  const [graph, setGraph] = useState("line graph");
  const [finalGraph, setFinalGraph] = useState("line graph");
  const [anomaly, setAnomaly] = useState({});
  const [plotBoxplot, setPlotBoxplot] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const compareAgainstAverage = useSelector(
    (state) => state.compareAgainstAverage
  );
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const [period, setPeriod] = useState(date[view].period);
  const { formData, setFormData } = useContext(CalendarContext);

  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;

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

  let startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "groups"
  ).startDate;
  let endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "groups"
  ).endDate;
  const location = useLocation();
  const { biomarker } = location.state;

  const crumbs = [
    { pageLink: "/comparegroups", pageName: "Compare Groups" },
    { pageLink: "/comparegroups/results", pageName: "Compare Groups Results" },
    {
      pageLink: `/comparegroups/results/${biomarker}`,
      pageName: "Compare Groups Result Expanded",
    },
  ];

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

  useEffect(() => {
    fetchAnomalyData();
    fetchBiomarkerData();
    fetchPlotBoxPlot();
    if (date["groups"].graph !== null) {
      setFinalGraph(date["groups"].graph);
    }
  }, []);

  const fetchAnomalyData = async () => {
    try {
      let periodicity = formData[view].period;
      setPeriod(formData[view].period);

      for (const group of Object.keys(compareParticipants)) {
        if (compareParticipants[group].isChecked === true) {
          var participant_list = compareParticipants[group].data;
          const response = await getBiomarkersBoxPlot(
            startDate,
            endDate,
            biomarker,
            periodicity,
            participant_list
          );
          const data = JSON.parse(response.data);
          setAnomaly((prevAnomaly) => ({
            ...prevAnomaly,
            [compareParticipants[group].name]: data,
          }));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchBiomarkerData = async () => {
    try {
      let periodicity = formData[view].period;
      setPeriod(date[view].period);

      for (const group of Object.keys(compareParticipants)) {
        if (compareParticipants[group].isChecked === true) {
          var participant_list = compareParticipants[group].data;
          const response = await getBiomarkers(
            startDate,
            endDate,
            "all",
            periodicity,
            participant_list
          );
          const data = JSON.parse(response.data);
          setBiomarkers((prevBiomarkersData) => ({
            ...prevBiomarkersData,
            [compareParticipants[group].name]: data,
          }));
        }
      }
      if (compareAgainstAverage) {
        const response = await getBiomarkers(
          startDate,
          endDate,
          "all",
          periodicity,
          []
        );
        const data = JSON.parse(response.data);
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          ["All"]: data,
        }));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const resetBiomarkerData = async () => {
    try {
      for (const group of Object.keys(compareParticipants)) {
        if (compareParticipants[group].isChecked === true) {
          var participant_list = compareParticipants[group].data;
          const response = await getBiomarkers(
            startDate,
            endDate,
            "all",
            "month",
            participant_list
          );
          const data = JSON.parse(response.data);
          const boxplotResponse = await getBiomarkersBoxPlot(
            startDate,
            endDate,
            biomarker,
            "month",
            participant_list
          );
          const boxplotData = JSON.parse(boxplotResponse.data);
          const plotBoxplot = await plotBiomarkersBoxPlot(
            startDate,
            endDate,
            "all",
            "month",
            participant_list
          );
          const plotBoxplotData = JSON.parse(plotBoxplot.data);
          setBiomarkers((prevBiomarkersData) => ({
            ...prevBiomarkersData,
            [compareParticipants[group].name]: data,
          }));
          setAnomaly((prevAnomaly) => ({
            ...prevAnomaly,
            [compareParticipants[group].name]: boxplotData,
          }));
          setPlotBoxplot((prevPlotBoxplot) => ({
            ...prevPlotBoxplot,
            [compareParticipants[group].name]: plotBoxplotData,
          }));
        }
      }

      if (compareAgainstAverage === true) {
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
        const plotBoxplot = await plotBiomarkersBoxPlot(
          startDate,
          endDate,
          "all",
          "month",
          []
        );
        const plotBoxplotData = JSON.parse(plotBoxplot.data);
        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          ["All"]: data,
        }));
        setPlotBoxplot((prevPlotBoxplot) => ({
          ...prevPlotBoxplot,
          ["All"]: plotBoxplotData,
        }));
        setAnomaly((prevAnomaly) => ({
          ...prevAnomaly,
          ["All"]: boxplotData,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchPlotBoxPlot = async () => {
    try {
      let periodicity = formData[view].period;
      setPeriod(formData[view].period);

      for (const group of Object.keys(compareParticipants)) {
        if (compareParticipants[group].isChecked === true) {
          var participant_list = compareParticipants[group].data;
          const response = await plotBiomarkersBoxPlot(
            startDate,
            endDate,
            "all",
            periodicity,
            participant_list
          );
          const data = JSON.parse(response.data);

          setPlotBoxplot((prevPlotBoxplot) => ({
            ...prevPlotBoxplot,
            [compareParticipants[group].name]: data,
          }));
        }
      }
      if (compareAgainstAverage) {
        const response = await plotBiomarkersBoxPlot(
          startDate,
          endDate,
          "all",
          periodicity,
          []
        );
        const data = JSON.parse(response.data);
        setPlotBoxplot((prevPlotBoxplot) => ({
          ...prevPlotBoxplot,
          ["All"]: data,
        }));
      }
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
    fetchAnomalyData();
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
    dispatch(reset("groups"));
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
  // Handling PDF Download
  function downloadPDF() {
    const input = document.getElementById("Graph");
    const pdf = new jsPDF("landscape", "pt", "a4");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.setFontSize(20);
      pdf.text(`Compare Groups (${biomarkersList[biomarker]})`, 20, 20);
      pdf.setFontSize(12);
      pdf.text("Date Generated: " + new Date().toLocaleString(), 20, 40);
      pdf.text("Periodicity: " + formData[view].period, 20, 60);
      pdf.text("Start Date: " + startDate, 20, 80);
      pdf.text("End Date: " + endDate, 150, 80);
      pdf.addImage(imgData, "JPEG", 20, 90, 650, 500);
      pdf.save(`Compare Groups ${biomarkersList[biomarker]}.pdf`);
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
          position: "sticky",
          top: 0,
          paddingTop: "8px",
          paddingBottom: "8px",
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
                data={biomarkers}
                periodicity={period}
                biomarker_name={biomarker}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                group="true"
                navigate="/comparegroups/results"
              />
            ) : finalGraph === "barchart" ? (
              <BarChart
                title={biomarkersList[biomarker]}
                data={biomarkers}
                periodicity={period}
                biomarker_name={biomarker}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                group="true"
                navigate="/comparegroups/results"
              />
            ) : (
              <Boxplot
                title={biomarkersList[biomarker]}
                biomarker={biomarker}
                biomarker_name={biomarker}
                data={plotBoxplot}
                periodicity={period}
                titleContainerClass="expandedTitleContainer"
                graphClass="expandedGraphContainer"
                titleClass="expandedGraphTitle"
                group="true"
                navigate="/comparegroups/results"
              />
            )}
          </Grid>
          <Grid item id="filter" xs={navBarOpen === "open" ? 3.5 : 2.8}>
            <FilterExpandedChart
              onApply={handleApply}
              onReset={handleReset}
              changeGraph={handleGraphChange}
              graphValue={graph}
              id="groups"
            />
          </Grid>
          <Grid xs={12}>
            {_.map(Object.keys(compareParticipants), (key) => {
              if (compareParticipants[key].isChecked === true) {
                var name = compareParticipants[key].name;
                return (
                  <Grid item xs={11}>
                    <AnomalyTable
                      anomaly={anomaly[name]}
                      group="true"
                      name={name}
                      biomarker={biomarker}
                      dataset={biomarkers}
                      periodicity={period}
                      comparegroup={true}
                    />
                  </Grid>
                );
              }
            })}
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
                  id="groups"
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
                  data={biomarkers}
                  periodicity={period}
                  biomarker_name={biomarker}
                  titleContainerClass="expandedTitleContainer"
                  graphClass="expandedGraphContainer"
                  titleClass="expandedGraphTitle"
                  group="true"
                  navigate="/comparegroups/results"
                />
              ) : finalGraph === "barchart" ? (
                <BarChart
                  title={biomarkersList[biomarker]}
                  data={biomarkers}
                  periodicity={period}
                  biomarker_name={biomarker}
                  titleContainerClass="expandedTitleContainer"
                  graphClass="expandedGraphContainer"
                  titleClass="expandedGraphTitle"
                  group="true"
                  navigate="/comparegroups/results"
                />
              ) : (
                <Boxplot
                  title={biomarkersList[biomarker]}
                  biomarker={biomarker}
                  biomarker_name={biomarker}
                  data={plotBoxplot}
                  periodicity={period}
                  titleContainerClass="expandedTitleContainer"
                  graphClass="expandedGraphContainer"
                  titleClass="expandedGraphTitle"
                  group="true"
                  navigate="/comparegroups/results"
                />
              )}
            </Grid>
            <Grid xs={12}>
              {_.map(Object.keys(compareParticipants), (key) => {
                if (compareParticipants[key].isChecked === true) {
                  var name = compareParticipants[key].name;
                  return (
                    <Grid item xs={11}>
                      <AnomalyTable
                        anomaly={anomaly[name]}
                        group="true"
                        name={name}
                        biomarker={biomarker}
                        dataset={biomarkers}
                        periodicity={period}
                        comparegroup={true}
                      />
                    </Grid>
                  );
                }
              })}
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default CompareGroupsResultExpandGraph;
