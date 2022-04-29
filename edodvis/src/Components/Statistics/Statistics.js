import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Paper, Typography, Box } from "@mui/material";
import _ from "lodash";
import { Link } from "@mui/material";

import "./Statistics.css";
import { statisticsList } from "../../utils/Biomarker";

function Statistics(props) {
  const navigate = useNavigate();
  function handleViewDetails(event) {
    navigate(`/participant_charts/${props.participant}`, {
      state: {
        participant_id: props.participant,
      },
    });
  }

  return (
    <Paper className="statsContainer" elevation={3}>
      <Typography id="filter" className="filterTitle">
        STATISTICS
      </Typography>

      <Typography className="filterHeader" data-testid="statsMonth">
        {props.date}
      </Typography>

      <Grid container gap={1} sx={{ mt: "20px" }}>
        {_.map(Object.entries(props.average), ([biomarker, array]) => {
          return (
            <Grid container key={biomarker} className="averageSubContainer">
              <Grid item xs={10} sx={{ color: "#748AA1" }}>
                {statisticsList[biomarker]}
              </Grid>
              <Grid item xs={2} sx={{ color: "#31394D", pl: 1 }}>
                {array.value[0] === null ? 0 : array.value}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Link onClick={handleViewDetails}>View Participant Charts</Link>
      </Box>
    </Paper>
  );
}

export default Statistics;
