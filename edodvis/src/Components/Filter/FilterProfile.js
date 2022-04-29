import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { FaFilter } from "react-icons/fa";
import { Paper, Typography, TextField } from "@mui/material";
import Popper from "@mui/material/Popper";
import Autocomplete from "@mui/material/Autocomplete";

import "./Filter.css";

function FilterProfile(props) {
  const DistrictPopper = (props) => {
    return <Popper {...props} sx={{ width: "300px" }} placement="left" />;
  };

  const DistrictPaper = (props) => {
    return <Paper {...props} sx={{ width: "300px" }} placement="left" />;
  };

  return (
    <Paper className="filterProfileContainer" elevation={3}>
      <Container component="main">
        <Grid container alignItems="center">
          <Grid item xs={11.5}>
            <Typography id="filter" className="filterTitle">
              <FaFilter style={{ color: "#748AA1" }} /> FILTER
            </Typography>
          </Grid>
          <Grid item marginTop={3}>
            <Typography id="filterByDemographics" className="filterHeader">
              By Demographics
            </Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center" marginTop={1}>
          <Grid item xs>
            <Typography id="ageLabel" className="filterLabel">
              Age
            </Typography>
          </Grid>
          <Grid item xs>
            <FormControl>
              <TextField
                value={props.valueAge}
                onChange={props.onChange}
                id="age"
                style={{ width: "150px" }}
                label=" "
                name="age"
                InputLabelProps={{ shrink: false }}
                select
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="50-60">50 - 60 years</MenuItem>
                <MenuItem value="61-70">61 - 70 years</MenuItem>
                <MenuItem value="71-80">71 - 80 years</MenuItem>
                <MenuItem value="above 80">Above 80 years</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container alignItems="center" marginTop={2}>
          <Grid item xs>
            <Typography id="genderLabel" className="filterLabel">
              Gender
            </Typography>
          </Grid>
          <Grid item xs>
            <FormControl>
              <TextField
                value={props.valueGender}
                onChange={props.onChange}
                id="gender"
                style={{ width: "150px" }}
                label=" "
                name="gender"
                InputLabelProps={{ shrink: false }}
                select
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="M">Male</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
        <Grid marginTop={3}>
          <Typography id="filterByPostal District" className="filterHeader">
            By Postal District
          </Typography>
        </Grid>
        <Grid container alignItems="center" marginTop={1}>
          <Grid item xs>
            <Typography id="areaLabel" className="filterLabel">
              Area
            </Typography>
          </Grid>
          <Grid item xs>
            <Autocomplete
              key={props.reset}
              name="area"
              sx={{ width: "150px" }}
              options={props.areaOptions.map((option) => ({
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
              onChange={props.areaOnChange}
              PopperComponent={DistrictPopper}
              PaperComponent={DistrictPaper}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center" marginTop={6}>
          <Grid item xs>
            <Button
              variant="text"
              sx={{ mr: { md: 1, lg: 2 }, color: "primary.dark" }}
              onClick={props.onReset}
            >
              X &nbsp; RESET FILTER
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
              onClick={props.onApply}
            >
              APPLY
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}

export default FilterProfile;
