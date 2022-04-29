import { forwardRef } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import Box from "@mui/material/Box";
import { Typography, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import "./Filter.css";

const FilterSAreaMobile = forwardRef((props, ref) => {
  return (
    <Box className="filterSAreaMobileContainer">
      <Box className="filterTitleContainer">
        <Typography id="filterM" className="filterTitle">
          <FaFilter style={{ color: "#748AA1" }} /> FILTER
        </Typography>
        <Button className="closeButton" onClick={props.onClickClose} ref={ref}>
          <AiOutlineClose style={{ color: "#748AA1" }} />
        </Button>
      </Box>

      <Box className="filter">
        <Typography id="areaLabel" className="filterLabel">
          Area
        </Typography>
        <FormControl>
          <Autocomplete
            key={props.reset}
            sx={{ width: "200px" }}
            options={props.options.map((option) => ({
              label: option[0],
              value: option[1],
              key: `district${option[1]}`,
            }))}
            renderInput={(params) => (
              <TextField
                {...params}
                label=" "
                InputLabelProps={{ shrink: false }}
                id="areaSelect"
                name="areaSelect"
              />
            )}
            onChange={props.onChange}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
          />
        </FormControl>
      </Box>

      <Box className="resetApply">
        <Button
          onClick={props.onReset}
          variant="text"
          sx={{ mr: { md: 1, lg: 3 }, color: "primary.dark" }}
        >
          X &nbsp; RESET FILTER
        </Button>

        <Button
          onClick={props.onApply}
          variant="contained"
          sx={{ bgcolor: "primary.dark" }}
        >
          APPLY
        </Button>
      </Box>
    </Box>
  );
});

export default FilterSAreaMobile;
