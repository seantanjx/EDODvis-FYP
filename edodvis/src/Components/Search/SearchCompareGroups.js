import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { GrSearch } from "react-icons/gr";
import "./SearchCompareGroups.css";
import Fab from "@mui/material/Fab";

function SearchCompareGroups(props) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Autocomplete
        options={props.options}
        popupIcon={false}
        onInputChange={props.onInputChange}
        value={props.value}
        isOptionEqualToValue={(option, value) => option?.label === value?.label}
        renderInput={(params) => (
          <TextField
            {...params}
            id={"group" + props.id}
            label={
              <Fragment>
                <GrSearch /> <span> &nbsp; {props.placeholder}</span>
              </Fragment>
            }
            variant="standard"
            className={props.className}
            size="small"
          />
        )}
      />

      <Fab
        size="small"
        aria-label="add"
        // id="searchButton"
        id={"group" + props.id}
        variant="contained"
        sx={{ bgcolor: "primary.dark", height: 20, ml: 2 }}
        onClick={() => {
          props.onClick(props.id);
        }}
      >
        +
      </Fab>
    </div>
  );
}

export default SearchCompareGroups;
