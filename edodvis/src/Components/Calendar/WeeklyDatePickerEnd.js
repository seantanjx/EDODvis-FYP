import React, { useState, useEffect } from "react";
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

function WeeklyDatePickerEnd(props) {
  const date = useSelector((state) => state.persistDate);
  const id = props.id;
  const dispatch = useDispatch();
  const startDateWeek = date[id].weekStartDate;
  const [endDateWeek, setEndDateWeek] = useState(date[id].weekEndDate);

  useEffect(() => {
    dispatch(calendarWeek(id, startDateWeek, endDateWeek));
  }, [endDateWeek]);

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!endDateWeek) {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <PickersDay {...pickersDayProps} />
        </LocalizationProvider>
      );
    }

    const start = startOfWeek(endDateWeek);
    const end = endOfWeek(endDateWeek);
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
            value={date[id].weekEndDate}
            onChange={(newValue) => {
              setEndDateWeek(newValue);
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
            value={date[id].weekEndDate}
            onChange={(newValue) => {
              setEndDateWeek(newValue);
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

export default WeeklyDatePickerEnd;
