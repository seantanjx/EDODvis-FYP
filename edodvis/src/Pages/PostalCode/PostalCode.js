import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import _ from "lodash";
import AlertTable from "../../Components/Table/AlertTable";
import Search from "../../Components/Search/Search";
import "./PostalCode.css";
import { getAlertDataByArea, getAllParticipant } from "../../API/apis";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";

const PostalCode = () => {
  const { state } = useLocation();

  console.log(state);
  const crumbs = [
    { pageLink: "/sensoroverview", pageName: "Sensor Overview" },
    { pageLink: "/postalcode", pageName: "Postal Code Search Results" },
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

  const [participant, setParticipant] = useState({
    pid: "",
    daysDown: "",
    type: "",
    isAlert: false,
    toInclude: true,
    noMotion: false,
    remarks: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [remarks, setRemarks] = useState();

  useEffect(() => {
    fetchAlertData(state[0].area);
  }, []);

  const fetchAlertData = async (area) => {
    try {
      const response = await getAlertDataByArea(area);
      const data = JSON.parse(response.data);
      const processedData = _.map(data, (details) => {
        const processed = getData(details[1]);
        return {
          pid: details[0],
          daysDown:
            processed.daysDown === 0
              ? "NIL"
              : processed.daysDown.toString() + " days",
          type:
            processed.sensorType.size === 0
              ? "NIL"
              : [...processed.sensorType].sort().join(", "),
          isAlert: processed.isAlert,
          toInclude: true,
          noMotion: processed.noMotion,
        };
      });
      setParticipant(processedData);
      setParticipant((prevData) =>
        prevData.sort((a, b) => (a.isAlert > b.isAlert ? -1 : 1))
      ); // sort Alert first
      setRemarks(data);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
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
      if (processed.daysDown > 0) {
        processed.isAlert = true;
      }
    }
    return processed;
  }

  // Handle Search
  const [searchData, setSearchData] = useState(state[0].postalCode);
  const [resultText, setResultText] = useState(searchData);
  const [pageReset, setPageReset] = useState(false);
  const [allPostalCode, setAllPostalCode] = useState({
    postalCode: "",
    area: "",
  });
  let searchOptions = [
    ...new Set(_.map(allPostalCode, (details) => details.postalCode)),
  ];
  searchOptions = searchOptions.sort();

  useEffect(() => {
    fetchAllParticipant();
  }, []);

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

  function handleSearchClick() {
    // onClick on search button
    if (searchData !== "") {
      setIsLoading(true); // reset isLoading
      const searchArea = allPostalCode.filter(
        (item) => item.postalCode === searchData
      );
      console.log(searchArea[0].area);
      fetchAlertData(searchArea[0].area);
      setResultText(searchData);
      setPageReset(!pageReset);
    }
  }

  return (
    <div>
      <div
        name="pageBreadcrumb"
        style={{
          background: "#E6ECF2",
          position: "-webkit-sticky",
          position: "sticky",
          top: 0,
          paddingTop: "5px",
          zIndex: 2,
        }}
      >
        <div style={{ display: "inline-flex", width: "100%" }}>
          <PageBreadcrumb crumbs={crumbs} />
        </div>
        {isDesktop ? (
          <div className="resultDesktop">
            <Typography className="searchResult">
              Search result(s) for '{resultText}'
            </Typography>
            <Search
              placeholder="Search by Postal Code"
              className={"searchDesktop"}
              onInputChange={(event, newPostal) => setSearchData(newPostal)}
              value={searchData}
              options={searchOptions}
              onClick={handleSearchClick}
            />
          </div>
        ) : (
          <div className="resultMobile">
            <Search
              placeholder="Search by Postal Code"
              className={"searchMobile"}
              onInputChange={(event, newPostal) => setSearchData(newPostal)}
              value={searchData}
              options={searchOptions}
              onClick={handleSearchClick}
            />
            <Typography className="searchResult">
              Search result(s) for '{resultText}'
            </Typography>
          </div>
        )}
      </div>

      <div id="searchTable">
        <AlertTable
          rowsPerPage={7}
          data={participant}
          isLoading={isLoading}
          resetPage={pageReset}
          remarks={remarks}
          minHeight="670px"
        />
      </div>
      <Typography className="searchResult">
        * Rows in pink are houses that require attention
      </Typography>
    </div>
  );
};

export default PostalCode;
