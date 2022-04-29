import React from "react";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography, TextField, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Popper from "@mui/material/Popper";

import "./Filter.css";

function Filter(props) {
  const DistrictPopper = (props) => {
    return (
      <Popper {...props} sx={{ width: "300px" }} placement="bottom-start" />
    );
  };

  const DistrictPaper = (props) => {
    return (
      <Paper {...props} sx={{ width: "300px" }} placement="bottom-start" />
    );
  };

  return (
    <Container component="main" className="filterSAreaContainer">
      <Grid container direction="row" alignItems="center" gap={2}>
        <Box display="flex" alignItems="center" marginRight={1}>
          <Typography id="areaLabel" className="filterLabel">
            Area
          </Typography>
          <Autocomplete
            key={props.reset}
            sx={{ width: "150px" }}
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
            PopperComponent={DistrictPopper}
            PaperComponent={DistrictPaper}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
          />
        </Box>

        <Box>
          <Button
            variant="text"
            sx={{ mr: { md: 1, lg: 2 }, color: "primary.dark" }}
            onClick={props.onReset}
          >
            X &nbsp; RESET FILTER
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "primary.dark" }}
            onClick={props.onApply}
          >
            APPLY
          </Button>
        </Box>
      </Grid>
    </Container>
  );
}

export default Filter;
