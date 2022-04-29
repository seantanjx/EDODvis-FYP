import { useDispatch, useSelector } from "react-redux";
import { useContext, useState, useEffect, createRef } from "react";
import _ from "lodash";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import moment from "moment";
import CalendarDate from "../../utils/CalendarDate";
import { biomarkersList } from "../../utils/Biomarker";
import { set, reset } from "../../Store/Actions/DateAction";
import { CalendarContext } from "../../Contexts/CalendarContext";
import FilterBm from "../../Components/Filter/FilterBm";
import FilterBmMobile from "../../Components/Filter/FilterBmMobile";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import IdCards from "../../Components/IdCards/IdCards";
import LineChart from "../../Components/LineChart/LineChart";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import { getBiomarkers } from "../../API/apis";
import "./CompareGroups.css";

const CompareGroupsResult = () => {
  const compareParticipants = useSelector((state) => state.compareGroups);
  const compareAgainstAverage = useSelector(
    (state) => state.compareAgainstAverage
  );
  const [GroupName, setGroupName] = useState([]);
  const [GroupNameColour, setGroupNameColour] = useState([]);
  const view = "groups";
  const [biomarkers, setBiomarkers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const date = useSelector((state) => state.persistDate);
  const [period, setPeriod] = useState(date[view].period);

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

  const startDateDay = date[view].dayStartDate;
  const endDateDay = date[view].dayEndDate;
  const startDateWeek = date[view].weekStartDate;
  const endDateWeek = date[view].weekEndDate;
  const startDateMonth = date[view].monthStartDate;
  const endDateMonth = date[view].monthEndDate;

  const { formData, setFormData } = useContext(CalendarContext);

  var startDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "groups"
  ).startDate;
  var endDate = CalendarDate(
    startDateDay,
    endDateDay,
    startDateMonth,
    endDateMonth,
    startDateWeek,
    endDateWeek,
    formData[view],
    "groups"
  ).endDate;

  const crumbs = [
    { pageLink: "/comparegroups", pageName: "Compare Groups" },
    { pageLink: "/comparegroups/results", pageName: "Compare Group Results" },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = createRef();
  // Conditional Render of Filter
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };

  function resetData() {
    setPeriod("month");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [view]: {
        period: "month",
      },
    }));
    dispatch(reset("groups"));

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
      "groups",
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

  useEffect(() => {
    fetchBiomarkerData();
    fetchGroups();
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const fetchGroups = async () => {
    try {
      for (const group of Object.keys(compareParticipants)) {
        if (compareParticipants[group].isChecked === true) {
          setGroupName((prevGroupName) => [
            ...prevGroupName,
            compareParticipants[group].name,
          ]);
          setGroupNameColour((prevGroupNameColour) => [
            ...prevGroupNameColour,
            compareParticipants[group].color,
          ]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  console.log(compareParticipants);

  const fetchBiomarkerData = async () => {
    try {
      let periodicity = formData[view].period;
      setPeriod(formData[view].period);
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
          "month",
          []
        );
        const data = JSON.parse(response.data);

        setBiomarkers((prevBiomarkersData) => ({
          ...prevBiomarkersData,
          ["All"]: data,
        }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // start test PDF
  function downloadPDF() {
    const input = document.getElementById("graphs");
    const pdf = new jsPDF("landscape", "pt", "a4");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.setFontSize(20);
      pdf.text("Compare Groups", 20, 20);
      pdf.setFontSize(12);
      pdf.text("Date Generated: " + new Date().toLocaleString(), 20, 40);
      pdf.text("Periodicity: " + formData[view].period, 20, 60);
      pdf.text("Start Date: " + startDate, 20, 80);
      pdf.text("End Date: " + endDate, 150, 80);
      pdf.text("Selected Groups: " + GroupName, 20, 100);
      pdf.addImage(imgData, "JPEG", 200, 120, 600, 450);
      pdf.save("CompareGroupsOverview.pdf");
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
            paddingTop: "8px",
            paddingBottom: "8px",
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
          <div className="IdCard">
            <IdCards GroupName={GroupName} GroupNameColour={GroupNameColour} />
          </div>
          <div id="FilterDesktop">
            <FilterBm
              toggleReset={resetData}
              toggleFilter={filterData}
              id="groups"
            />
          </div>
        </div>
      ) : (
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
            <IdCards GroupName={GroupName} GroupNameColour={GroupNameColour} />
          </div>
          <div id="FilterButton">
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
              onClick={handleOpen}
            >
              <FaFilter /> &nbsp;Filter
            </Button>
          </div>
          <Modal open={open}>
            <FilterBmMobile
              onClickClose={handleClose}
              toggleReset={resetData}
              toggleFilter={filterData}
              ref={ref}
              id="groups"
            />
          </Modal>
        </div>
      )}
      <Container component="main" sx={{ mb: 10 }}>
        <Grid container alignItems="center" justifyContent="center" id="graphs">
          {_.map(Object.keys(biomarkersList), (key) => {
            return (
              <Grid item key={key} xs={11} sm={6} md={4} sx={{ p: "4px" }}>
                <LineChart
                  title={biomarkersList[key]}
                  data={biomarkers}
                  periodicity={period}
                  id={key}
                  true="false"
                  biomarker_name={key}
                  titleContainerClass="overviewCardTitle"
                  graphClass="overviewCardContent"
                  titleClass="overviewGraphTitle"
                  group="true"
                  compareAgainstAverage={compareAgainstAverage}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
};

export default CompareGroupsResult;
