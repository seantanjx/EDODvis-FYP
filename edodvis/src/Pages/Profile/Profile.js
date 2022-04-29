import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FaFilter } from "react-icons/fa";
import Grid from "@mui/material/Grid";
import { Link } from "@mui/material";
import _ from "lodash";
import FilterProfile from "../../Components/Filter/FilterProfile";
import Table from "../../Components/Table/Table";
import Search from "../../Components/Search/Search";
import FilterProfileMobile from "../../Components/Filter/FilterProfileMobile";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import UploadParticipantsButton from "../../Components/UploadParticipantsButton/UploadParticipantsButton";
import { getAllParticipant } from "../../API/apis";
import { getRole } from "../../API/apis";
import WindowDimension from "../../utils/WindowDimension";
import "./Profile.css";
import { postalDistrictList } from "../../utils/PostalDistrict";

const Profile = () => {
  const crumbs = [{ pageLink: "/profile", pageName: "Individual Profile" }];
  const isDesktop = WindowDimension();

  // Handling filter popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const ref = createRef();

  // Add data into table
  const [isLoading, setIsLoading] = useState(true);
  const role = getRole();
  const [allParticipant, setAllParticipant] = useState();
  const [participant, setParticipant] = useState();

  function returnData(details) {
    return {
      id: details.participant_id,
      age: details.age,
      gender: details.gender,
      area: details.postal_district,
    };
  }

  useEffect(() => {
    getAllParticipant()
      .then((res) => {
        setAllParticipant(res.data); // for options
        setParticipant(_.map(res.data, (details) => returnData(details))); // for data in table
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Handle Search
  const optionId = _.map(allParticipant, (option) => {
    return option.participant_id.toString();
  });
  const [searchData, setSearchData] = useState("");

  function handleSearchClick() {
    if (searchData !== "") {
      const filterData = allParticipant.filter(
        (item) => item.participant_id === parseInt(searchData)
      );
      setParticipant(_.map(filterData, (details) => returnData(details)));
      setIsLoading(false);
    }

    setDataFilter(() => {
      return { age: "", gender: "", area: "" };
    });
  }

  function handleSearchBar(event, newId) {
    setSearchData(newId);

    if (newId === "") {
      setParticipant(_.map(allParticipant, (details) => returnData(details)));
      setIsLoading(false);
    }

    setDataFilter(() => {
      return { age: "", gender: "", area: "" };
    });
  }

  // Handle Filter
  let areaOptions = [
    ...new Set(_.map(allParticipant, (details) => details.postal_district)),
  ];
  areaOptions = [
    areaOptions.map((item) => [postalDistrictList[item], item]),
  ][0].sort();
  const [dataFilter, setDataFilter] = useState({
    age: "",
    gender: "",
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

  // Handle Apply Button (onClick)
  function handleApply() {
    let filterAge = null;
    let ageData = _.map(allParticipant, (details) => returnData(details));
    let genderData = _.map(allParticipant, (details) => returnData(details));
    let areaData = _.map(allParticipant, (details) => returnData(details));

    if (dataFilter.age !== "") {
      if (dataFilter.age === "above 80") {
        filterAge = allParticipant.filter((item) => parseInt(item.age) > 80);
      } else {
        const ageArray = dataFilter.age.split("-");
        filterAge = allParticipant.filter(
          (item) =>
            parseInt(ageArray[0]) <= parseInt(item.age) &&
            parseInt(item.age) <= parseInt(ageArray[1])
        );
      }
      ageData = _.map(filterAge, (details) => returnData(details));
    }

    if (dataFilter.gender !== "") {
      const filterGender = allParticipant.filter(
        (item) => item.gender === dataFilter.gender
      );
      genderData = _.map(filterGender, (details) => returnData(details));
    }

    if (dataFilter.area !== "") {
      const filterArea = allParticipant.filter(
        (item) => item.postal_district === dataFilter.area
      );
      areaData = _.map(filterArea, (details) => returnData(details));
    }

    let filterData = ageData.filter((ad) =>
      genderData.some((gd) => ad.id === gd.id)
    );
    filterData = filterData.filter((fd) =>
      areaData.some((ad) => fd.id === ad.id)
    );

    setParticipant(filterData);
    setResetPage(true);
    setIsLoading(false);

    if (
      !isDesktop &&
      (dataFilter.age !== "" ||
        dataFilter.gender !== "" ||
        dataFilter.area !== "")
    ) {
      setOpen(false);
    }
  }

  // Handle Reset
  const [reset, setReset] = useState(false);
  function handleReset() {
    setDataFilter(() => {
      return { age: "", gender: "", area: "" };
    });
    setSearchData("");

    setParticipant(_.map(allParticipant, (details) => returnData(details)));
    setResetPage(true);
    setIsLoading(false);
    setReset(!reset);

    if (
      !isDesktop &&
      (dataFilter.age !== "" ||
        dataFilter.gender !== "" ||
        dataFilter.area !== "")
    ) {
      setOpen(false);
    }
  }

  // Handle Link (onClick)
  const navigate = useNavigate();
  function handleLink(event) {
    navigate(`/participant_charts/${event.target.name}`, {
      state: {
        participant_id: event.target.name,
      },
    });
  }

  // Handle Upload

  return (
    <div>
      {!isDesktop ? (
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

              <div className="searchBar">
                <Search
                  placeholder="Search by Participant ID"
                  className={"searchMobile"}
                  onInputChange={handleSearchBar}
                  value={searchData}
                  options={optionId}
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
                  <FilterProfileMobile
                    onClickClose={handleClose}
                    onChange={handleChange}
                    valueAge={dataFilter.age}
                    valueGender={dataFilter.gender}
                    areaOptions={areaOptions}
                    areaOnChange={areaHandleChange}
                    reset={reset}
                    onApply={handleApply}
                    onReset={handleReset}
                    ref={ref}
                  />
                </Modal>
              </Container>
            </Grid>
          </div>
          <Container>
            <Table
              isLoading={isLoading}
              rows={participant}
              columns={[
                { field: "id", headerName: "Participant ID", flex: 1 },
                { field: "age", headerName: "Age", flex: 1 },
                { field: "gender", headerName: "Gender", flex: 1 },
                {
                  field: "Route",
                  headerName: "",
                  flex: 1,
                  renderCell: (cellValues) => {
                    return (
                      <Link
                        onClick={handleLink}
                        name={cellValues.id}
                        className="link"
                      >
                        View Chart
                      </Link>
                    );
                  },
                },
              ]}
              filename="Profile Data"
              fields={["id", "age", "gender"]}
              resetPage={resetPage}
            />
          </Container>
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
            <div style={{ display: "inline-flex", width: "100%" }}>
              <PageBreadcrumb crumbs={crumbs} />
            </div>
            <div className="searchPidSid">
              <Search
                placeholder="Search by Participant ID"
                className={"searchDesktop"}
                onInputChange={handleSearchBar}
                value={searchData}
                options={optionId}
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
                rows={participant}
                columns={[
                  { field: "id", headerName: "Participant ID", flex: 1 },
                  { field: "age", headerName: "Age", flex: 1 },
                  { field: "gender", headerName: "Gender", flex: 1 },
                  {
                    field: "Route",
                    headerName: "",
                    flex: 1,
                    renderCell: (cellValues) => {
                      return (
                        <Link
                          onClick={handleLink}
                          name={cellValues.id}
                          className="link"
                        >
                          View Chart
                        </Link>
                      );
                    },
                  },
                ]}
                filename="Profile Data"
                fields={["id", "age", "gender"]}
                resetPage={resetPage}
              />
            </Grid>
            <Grid item id="filter" xs="auto" sx={{ mr: "32px" }}>
              <FilterProfile
                onChange={handleChange}
                valueAge={dataFilter.age}
                valueGender={dataFilter.gender}
                onApply={handleApply}
                onReset={handleReset}
                areaOptions={areaOptions}
                areaOnChange={areaHandleChange}
                reset={reset}
              />
            </Grid>
          </Grid>
        </>
      )}
      {role === "SU" ? (
        <div style={{ marginLeft: "32px", marginTop: "16px" }}>
          <UploadParticipantsButton />
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
