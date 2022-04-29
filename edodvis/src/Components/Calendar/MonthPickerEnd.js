import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { AdapterDateFns as AdapterDateFnsExpand } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider as LocalizationProviderExpand } from "@mui/x-date-pickers/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { calendarMonth } from "../../Store/Actions/DateAction";

const minDate = new Date("2020-01-01T00:00:00.000");
const maxDate = new Date("2034-01-01T00:00:00.000");

function MonthPickerEnd(props) {
  const date = useSelector((state) => state.persistDate);
  const id = props.id;
  const startDateDay = date[id].dayStartDate;
  const endDateDay = date[id].dayEndDate;
  const startDateWeek = date[id].weekStartDate;
  const endDateWeek = date[id].weekEndDate;
  const startDateMonth = date[id].monthStartDate;
  const period = date[id].period;
  const graph = date[id].graph;
  const startDate = date[id].startDate;
  const endDate = date[id].endDate;
  const [endDateMonth, setEndDateMonth] = useState(date[id].monthEndDate);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calendarMonth(id, startDateMonth, endDateMonth));
  }, [endDateMonth]);

  return (
    <>
      {props.expand ? (
        <LocalizationProviderExpand dateAdapter={AdapterDateFnsExpand}>
          <MobileDatePicker
            orientation="landscape"
            inputFormat="MMMM yyyy"
            views={["year", "month"]}
            label="Select Month"
            minDate={minDate}
            maxDate={maxDate}
            value={date[id].monthEndDate}
            onChange={(newValue) => {
              setEndDateMonth(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
          />
        </LocalizationProviderExpand>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            orientation="landscape"
            inputFormat="MMMM yyyy"
            views={["year", "month"]}
            label="Select Month"
            minDate={minDate}
            maxDate={maxDate}
            value={date[id].monthEndDate}
            onChange={(newValue) => {
              setEndDateMonth(newValue);
            }}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
          />
        </LocalizationProvider>
      )}
    </>
  );
}

export default MonthPickerEnd;
