import { useContext } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { TextField, Typography } from "@mui/material";
import { CalendarContext } from "../../Contexts/CalendarContext";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";
import WeeklyDatePickerStart from "../../Components/Calendar/WeeklyDatePickerStart";
import WeeklyDatePickerEnd from "../../Components/Calendar/WeeklyDatePickerEnd";
import MonthPickerEnd from "../../Components/Calendar/MonthPickerEnd";
import MonthPickerStart from "../../Components/Calendar/MonthPickerStart";
import "./Filter.css";

function FilterBm(props) {
  const { formData, setFormData } = useContext(CalendarContext);
  const id = props.id;

  // Calendar selection
  let calendarStart;

  if (formData[id].period === "day") {
    calendarStart = <BasicDatePickerStart id={id} />;
  } else if (formData[id].period === "week") {
    calendarStart = <WeeklyDatePickerStart id={id} />;
  } else if (formData[id].period === "month") {
    calendarStart = <MonthPickerStart id={id} />;
  }

  let calendarEnd;

  if (formData[id].period === "day") {
    calendarEnd = <BasicDatePickerEnd id={id} />;
  } else if (formData[id].period === "week") {
    calendarEnd = <WeeklyDatePickerEnd id={id} />;
  } else if (formData[id].period === "month") {
    calendarEnd = <MonthPickerEnd id={id} />;
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
    <Container component="main" display="inline-flex">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={1}
        mt={1}
      >
        <Grid item component="div" marginRight={1}>
          <Box className="filterOverview">
            <Typography id="period" className="filterLabel">
              Periodicity
            </Typography>
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
          </Box>
        </Grid>

        <Grid item component="div" marginRight={1}>
          <Box className="filterOverview">
            <Typography id="start" className="filterLabel">
              Start
            </Typography>
            <div id="startCalendar">{calendarStart}</div>
          </Box>
        </Grid>

        <Grid item component="div">
          <Box className="filterOverview">
            <Typography id="end" className="filterLabel">
              End
            </Typography>
            <div id="endCalendar">{calendarEnd}</div>
          </Box>
        </Grid>

        <Grid item>
          <Button
            onClick={props.toggleReset}
            variant="text"
            sx={{ mr: 1, color: "primary.dark" }}
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default FilterBm;
