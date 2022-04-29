import { useSelector } from "react-redux";
import moment from "moment";

function CalendarDate(
  startDateDay,
  endDateDay,
  startDateMonth,
  endDateMonth,
  startDateWeek,
  endDateWeek,
  data,
  id
) {
  const date = useSelector((state) => state.persistDate);
  let startDate;
  if (data.period === "day" && startDateDay !== null) {
    let value = moment(new Date(startDateDay)).format("YYYY-MM-DD");
    startDate = value;
  } else if (data.period === "week" && startDateWeek !== null) {
    let value = new Date(startDateWeek);
    value.setDate(value.getDate() - value.getDay() + 1);
    value = moment(value).format("YYYY-MM-DD");
    startDate = value;
  } else if (data.period === "month" && startDateMonth !== null) {
    let value = new Date(startDateMonth);
    value.setDate(1);
    value = moment(value).format("YYYY-MM-DD");
    startDate = value;
  } else if (data.period === "month" && startDateMonth === null) {
    let value = new Date(); //latest data "2022-01-13"
    startDate = new Date(value.getFullYear(), value.getMonth() - 5, 1);
    startDate = moment(startDate).format("YYYY-MM-DD");
  } else if (date[id].startDate !== null) {
    startDate = date[id].startDate;
  }

  let endDate;
  if (data.period === "day" && endDateDay !== null) {
    let value = moment(new Date(endDateDay)).format("YYYY-MM-DD");
    endDate = value;
  } else if (data.period === "week" && endDateWeek !== null) {
    let value = new Date(endDateWeek);
    value.setDate(value.getDate() + 7 - value.getDay());
    value = moment(value).format("YYYY-MM-DD");
    endDate = value;
  } else if (data.period === "month" && endDateMonth !== null) {
    let value = new Date(endDateMonth);
    value = new Date(value.getFullYear(), value.getMonth() + 1, 0);
    value = moment(value).format("YYYY-MM-DD");
    endDate = value;
  } else if (data.period === "month" && startDateMonth === null) {
    let value = new Date(); //latest data
    endDate = new Date(value.getFullYear(), value.getMonth() + 1, 0);
    endDate = moment(endDate).format("YYYY-MM-DD");
  } else if (date[id].endDate !== null) {
    endDate = date[id].endDate;
  }

  return { startDate: startDate, endDate: endDate };
}

export default CalendarDate;
