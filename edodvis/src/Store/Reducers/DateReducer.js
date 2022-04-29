const initialState = {
  overview: {
    startDate: localStorage.getItem("startDate") || null,
    endDate: localStorage.getItem("endDate") || null,
    period: localStorage.getItem("period") || "month",
    graph: localStorage.getItem("graph") || "line graph",
    reset: localStorage.getItem("reset") || false,
    dayStartDate: localStorage.getItem("dayStartDate") || null,
    dayEndDate: localStorage.getItem("dayEndDate") || null,
    weekStartDate: localStorage.getItem("weekStartDate") || null,
    weekEndDate: localStorage.getItem("weekEndDate") || null,
    monthStartDate: localStorage.getItem("monthStartDate") || null,
    monthEndDate: localStorage.getItem("monthEndDate") || null,
  },
  individual: {
    startDate: null,
    endDate: null,
    period: "month",
    graph: "line graph",
    reset: false,
    dayStartDate: null,
    dayEndDate: null,
    weekStartDate: null,
    weekEndDate: null,
    monthStartDate: null,
    monthEndDate: null,
  },
  groups: {
    startDate: null,
    endDate: null,
    period: "month",
    graph: "line graph",
    reset: false,
    dayStartDate: null,
    dayEndDate: null,
    weekStartDate: null,
    weekEndDate: null,
    monthStartDate: null,
    monthEndDate: null,
  },
  sensors: {
    startDate: null,
    endDate: null,
    period: "month",
    graph: "line graph",
    reset: false,
    dayStartDate: null,
    dayEndDate: null,
    weekStartDate: null,
    weekEndDate: null,
    monthStartDate: null,
    monthEndDate: null,
  },
};

const dateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET":
      state[action.id]["startDate"] = action.startDate;
      state[action.id]["endDate"] = action.endDate;
      state[action.id]["period"] = action.period;
      state[action.id]["graph"] = action.graph;
      state[action.id]["reset"] = false;
      state[action.id]["dayStartDate"] = action.dayStartDate;
      state[action.id]["dayEndDate"] = action.dayEndDate;
      state[action.id]["weekStartDate"] = action.weekStartDate;
      state[action.id]["weekEndDate"] = action.weekEndDate;
      return { ...state };

    case "RESET":
      state[action.id]["startDate"] = null;
      state[action.id]["endDate"] = null;
      state[action.id]["period"] = "month";
      state[action.id]["graph"] = "line graph";
      state[action.id]["reset"] = true;
      state[action.id]["dayStartDate"] = null;
      state[action.id]["dayEndDate"] = null;
      state[action.id]["weekStartDate"] = null;
      state[action.id]["weekEndDate"] = null;
      state[action.id]["monthStartDate"] = null;
      state[action.id]["monthEndDate"] = null;

      return { ...state };

    case "CALENDARMONTH":
      state[action.id]["monthStartDate"] = action.monthStartDate;
      state[action.id]["monthEndDate"] = action.monthEndDate;
      return { ...state };

    case "CALENDARWEEK":
      state[action.id]["weekStartDate"] = action.weekStartDate;
      state[action.id]["weekEndDate"] = action.weekEndDate;
      return { ...state };

    case "CALENDARDAY":
      state[action.id]["dayStartDate"] = action.dayStartDate;
      state[action.id]["dayEndDate"] = action.dayEndDate;
      return { ...state };

    case "RESETFALSE":
      state[action.id]["reset"] = false;
      return { ...state };

    case "PERSIST":
      state = action.payload;
      return { ...state };
    default:
      return state;
  }
};

export default dateReducer;
