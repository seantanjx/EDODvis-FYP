import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store/Store";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import LoadingAnimation from "./Components/LoadingAnimation/LoadingAnimation";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingAnimation />} persistor={persistor}>
      <React.StrictMode>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
