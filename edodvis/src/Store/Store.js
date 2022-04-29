import { applyMiddleware, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { allReducers, persistConfig } from "./Reducers/AllReducers";
import logger from "redux-logger";

const persistReducers = persistReducer(persistConfig, allReducers);

let store = createStore(
  persistReducers,
  applyMiddleware(logger)
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
let persistor = persistStore(store);

export { store, persistor };
