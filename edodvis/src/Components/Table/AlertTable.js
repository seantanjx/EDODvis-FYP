import { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";

import Paper from "@mui/material/Paper";
import { Link } from "@mui/material";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdSensors } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { RiPencilFill } from "react-icons/ri";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";

import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import AllRemarkModal from "../Remark/AllRemarkModal";
import "./AlertTable.css";

const AlertTable = (props) => {
  // Conditional Render
  const [isDesktop, setDesktop] = useState(window.innerWidth > 992);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 992);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  // pagination
  const [page, setPage] = useState(0);
  const rowsPerPage = props.rowsPerPage;
  const maxPage = Math.ceil(props.data.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  useEffect(() => {
    // reset to 1st page when search is clicked
    setPage(0);
  }, [props.resetPage]);

  // Handle remark modal
  const [pid, setPid] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = (event) => {
    setOpen(true);
    setPid(event.target.id);
  };
  const handleClose = () => setOpen(false);
  const ref = createRef();

  // Handle view details
  const navigate = useNavigate();
  function handleViewDetails(event) {
    navigate("/participanthouse", {
      state: event.target.id,
    });
  }

  return (
    <Paper id="alertTable" sx={props.sx}>
      {props.isLoading ? (
        <>
          <LoadingAnimation />
        </>
      ) : (
        <>
          <Container
            className="alertTableContainer"
            style={{ minHeight: props.minHeight }}
          >
            {(rowsPerPage > 0
              ? Object.keys(props.data).slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : Object.keys(props.data)
            ).map((key) => (
              <Container
                key={props.data[key].pid}
                className={props.data[key].isAlert ? "rowRed" : "rowWhite"}
              >
                <Grid
                  container
                  display="flex"
                  direction={isDesktop ? "row" : "column"}
                >
                  <Grid item xs={12} md={6}>
                    {props.data[key].noMotion ? (
                      <Paper
                        className={
                          isDesktop ? "pidNoMotionDesktop" : "pidNoMotionMobile"
                        }
                      >
                        Participant ID: {props.data[key].pid} (No Motion
                        Detected)
                      </Paper>
                    ) : (
                      <Paper className={isDesktop ? "pidDesktop" : "pidMobile"}>
                        Participant ID: {props.data[key].pid}
                      </Paper>
                    )}
                    <Paper className={isDesktop ? "typeDesktop" : "typeMobile"}>
                      <MdSensors style={{ fontSize: "15px" }} /> &nbsp;{" "}
                      {props.data[key].type}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper
                      className={
                        isDesktop ? "daysDownDesktop" : "daysDownMobile"
                      }
                    >
                      <AiOutlineClockCircle style={{ fontSize: "15px" }} />
                      &nbsp; Days Down: {props.data[key].daysDown}
                    </Paper>
                    <Paper
                      className={isDesktop ? "remarkDesktop" : "remarkMobile"}
                    >
                      <RiPencilFill style={{ color: "#748AA1" }} /> &nbsp;
                      Remark(s): &nbsp;
                      <Button
                        variant="text"
                        onClick={handleOpen}
                        className="viewLink"
                        id={props.data[key].pid}
                      >
                        View Remark
                      </Button>
                      <Modal open={open} id="allRemarkModal" pid={pid}>
                        <AllRemarkModal
                          onClickClose={handleClose}
                          remarks={props.remarks.filter(
                            (item) => item[0] === parseInt(pid)
                          )}
                          pid={pid}
                          ref={ref}
                        />
                      </Modal>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    {isDesktop ? (
                      <Paper className="emptyCellTop">&nbsp;</Paper>
                    ) : null}
                    <Paper
                      className={
                        isDesktop ? "viewDetailsDesktop" : "viewDetailsMobile"
                      }
                    >
                      <Link
                        onClick={handleViewDetails}
                        id={props.data[key].pid}
                      >
                        View Details
                      </Link>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            ))}
          </Container>
          <Container id="postalCodePagination">
            <Pagination
              page={page + 1}
              count={maxPage}
              variant="outlined"
              shape="rounded"
              color="standard"
              onChange={handleChangePage}
            />
          </Container>
        </>
      )}
    </Paper>
  );
};

export default AlertTable;
