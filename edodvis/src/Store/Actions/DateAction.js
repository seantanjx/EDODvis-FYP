const set = (
  id,
  startDate,
  endDate,
  period,
  graph,
  startDateDay,
  endDateDay,
  startDateWeek,
  endDateWeek,
  startDateMonth,
  endDateMonth
) => {
  return {
    type: "SET",
    id: id,
    startDate: startDate,
    endDate: endDate,
    period: period,
    graph: graph,
    dayStartDate: startDateDay,
    dayEndDate: endDateDay,
    weekStartDate: startDateWeek,
    weekEndDate: endDateWeek,
    monthStartDate: startDateMonth,
    monthEndDate: endDateMonth,
  };
};

const calendarDay = (id, dayStartDate, dayEndDate) => {
  return {
    type: "CALENDARDAY",
    id: id,
    dayStartDate: dayStartDate,
    dayEndDate: dayEndDate,
  };
};

const calendarWeek = (id, weekStartDate, weekEndDate) => {
  return {
    type: "CALENDARWEEK",
    id: id,
    weekStartDate: weekStartDate,
    weekEndDate: weekEndDate,
  };
};

const calendarMonth = (id, monthStartDate, monthEndDate) => {
  return {
    type: "CALENDARMONTH",
    id: id,
    monthStartDate: monthStartDate,
    monthEndDate: monthEndDate,
  };
};

const reset = (id) => {
  return {
    type: "RESET",
    id: id,
  };
};

const resetFalse = (id) => {
  return {
    type: "RESETFALSE",
    id: id,
  };
};

const persist = (payload) => {
  return {
    type: "PERSIST",
    payload: payload,
  };
};

export {
  persist,
  set,
  reset,
  calendarDay,
  calendarWeek,
  calendarMonth,
  resetFalse,
};
