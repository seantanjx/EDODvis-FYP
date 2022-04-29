import { useContext } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaFilter } from "react-icons/fa";
import { Paper, TextField, Typography } from "@mui/material";

import { CalendarContext } from "../../Contexts/CalendarContext";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";
import WeeklyDatePickerStart from "../../Components/Calendar/WeeklyDatePickerStart";
import WeeklyDatePickerEnd from "../../Components/Calendar/WeeklyDatePickerEnd";
import MonthPickerEnd from "../../Components/Calendar/MonthPickerEnd";
import MonthPickerStart from "../Calendar/MonthPickerStart";
import "./Filter.css";

function FilterExpandedChart(props) {
  const { formData, setFormData } = useContext(CalendarContext);
  const id = props.id;

  let calendarStart;

  if (formData[id].period === "day") {
    calendarStart = <BasicDatePickerStart id={id} expand />;
  } else if (formData[id].period === "week") {
    calendarStart = <WeeklyDatePickerStart id={id} expand />;
  } else if (formData[id].period === "month") {
    calendarStart = <MonthPickerStart id={id} expand />;
  }

  let calendarEnd;

  if (formData[id].period === "day") {
    calendarEnd = <BasicDatePickerEnd id={id} expand />;
  } else if (formData[id].period === "week") {
    calendarEnd = <WeeklyDatePickerEnd id={id} expand />;
  } else if (formData[id].period === "month") {
    calendarEnd = <MonthPickerEnd id={id} expand />;
  }

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [id]: {
          [event.target.name]: event.target.value,
        },
      };
    });
  }

  return (
    <Paper className="filterExpandedChartContainer" elevation={3}>
      <Typography id="filter" className="filterTitle">
        <FaFilter style={{ color: "#748AA1" }} /> FILTER
      </Typography>

      <Box className="filter">
        <Typography className="filterLabel">Graph</Typography>
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
      </Box>

      <Typography className="filterHeader" sx={{ mt: "20px" }}>
        By Date
      </Typography>

      <Box className="filter">
        <Typography className="filterLabel">Periodicity</Typography>
        <FormControl>
          <TextField
            value={formData[id].period}
            onChange={handleChange}
            id="period"
            name="period"
            style={{ width: "150px" }}
            label=" "
            InputLabelProps={{ shrink: false }}
            select
          >
            <MenuItem value="day">Daily</MenuItem>
            <MenuItem value="week">Weekly</MenuItem>
            <MenuItem value="month">Monthly</MenuItem>
          </TextField>
        </FormControl>
      </Box>

      <Box className="filter">
        <Typography id="start" className="filterLabel">
          Start
        </Typography>
        <div id="startCalendar">{calendarStart}</div>
      </Box>

      <Box className="filter">
        <Typography id="end" className="filterLabel">
          End
        </Typography>
        <div id="endCalendar">{calendarEnd}</div>
      </Box>

      <Box className="resetApply">
        <Button
          onClick={props.onReset}
          variant="text"
          sx={{ mr: { md: 1, lg: 3 }, color: "primary.dark" }}
        >
          X &nbsp; RESET FILTER
        </Button>
        <Button
          onClick={props.onApply}
          variant="contained"
          sx={{ bgcolor: "primary.dark" }}
        >
          APPLY
        </Button>
      </Box>
    </Paper>
  );
}

export default FilterExpandedChart;
