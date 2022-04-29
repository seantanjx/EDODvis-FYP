import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { AdapterDateFns as AdapterDateFnsExpand } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider as LocalizationProviderExpand } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import DatePicker from "@mui/lab/DatePicker";
import { calendarDay } from "../../Store/Actions/DateAction";

function BasicDatePickerStart(props) {
  const date = useSelector((state) => state.persistDate);
  const id = props.id;
  const dispatch = useDispatch();
  const [startDateDay, setStartDateDay] = useState(date[id].dayStartDate);

  return (
    <>
      {props.expand ? (
        <LocalizationProviderExpand dateAdapter={AdapterDateFnsExpand}>
          <MobileDatePicker
            orientation="landscape"
            label="Select Date"
            value={date[id].dayStartDate}
            onChange={(newValue) => {
              setStartDateDay(newValue);
              dispatch(calendarDay(id, newValue, date[id].dayEndDate));
            }}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
            inputFormat="yyyy-MM-dd"
          />
        </LocalizationProviderExpand>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Date"
            value={date[id].dayStartDate}
            onChange={(newValue) => {
              setStartDateDay(newValue);
              dispatch(calendarDay(id, newValue, date[id].dayEndDate));
            }}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
            inputFormat="yyyy-MM-dd"
          />
        </LocalizationProvider>
      )}
    </>
  );
}

export default BasicDatePickerStart;
