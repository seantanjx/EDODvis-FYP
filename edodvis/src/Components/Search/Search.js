import { Fragment } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import { GrSearch } from "react-icons/gr";
import "./Search.css";

function Search(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: "1px",
        paddingBottom: "8px",
      }}
    >
      <Autocomplete
        id="search"
        options={props.options}
        popupIcon={false}
        onInputChange={props.onInputChange}
        value={props.value}
        isOptionEqualToValue={(option, value) => option?.label === value?.label}
        renderInput={(params) => (
          <TextField
            {...params}
            id="searchBar"
            label={
              <Fragment>
                <GrSearch /> <span> &nbsp; {props.placeholder}</span>
              </Fragment>
            }
            variant="outlined"
            className={props.className}
            sx={{ mr: 2 }}
            size="small"
          />
        )}
      />

      <Button
        id="searchButton"
        variant="contained"
        sx={{ bgcolor: "primary.dark", height: 40, mr: "32px" }}
        onClick={props.onClick}
      >
        SEARCH
      </Button>
    </div>
  );
}

export default Search;
