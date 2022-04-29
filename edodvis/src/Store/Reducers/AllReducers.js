import compareAgainstAverageReducer from "./CompareAgainstAverageReducer";
import compareGroupsReducer from "./CompareGroupsReducer";
import dateReducer from "./DateReducer";
import popStatusReducer from "./PopStatusReducer";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

const allReducers = combineReducers({
  compareAgainstAverage: compareAgainstAverageReducer,
  compareGroups: compareGroupsReducer,
  persistDate: dateReducer,
  popStatus: popStatusReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

export { allReducers, persistConfig };
