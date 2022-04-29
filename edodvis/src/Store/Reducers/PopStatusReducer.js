const popStatusReducer = (state = false, action) => {
  switch (action.type) {
    case "POPED":
      return !state;
    default:
      return state;
  }
};

export default popStatusReducer;
