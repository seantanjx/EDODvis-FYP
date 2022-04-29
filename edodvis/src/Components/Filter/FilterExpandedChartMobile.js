import { useContext, forwardRef } from "react";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaFilter } from "react-icons/fa";
import { Paper, TextField, Typography } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

import { CalendarContext } from "../../Contexts/CalendarContext";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";
import WeeklyDatePickerStart from "../Calendar/WeeklyDatePickerStart";
import WeeklyDatePickerEnd from "../Calendar/WeeklyDatePickerEnd";
import MonthPickerEnd from "../Calendar/MonthPickerEnd";
import MonthPickerStart from "../Calendar/MonthPickerStart";
import "./Filter.css";

const FilterExpandedChart = forwardRef((props, ref) => {
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
    <Paper className="filterExpandedChartMobileContainer" elevation={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography id="filter" className="filterTitle">
          <FaFilter style={{ color: "#748AA1" }} /> FILTER
        </Typography>

        <Button className="closeButton" onClick={props.onClickClose} ref={ref}>
          <AiOutlineClose style={{ color: "#748AA1" }} />
        </Button>
      </Box>

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
            value={formData.period}
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
});

export default FilterExpandedChart;
