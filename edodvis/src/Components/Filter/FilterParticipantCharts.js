import { useContext } from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaFilter } from "react-icons/fa";
import { Paper, Typography, TextField } from "@mui/material";

import { CalendarContext } from "../../Contexts/CalendarContext";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";
import WeeklyDatePickerStart from "../Calendar/WeeklyDatePickerStart";
import WeeklyDatePickerEnd from "../Calendar/WeeklyDatePickerEnd";
import MonthPickerEnd from "../Calendar/MonthPickerEnd";
import MonthPickerStart from "../Calendar/MonthPickerStart";
import "./Filter.css";

function FilterParticipantCharts(props) {
  const { formData, setFormData } = useContext(CalendarContext);
  const id = props.id;

  let calendarStart;

  if (formData.period === "day") {
    calendarStart = <BasicDatePickerStart id={id} />;
  } else if (formData.period === "week") {
    calendarStart = <WeeklyDatePickerStart id={id} />;
  } else if (formData.period === "month") {
    calendarStart = <MonthPickerStart id={id} />;
  }

  let calendarEnd;

  if (formData.period === "day") {
    calendarEnd = <BasicDatePickerEnd id={id} />;
  } else if (formData.period === "week") {
    calendarEnd = <WeeklyDatePickerEnd id={id} />;
  } else if (formData.period === "month") {
    calendarEnd = <MonthPickerEnd id={id} />;
  }

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <Paper className="filterExpandedChartContainer" elevation={3}>
      <Container component="main">
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography>Graph</Typography>
          </Grid>

          <Grid item xs>
            <FormControl>
              <TextField
                value={props.graphValue}
                onChange={props.changeGraph}
                id="graph"
                name="graph"
                style={{ width: "180px" }}
                label=" "
                InputLabelProps={{ shrink: false }}
                select
              >
                <MenuItem value="line graph">Line Graph</MenuItem>
                <MenuItem value="barchart">Barchart</MenuItem>
                <MenuItem value="boxplot">Boxplot</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={11.5} marginTop={3}>
            <Typography id="filter" className="filterTitle">
              <FaFilter style={{ color: "#748AA1" }} /> FILTER
            </Typography>
          </Grid>
        </Grid>

        <Grid marginTop={3}>
          <Typography id="filterByDemographics" className="filterHeader">
            By Date
          </Typography>
        </Grid>

        <Grid container alignItems="center" marginTop={1}>
          <Grid item xs>
            <Typography>Periodicity</Typography>
          </Grid>

          <Grid item xs>
            <FormControl>
              <TextField
                value={formData[id].period}
                onChange={handleChange}
                variant="outlined"
                inputProps={{
                  name: "period",
                  id: "period",
                }}
                style={{ width: "140px" }}
                label=" "
                InputLabelProps={{ shrink: false }}
                select
              >
                y<MenuItem value="day">Daily</MenuItem>
                <MenuItem value="week">Weekly</MenuItem>
                <MenuItem value="month">Monthly</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container alignItems="center" marginTop={1}>
          <Grid item xs>
            <Typography id="start" className="filterLabel">
              Start
            </Typography>
          </Grid>

          <Grid item xs>
            <div id="startCalendar">{calendarStart}</div>
          </Grid>
        </Grid>

        <Grid container alignItems="center" marginTop={1}>
          <Grid item xs>
            <Typography id="end" className="filterLabel">
              End
            </Typography>
          </Grid>

          <Grid item xs>
            <div id="endCalendar">{calendarEnd}</div>
          </Grid>
        </Grid>

        <Grid container alignItems="center" marginTop={6}>
          <Grid item xs>
            <Button
              onClick={props.onReset}
              variant="text"
              sx={{ mr: { md: 1, lg: 3 }, color: "primary.dark" }}
            >
              X &nbsp; RESET FILTER
            </Button>
          </Grid>

          <Grid item>
            <Button
              onClick={props.onApply}
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
            >
              APPLY
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

export default FilterParticipantCharts;
