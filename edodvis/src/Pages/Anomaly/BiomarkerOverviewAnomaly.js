import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CalendarContext } from "../../Contexts/CalendarContext";
import { getBiomarkers } from "../../API/apis";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import Statistics from "../../Components/Statistics/Statistics";
import { biomarkersList, anomalyNames } from "../../utils/Biomarker";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import BarChart from "../../Components/BarChart/BarChart";

const BiomarkerOverviewAnomaly = (props) => {
  const { navBarOpen } = useContext(CalendarContext);
  const location = useLocation();
  const {
    participant_id,
    biomarker,
    date,
    colour,
    data,
    overview,
    comparegroup,
  } = location.state;
  const [biomarkers, setBiomarkers] = useState({});
  const [averageBiomarkers, setAverageBiomarkers] = useState({});
  const [allAverageBiomarkers, setAllAverageBiomarkers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let value = new Date(date);
  let startValue = new Date(value.getFullYear(), value.getMonth(), 1);
  startValue = moment(startValue).format("YYYY-MM-DD");
  let endValue = new Date(value.getFullYear(), value.getMonth() + 1, 0);
  endValue = moment(endValue).format("YYYY-MM-DD");
  let endDate = endValue;
  let startDate = startValue;

  function convertDate(date) {
    var month = months[new Date(date).getMonth()];
    var year = new Date(date).getFullYear();
    let formattedDate = `${month} ${year}`;

    return formattedDate;
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
    fetchAverage();
  }, []);

  const fetchBiomarkerData = async () => {
    try {
      const response = await getBiomarkers(
        startDate,
        endDate,
        biomarker,
        "day",
        [participant_id]
      );
      const data = JSON.parse(response.data);
      console.log(data);
      setBiomarkers((prevBiomarkersData) => ({
        ...prevBiomarkersData,
        [biomarker]: getData(data[biomarker][0]),
      }));
    } catch (e) {
      console.log(e);
    }
  };

  console.log(biomarkers);

  const fetchAverage = async () => {
    try {
      const response = await getBiomarkers(startDate, endDate, "all", "month", [
        participant_id,
      ]);
      const data = JSON.parse(response.data);
      for (const biomarker of Object.keys(biomarkersList)) {
        setAverageBiomarkers((prevAverageBiomarkers) => ({
          ...prevAverageBiomarkers,
          [biomarker]: getData(data[biomarker][0]),
        }));
      }
      const allResponse = await getBiomarkers(
        startDate,
        endDate,
        biomarker,
        "month",
        []
      );
      const allData = JSON.parse(allResponse.data);
      setAllAverageBiomarkers((prevAllAverageBiomarkers) => ({
        ...prevAllAverageBiomarkers,
        [biomarker]: getData(allData[biomarker][0]),
      }));
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Conditional Render
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  function downloadPDF() {
    const input = document.getElementById("Graph");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.setFillColor(255, 255, 255);
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.setFontSize(20);
      pdf.text(`Anomaly Detected for ${biomarkersList[biomarker]}`, 20, 20);
      pdf.setFontSize(12);
      pdf.text("Date Generated: " + new Date().toLocaleString(), 20, 40);
      pdf.addImage(imgData, "JPEG", 20, 50, 670, 500);
      pdf.save("Anomaly.pdf");
    });
  }

  const crumbs = [
    { pageLink: "/biomarkersoverview", pageName: "Biomarker Overview" },
    {
      pageLink: `/biomarkersoverview/${biomarker}`,
      pageName: `${biomarkersList[biomarker]}`,
    },
    { pageLink: `/anomaly/${biomarker}`, pageName: "Anomaly" },
  ];

  if (isLoading) {
    return <LoadingAnimation />;
  }
  console.log(averageBiomarkers);

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
            <PageBreadcrumb crumbs={crumbs} />
            <FileDownloadIcon
              onClick={() => {
                downloadPDF();
              }}
              className="downloadIcon"
            />
          </div>
        </div>
      ) : (
        <div
          name="filter"
          style={{
            background: "#E6ECF2",
            position: "-webkit-sticky",
            position: "sticky",
            top: 0,
            paddingTop: "8px",
            paddingBottom: "8px",
            zIndex: 2,
            width: "100%",
          }}
        >
          <div style={{ display: "inline-flex", width: "100%" }}>
            <PageBreadcrumb crumbs={crumbs} />
          </div>
        </div>
      )}
      <Grid
        container
        component="main"
        display="fluid"
        justifyContent="center"
        id="Graph"
      >
        <Grid
          item
          id="Graph"
          xs={!isDesktop ? 8 : navBarOpen === "open" ? 8 : 8.6}
          sx={{ mr: "8px" }}
        >
          <Grid
            item
            id="Graph"
            xs={!isDesktop ? 3 : navBarOpen === "open" ? 8 : 8.6}
            sx={{ mr: "8px" }}
          ></Grid>
          <BarChart
            title={anomalyNames[biomarker]}
            labels={biomarkers[biomarker]["date"]}
            data={biomarkers[biomarker]["value"]}
            dataset={data}
            periodicity="day"
            colour={colour}
            anomaly="true"
            comparegroup={comparegroup}
            participant_id={participant_id}
            overview={overview}
            biomarker={biomarker}
            titleContainerClass="expandedTitleContainer"
            graphClass="expandedGraphContainer"
            titleClass="expandedGraphTitle"
            date={convertDate(date)}
            average={averageBiomarkers[biomarker]}
            allAverageBiomarkers={allAverageBiomarkers}
          />
        </Grid>
        <Grid item id="filter" xs={navBarOpen === "open" ? 3.5 : 2.8}>
          <Statistics
            average={averageBiomarkers}
            date={convertDate(date)}
            participant={participant_id}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BiomarkerOverviewAnomaly;
