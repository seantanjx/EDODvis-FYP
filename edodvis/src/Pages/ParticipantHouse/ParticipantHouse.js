import { useState, useEffect, createRef } from "react";
import { useLocation } from "react-router-dom";

import moment from "moment";
import _ from "lodash";
import { Container, Grid } from "@mui/material";
import clsx from "clsx";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import DialogContent from "@mui/material/DialogContent";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { getDeviceByParticipantId, updateLastServiced } from "../../API/apis";
import RemarkModal from "../../Components/Remark/RemarkModal";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import "./ParticipantHouse.css";
import SaveChanges from "../../Components/SaveChanges/SaveChanges";
import IdCards from "../../Components/IdCards/IdCards";
import ChangesModal from "../../Components/ChangesModal/ChangesModal";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";

const ParticipantHouse = (props) => {
  const crumbs = [
    { pageLink: "/sensoroverview", pageName: "Sensor Overview" },
    { pageLink: "/participanthouse", pageName: "Participant House" },
  ];
  const { state } = useLocation();
  const [device, setDevice] = useState(state);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDevice();
  }, []);

  const fetchDevice = async () => {
    try {
      const response = await getDeviceByParticipantId(state);
      setDevice(
        _.map(Object.entries(JSON.parse(response.data)), ([keys, details]) => {
          return {
            id: keys,
            pid: details.participant,
            name: details.device_name,
            type: details.type,
            location: details.location.replace("_", " "),
            lastServiced:
              moment(details.last_serviced).format("YYYY-MM-DD") === null
                ? "-"
                : moment(details.last_serviced).format("YYYY-MM-DD"),
            battery:
              details.battery_level === null
                ? "unknown"
                : details.battery_level,
            remarks: details.remarks,
            status:
              details.status === "offline"
                ? `off (${details.days_down} days)`
                : "on",
          };
        })
      );
      setIsLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  // Handle Remark modal
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState();
  const [sensor, setSensor] = useState({ id: "", name: "" });

  const ref = createRef();

  const handleOpen = (event) => {
    setOpen(true);
    setSensor({ id: event.target.id, name: event.target.name });
    setRemarks(
      device.filter((item) => item.id.toString() === event.target.id)[0].remarks
    );
  };

  // Handle Update Last Serviced Date
  const [updateDate, setUpdateDate] = useState(false);
  const [rowSelected, setRowSelected] = useState([]);
  const [openSaveChanges, setOpenSaveChanges] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const handleClick = (event) => {
    if (event.target.id === "discardYes") {
      try {
        updateLastServiced(rowSelected);
      } catch (e) {
        console.log(e);
      }
      setOpenSaveChanges(true);
      setUpdateDate(false);

      let items = [...device];
      _.map(
        items.filter((row) => rowSelected.includes(row.id)),
        (details) =>
          (details.lastServiced = moment(new Date()).format("YYYY-MM-DD"))
      );
      setDevice(items);
      setRowSelected([]);
    }
    setUpdateModal(false);
  };

  // Pagination
  function PaginationRounded() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Grid container className="dataGridFooter">
        <Grid item className="pagination" xs={12} md={10}>
          <Pagination
            variant="outlined"
            shape="rounded"
            color="standard"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
            sx={{
              position: "absolute",
              left: "0px",
              paddingLeft: 2,
              paddingBottom: 1,
            }}
          />
        </Grid>

        {updateDate ? (
          <Grid item id="rowSelectedCount" xs={12} md={2}>
            {rowSelected.length} rows selected
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    );
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
        }}
      >
        <PageBreadcrumb crumbs={crumbs} />
      </div>
      <Container>
        <IdCards
          GroupName={[`Participant: ${state}`]}
          GroupNameColour={["#B5D5E2"]}
        />
        <Paper sx={{ height: 480, width: "100%" }} elevation={3}>
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <DataGrid
              hideFooterSelectedRowCount
              onSelectionModelChange={(id) => setRowSelected(id)}
              checkboxSelection={updateDate ? true : false}
              pageSize={10}
              density="compact"
              pagination
              components={{
                Pagination: PaginationRounded,
              }}
              disableColumnFilter
              rows={device}
              columns={[
                {
                  field: "name",
                  headerName: "Sensor ID",
                  minWidth: 150,
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
                  field: "remarks",
                  headerName: "Remarks",
                  minWidth: 150,
                  flex: 1,
                  renderCell: (cellValues) => {
                    return (
                      <div>
                        <Button
                          variant="text"
                          onClick={handleOpen}
                          className="viewLink"
                          id={cellValues.row.id}
                          name={cellValues.row.name}
                        >
                          View Remark
                        </Button>
                        <Modal
                          open={open}
                          id="remarkModal"
                          backgroundColor="transparent"
                        >
                          <DialogContent backgroundColor="transparent">
                            <RemarkModal
                              onClickClose={() => setOpen(false)}
                              remarks={remarks}
                              sid={sensor.id}
                              sName={sensor.name}
                              ref={ref}
                              setDevice={setDevice}
                              device={device}
                            />
                          </DialogContent>
                        </Modal>
                      </div>
                    );
                  },
                },
              ]}
              sx={{
                "& .battery.low": { color: "#ED5B5B" },
                "& .battery.medium": { color: "#FBA018" },
                "& .battery.high": { color: "#1F9E8A" },
              }}
            />
          )}
        </Paper>
      </Container>
      <Container id="updateContainer">
        {updateDate ? (
          <>
            <Button
              onClick={() => setUpdateDate(false)}
              variant="text"
              sx={{ mr: "20px", mt: "16px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setUpdateModal(true)}
              variant="contained"
              sx={{ bgcolor: "primary.dark", mt: "16px" }}
            >
              Update
            </Button>
            <Modal open={updateModal}>
              <ChangesModal text="Confirm Update?" onClick={handleClick} />
            </Modal>
          </>
        ) : (
          <Button
            onClick={() => setUpdateDate(true)}
            variant="contained"
            sx={{ bgcolor: "primary.dark", mt: "16px" }}
          >
            Update Last Serviced
          </Button>
        )}
      </Container>
      <SaveChanges
        open={openSaveChanges}
        message="Changes saved"
        handleClose={() => setOpenSaveChanges(false)}
      />
    </div>
  );
};

export default ParticipantHouse;
