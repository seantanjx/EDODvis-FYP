import React, { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link, Typography } from "@mui/material";
import _ from "lodash";
import { CardHeader } from "@mui/material";
import Card from "@mui/material/Card";

import "./AnomalyTable.css";

const AnomalyTable = (props) => {
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
  var test_months = {
    Jan: 31,
    Feb: 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
    Aug: 31,
    Sep: 30,
    Oct: 31,
    Nov: 30,
    Dec: 31,
  };

  function convertMonthYear(date) {
    var startDay = new Date(date).getDate();
    var endDay = startDay + 6;
    var month = months[new Date(date).getMonth()];
    if (endDay > test_months[month]) {
      endDay = endDay - test_months[month];
      month = months[new Date(date).getMonth() + 1];
    }
    var year = new Date(date).getFullYear();
    let formattedDate;
    if (props.periodicity === "month") {
      formattedDate = `${month} ${year}`;
    } else if (props.periodicity === "week") {
      formattedDate = [`Week of ${startDay}-${endDay} ${month}`, ` ${year}`];
    } else if (props.periodicity === "day") {
      formattedDate = `${startDay} ${month}`;
    }

    return formattedDate;
  }

  const navigate = useNavigate();
  function handleViewDetails(event) {
    navigate(`/anomaly/${props.biomarker}`, {
      state: {
        participant_id: event.target.id,
        biomarker: props.biomarker,
        date: event.target.name,
        data: props.dataset,
        colour: props.colour,
        overview: props.overview,
        comparegroup: props.comparegroup,
      },
    });
  }

  function createData(monthYear, outlier) {
    var history = [];
    if (outlier) {
      _.map(Object.entries(outlier), ([id, value]) => {
        history.push({
          id: id,
          value: value,
        });
      });
    }

    return {
      monthYear,
      history,
    };
  }

  const anomalyArray = [];
  if (props.anomaly) {
    _.map(Object.entries(props.anomaly), ([date, idValue]) => {
      if (idValue !== null && Object.keys(idValue.outlier).length > 0) {
        anomalyArray.push(createData(date, idValue.outlier));
      }
    });
  }

  function Row(rowProps) {
    const { row } = rowProps;
    const [open, setOpen] = useState(false);

    return (
      <Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell component="th" scope="row" id="anomalyRow">
            <Typography sx={{ fontWeight: "bold" }}>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
              &nbsp;{convertMonthYear(row.monthYear)}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                {props.participantId === false ? (
                  <Table size="small" aria-label="valueTable">
                    <TableBody>
                      {row.history.map((historyRow) => {
                        return _.map(
                          Object.entries(historyRow.value),
                          ([key, values]) => {
                            return (
                              <TableRow
                                key={`${historyRow.id}${row.monthYear}_${key}`}
                              >
                                <TableCell>{values}</TableCell>
                                <TableCell>
                                  <Link
                                    onClick={handleViewDetails}
                                    id={historyRow.id}
                                    name={row.monthYear}
                                  >
                                    Details
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <Table size="small" aria-label="participantValueTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>Participant ID</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.history.map((historyRow) => (
                        <TableRow key={historyRow.monthYear}>
                          <TableCell>{historyRow.id}</TableCell>
                          <TableCell>{historyRow.value}</TableCell>
                          <TableCell>
                            <Link
                              onClick={handleViewDetails}
                              id={historyRow.id}
                              name={row.monthYear}
                            >
                              Details
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }

  return (
    <Card id="anomalyTable">
      <CardHeader
        title={props.group ? props.name + " ANOMALY" : "ANOMALY"}
        id="anomalyHeader"
      ></CardHeader>
      <TableContainer sx={{ overflow: "hidden" }}>
        <Table aria-label="collapsible table">
          <TableBody>
            {anomalyArray.map((row) => (
              <Row key={row.monthYear} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default AnomalyTable;
