const initialState = {
  0: {
    name: "Group 1",
    isChecked: false,
    data: [],
    color: "#B5D5E2",
  },
  1: {
    name: "Group 2",
    isChecked: false,
    data: [],
    color: "#E6D3CB",
  },
  2: {
    name: "Group 3",
    isChecked: false,
    data: [],
    color: "#E3CADC",
  },
};

const compareGroupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      state[action.group_id]["data"] = [
        ...state[action.group_id]["data"],
        action.participant_id,
      ];
      return { ...state };

    case "REMOVE":
      state[action.group_id]["data"] = state[action.group_id]["data"].filter(
        (participant) => participant !== action.participant_id
      );
      return { ...state };

    case "CLEAR":
      state[action.group_id]["data"] = [];
      return { ...state };

    case "TOGGLECHECKED":
      state[action.group_id]["isChecked"] =
        !state[action.group_id]["isChecked"];
      return { ...state };

    case "UPDATENAME":
      state[action.group_id]["name"] = action.name;
      return { ...state };

    case "REHYDRATE":
      state = action.payload;
      return { ...state };

    default:
      return state;
  }
};

export default compareGroupsReducer;
