import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import "chartjs-adapter-date-fns";
import { IoMdOpen } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import Container from "@mui/material/Container";
import _ from "lodash";
import "./LineChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function LineChart(props) {
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
  var date = props.labels;

  const navigate = useNavigate();

  let expand = props.true ? (
    <IoMdOpen color="#B6B6B6" onClick={expandGraph} />
  ) : (
    ""
  );
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

  var test_list = [];
  if (props.group) {
    let dict = {};
    for (const group of Object.keys(props.data)) {
      date = getData(props.data[group][biomarker_name][0]).date;
      if (group === "All") {
        dict = {
          label: group,
          data: getData(props.data[group][biomarker_name][0]).value,
        };
      } else {
        dict = {
          label: group,
          data: getData(props.data[group][biomarker_name][0]).value,
          borderColor: colours[group],
          backgroundColor: colours[group],
        };
      }
      test_list.push(dict);
    }
  }

  let test = props.group
    ? test_list
    : [
        {
          label: props.participant_id
            ? `Participant ${props.participant_id}`
            : "All Participants",
          data: props.data,
          borderColor: props.colour,
          backgroundColor: props.colour,
        },
      ];

  function expandGraph() {
    navigate("/biomarkersoverview/");
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

  function getData(data) {
    let date = [];
    let value = [];
    _.map(Object.keys(data), (key) => {
      date.push(key);
      value.push(data[key]);
    });
    return { date: date, value: value };
  }

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
      },
      maintainAspectRatio: false,
    },
  };

  return (
    <Card className="chart-card">
      <Container className={props.titleContainerClass}>
        {back}
        <Typography className={props.titleClass}>{props.title}</Typography>
        {props.group ? (
          <Link
            to={{
              pathname: `/comparegroups/results/${props.id}`,
            }}
            state={{
              biomarker: props.id,
              data: props.data,
              title: props.title,
              compareAgainstAverage: props.compareAgainstAverage,
            }}
          >
            {expand}
          </Link>
        ) : props.participant_id ? (
          <Link
            to={{
              pathname: `/participant_charts_expand/${props.participant_id}`,
            }}
            state={{
              biomarker: props.id,
              data: props.data,
              colour: props.colour,
              dataset: props.individual_data,
              participant_id: props.participant_id,
            }}
          >
            {expand}
          </Link>
        ) : (
          <Link
            to={{
              pathname: `/biomarkersoverview/${props.id}`,
            }}
            state={{
              biomarker: props.id,
              data: props.data,
              colour: props.colour,
              dataset: props.biomarker,
            }}
          >
            {expand}
          </Link>
        )}
      </Container>
      <CardContent className={props.graphClass}>
        <Line
          options={options}
          width={530}
          height={300}
          data={{
            labels: date,
            datasets: test,
          }}
        />
      </CardContent>
    </Card>
  );
}

export default LineChart;
