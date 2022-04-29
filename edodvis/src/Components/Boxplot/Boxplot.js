import { useSelector } from "react-redux";

import { Chart as ChartJS, registerables } from "chart.js";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "chartjs-adapter-date-fns";
import React from "react";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import { Chart } from "react-chartjs-2";
import { BiArrowBack } from "react-icons/bi";
import Container from "@mui/material/Container";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import "./Boxplot.css";
import _ from "lodash";

// register controller in chart.js and ensure the defaults are set
ChartJS.register(...registerables, BoxPlotController, BoxAndWiskers);

export default function Boxplot(props) {
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
  const compareParticipants = useSelector((state) => state.compareGroups);
  var darkerColor = {
    "#B5D5E2": "#1A8BAE",
    "#E6D3CB": "#E7854F",
    "#E3CADC": "#BF4377",
  };
  var biomarker_name = props.biomarker_name;
  var date = props.data.date;
  const navigate = useNavigate();

  let back = props.true ? (
    ""
  ) : (
    <BiArrowBack onClick={returnGraph} className="backButton" />
  );

  let colours = {};
  _.map(Object.keys(compareParticipants), (key) => {
    colours[compareParticipants[key]["name"]] =
      darkerColor[compareParticipants[key]["color"]];
  });

  let overall_data = [];
  if (props.individual) {
    Object.entries(props.data.value).forEach(([key, value]) => {
      overall_data.push(value[0]);
    });
  } else overall_data = props.data.value;

  var outlier = props.data.outlier;
  var outlier_list = [
    {
      type: "boxplot",
      label: props.participant_id
        ? `Participant ${props.participant_id}`
        : "All Participants",
      outlierColor: "#FF0000",
      data: overall_data,
      backgroundColor: props.colour,
      borderColor: props.colour,
    },
  ];

  var individual_list;
  if (outlier) {
    let boxplot_data;
    Object.entries(outlier).forEach(([key, value]) => {
      if (props.individual) {
        individual_list = [];
        Object.entries(value).forEach(([index, arr]) => {
          let y_value = arr["y"];
          var i;
          for (i = 0; i < y_value.length; i++) {
            let element = y_value[i];
            individual_list.push({ x: arr["x"], y: element });
          }
        });
        boxplot_data = individual_list;
      } else boxplot_data = value;
      let dict = {
        type: "scatter",
        label: key,
        outlierColor: "#FF0000",
        data: boxplot_data,
        backgroundColor: "rgba(255, 206, 86, 0.8)",
        borderColor: "rgba(255, 26, 104, 1)",
      };
      outlier_list.push(dict);
    });
  }

  var test_list = [];
  if (props.group) {
    let dict = {};
    for (const group of Object.keys(props.data)) {
      date = props.data[group][biomarker_name].date;
      if (group === "All") {
        dict = {
          type: "boxplot",
          label: group,
          data: props.data[group][biomarker_name].value,
        };
      } else {
        dict = {
          type: "boxplot",
          label: group,
          data: props.data[group][biomarker_name].value,
          borderColor: colours[group],
          backgroundColor: colours[group],
        };
      }
      test_list.push(dict);
    }
  }

  function returnGraph() {
    navigate(props.navigate, {
      state: {
        participant_id: props.participant_id,
        group: props.group,
        data: props.data,
      },
    });
  }

  var data = {
    labels: date,
    datasets: props.group ? test_list : outlier_list,
  };

  const options = {
    scales: {
      xAxes: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
          callback: function (value) {
            var startDay = new Date(date[value]).getDate();
            var endDay = startDay + 6;
            var month = months[new Date(date[value]).getMonth()];
            if (endDay > test_months[month]) {
              endDay = endDay - test_months[month];
              month = months[new Date(date[value]).getMonth() + 1];
            }
            var year = new Date(date[value]).getFullYear();
            if (props.periodicity === "month") {
              return `${month} ${year}`;
            } else if (props.periodicity === "week") {
              return [`${startDay}-${endDay} ${month}`, `${year}`];
            } else if (props.periodicity === "day") {
              return `${startDay} ${month}`;
            }
          },
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        display: true,
        labels: {
          filter: function (legendItem) {
            if (props.participant_id) {
              return legendItem.text !== props.participant_id;
            } else return legendItem.text === "All Participants";
          },
        },
      },
      maintainAspectRatio: false,
    },
  };

  return (
    <Card className="chart-card">
      <Container className={props.titleContainerClass}>
        {back}
        <Typography className={props.titleClass}>{props.title}</Typography>
        <Link
          to={{
            pathname: `/biomarkersoverview/${props.id}`,
          }}
        ></Link>
      </Container>
      <CardContent className={props.graphClass}>
        <Chart
          type="boxplot"
          options={options}
          width={530}
          height={300}
          data={data}
        />
      </CardContent>
    </Card>
  );
}
