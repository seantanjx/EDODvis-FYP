const compareAgainstAverageReducer = (state = true, action) => {
  switch (action.type) {
    case "CHECK":
      return true;
    case "UNCHECK":
      return false;
    default:
      return state;
  }
};

export default compareAgainstAverageReducer;
