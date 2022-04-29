import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { AdapterDateFns as AdapterDateFnsExpand } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider as LocalizationProviderExpand } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { calendarMonth } from "../../Store/Actions/DateAction";

const minDate = new Date("2020-01-01T00:00:00.000");
const maxDate = new Date("2034-01-01T00:00:00.000");

export default function MonthPickerStart(props) {
  const date = useSelector((state) => state.persistDate);
  const id = props.id;
  const dispatch = useDispatch();
  const [startDateMonth, setStartDateMonth] = useState(date[id].monthStartDate);

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
            value={date[id].monthStartDate}
            onChange={(newValue) => {
              setStartDateMonth(newValue);
              dispatch(calendarMonth(id, newValue, date[id].monthEndDate));
            }}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
          />
        </LocalizationProviderExpand>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat="MMMM yyyy"
            views={["year", "month"]}
            label="Select Month"
            minDate={minDate}
            maxDate={maxDate}
            value={date[id].monthStartDate}
            onChange={(newValue) => {
              setStartDateMonth(newValue);
              dispatch(calendarMonth(id, newValue, date[id].monthEndDate));
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
