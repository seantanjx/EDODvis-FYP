import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { AdapterDateFns as AdapterDateFnsExpand } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider as LocalizationProviderExpand } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import PickersDay from "@mui/lab/PickersDay";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
import DatePicker from "@mui/lab/DatePicker";
import { calendarWeek } from "../../Store/Actions/DateAction";

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: "50%",
    borderBottomLeftRadius: "50%",
  }),
  ...(isLastDay && {
    borderTopRightRadius: "50%",
    borderBottomRightRadius: "50%",
  }),
}));

function WeeklyDatePickerStart(props) {
  const date = useSelector((state) => state.persistDate);
  const id = props.id;
  const dispatch = useDispatch();
  const [startDateWeek, setStartDateWeek] = useState(date[id].weekStartDate);

  let value = new Date(startDateWeek);
  value.setDate(value.getDate() - value.getDay() + 1);

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!startDateWeek) {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <PickersDay {...pickersDayProps} />
        </LocalizationProvider>
      );
    }

    const start = startOfWeek(startDateWeek);
    const end = endOfWeek(startDateWeek);
    new Date(start.setDate(start.getDate() + 1));
    new Date(end.setDate(end.getDate() + 1));

    const dayIsBetween = isWithinInterval(date, { start, end });
    const isFirstDay = isSameDay(date, start);
    const isLastDay = isSameDay(date, end);

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomPickersDay
          {...pickersDayProps}
          disableMargin
          dayIsBetween={dayIsBetween}
          isFirstDay={isFirstDay}
          isLastDay={isLastDay}
        />
      </LocalizationProvider>
    );
  };

  return (
    <>
      {props.expand ? (
        <LocalizationProviderExpand dateAdapter={AdapterDateFnsExpand}>
          <MobileDatePicker
            orientation="landscape"
            label="Select Week"
            value={date[id].weekStartDate}
            onChange={(newValue) => {
              setStartDateWeek(newValue);
              dispatch(calendarWeek(id, newValue, date[id].weekEndDate));
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
            inputFormat="'Week of' MMM d"
          />
        </LocalizationProviderExpand>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Week"
            value={date[id].weekStartDate}
            onChange={(newValue) => {
              setStartDateWeek(newValue);
              dispatch(calendarWeek(id, newValue, date[id].weekEndDate));
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => (
              <TextField {...params} style={{ width: "180px" }} />
            )}
            inputFormat="'Week of' MMM d"
          />
        </LocalizationProvider>
      )}
    </>
  );
}

export default WeeklyDatePickerStart;
