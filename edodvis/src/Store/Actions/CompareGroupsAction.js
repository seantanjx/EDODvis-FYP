const add = (group_id, participant_id) => {
  return {
    type: "ADD",
    group_id: group_id,
    participant_id: participant_id,
  };
};

const remove = (group_id, participant_id) => {
  return {
    type: "REMOVE",
    group_id: group_id,
    participant_id: participant_id,
  };
};

const clear = (group_id) => {
  return {
    type: "CLEAR",
    group_id: group_id,
  };
};

const toggleChecked = (group_id) => {
  return {
    type: "TOGGLECHECKED",
    group_id: group_id,
  };
};

const updateName = (group_id, name) => {
  return {
    type: "UPDATENAME",
    group_id: group_id,
    name: name,
  };
};

const rehydrate = (payload) => {
  return {
    type: "REHYDRATE",
    payload: payload,
  };
};

export { add, remove, clear, toggleChecked, updateName, rehydrate };
