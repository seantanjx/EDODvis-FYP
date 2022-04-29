import { useContext, forwardRef } from "react";

import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import Box from "@mui/material/Box";

import { Typography, TextField } from "@mui/material";
import { CalendarContext } from "../../Contexts/CalendarContext";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";
import WeeklyDatePickerStart from "../../Components/Calendar/WeeklyDatePickerStart";
import WeeklyDatePickerEnd from "../../Components/Calendar/WeeklyDatePickerEnd";
import MonthPickerEnd from "../../Components/Calendar/MonthPickerEnd";
import MonthPickerStart from "../../Components/Calendar/MonthPickerStart";
import "./Filter.css";

const FilterBmMobile = forwardRef((props, ref) => {
  const { formData, setFormData } = useContext(CalendarContext);
  const id = props.id;

  // Calendar selection
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
    <Box className="filterBmMobileContainer">
      <Box className="filterTitleContainer">
        <Typography id="filter" className="filterTitle">
          <FaFilter style={{ color: "#748AA1" }} /> FILTER
        </Typography>
        <Button className="closeButton" onClick={props.onClickClose} ref={ref}>
          <AiOutlineClose style={{ color: "#748AA1" }} />
        </Button>
      </Box>
      <Box className="filter">
        <Typography id="period" className="filterLabel">
          Periodicity
        </Typography>
        <FormControl>
          <TextField
            value={formData.period}
            onChange={handleChange}
            inputProps={{
              name: "period",
              id: "period",
            }}
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
          onClick={props.toggleReset}
          variant="text"
          sx={{ mr: { md: 1, lg: 3 }, color: "primary.dark" }}
        >
          X &nbsp; RESET FILTER
        </Button>
        <Button
          onClick={props.toggleFilter}
          variant="contained"
          sx={{ bgcolor: "primary.dark" }}
        >
          APPLY
        </Button>
      </Box>
    </Box>
  );
});

export default FilterBmMobile;
