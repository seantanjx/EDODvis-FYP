import { forwardRef } from "react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { AiOutlineClose } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Autocomplete from "@mui/material/Autocomplete";
import { Paper, Typography, TextField } from "@mui/material";
import "./Filter.css";
import BasicDatePickerStart from "../Calendar/BasicDatePickerStart";
import BasicDatePickerEnd from "../Calendar/BasicDatePickerEnd";

const FilterSMobile = forwardRef((props, ref) => {
  const styles = {
    input: {
      low: "#ED5B5B",
      medium: "#FBA018",
      high: "#1F9E8A",
    },
  };

  const batterySelected = props.value.battery;
  const id = props.id;

  const DistrictPopper = (props) => {
    return <Popper {...props} sx={{ width: "300px" }} placement="left" />;
  };

  const DistrictPaper = (props) => {
    return <Paper {...props} sx={{ width: "300px" }} placement="left" />;
  };

  return (
    <Box className="filterSMobileContainer">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography id="filter" className="filterTitle">
          <FaFilter style={{ color: "#748AA1" }} /> FILTER
        </Typography>

        <Button className="closeButton" onClick={props.onClickClose} ref={ref}>
          <AiOutlineClose style={{ color: "#748AA1" }} />
        </Button>
      </Box>

      <Box className="filter">
        <Typography id="TypeLabel" className="filterLabel">
          Type
        </Typography>
        <FormControl>
          <TextField
            value={props.value.type}
            onChange={props.onChange}
            id="typeM"
            name="type"
            style={{ width: "180px" }}
            label=" "
            InputLabelProps={{ shrink: false }}
            select
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="beacon">Beacon</MenuItem>
            <MenuItem value="bed">Bed</MenuItem>
            <MenuItem value="door">Door</MenuItem>
            <MenuItem value="gateway">Gateway</MenuItem>
            <MenuItem value="miband">MiBand</MenuItem>
            <MenuItem value="motion">Motion</MenuItem>
          </TextField>
        </FormControl>
      </Box>

      <Box className="filter">
        <Typography id="statusLabel" className="filterLabel">
          Status
        </Typography>
        <FormControl>
          <TextField
            value={props.value.status}
            onChange={props.onChange}
            id="statusM"
            name="status"
            style={{ width: "180px" }}
            label=" "
            InputLabelProps={{ shrink: false }}
            select
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="on">on</MenuItem>
            <MenuItem value="off">off</MenuItem>
          </TextField>
        </FormControl>
      </Box>

      <Typography className="filterHeader" sx={{ mt: "10px" }}>
        By Postal District
      </Typography>
      <Box className="filter">
        <Typography id="areaLabel" className="filterLabel">
          Area
        </Typography>
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
          isOptionEqualToValue={(option, value) => option.value === value.value}
        />
      </Box>

      <Typography className="filterHeader" sx={{ mt: "10px" }}>
        By Last Serviced Date
      </Typography>

      <Box className="filter">
        <Typography id="startM" className="filterLabel">
          Start
        </Typography>
        <div id="startCalendarM">
          <BasicDatePickerStart id={id} />
        </div>
      </Box>

      <Box className="filter">
        <Typography id="endM" className="filterLabel">
          End
        </Typography>
        <div id="endCalendarM">
          <BasicDatePickerEnd id={id} />
        </div>
      </Box>

      <Typography
        className="filterHeader"
        sx={{ mt: "10px" }}
      >{`For Medication, Motion & Bed sensors only`}</Typography>

      <Box className="filter">
        <Typography id="batteryLabel" className="filterLabel">
          Battery
        </Typography>
        <FormControl>
          <TextField
            value={props.value.battery}
            onChange={props.onChange}
            name="battery"
            id="batteryM"
            style={{ width: "180px" }}
            label=" "
            sx={{
              ...(batterySelected === "low" && {
                "& .MuiInputBase-input": { color: styles.input.low },
              }),
              ...(batterySelected === "medium" && {
                "& .MuiInputBase-input": { color: styles.input.medium },
              }),
              ...(batterySelected === "high" && {
                "& .MuiInputBase-input": { color: styles.input.high },
              }),
            }}
            InputLabelProps={{ shrink: false }}
            select
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem style={{ color: styles.input.low }} value="low">
              low
            </MenuItem>
            <MenuItem style={{ color: styles.input.medium }} value="medium">
              medium
            </MenuItem>
            <MenuItem style={{ color: styles.input.high }} value="high">
              high
            </MenuItem>
          </TextField>
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

export default FilterSMobile;
