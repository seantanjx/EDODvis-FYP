import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompareGroupCards from "../../Components/CompareGroupCards/CompareGroupCards";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { CssBaseline } from "@mui/material";
import {
  add,
  remove,
  clear,
  toggleChecked,
  updateName,
} from "../../Store/Actions/CompareGroupsAction";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";
import PageBreadcrumb from "../../Components/PageBreadcrumb/PageBreadcrumb";
import {
  check,
  uncheck,
} from "../../Store/Actions/CompareAgainstAverageAction";

const CompareGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const compareParticipants = useSelector((state) => state.compareGroups);
  const colors = ["#B5D5E2", "#E6D3CB", "#E3CADC"];
  const crumbs = [{ pageLink: "/comparegroups", pageName: "Compare Groups" }];

  function registerParticipants(group, value) {
    if (value) {
      dispatch(add(group, value.label));
    }
  }

  function removeSingleParticipant(group, participant_id) {
    dispatch(remove(group, participant_id));
  }

  function clearGroupParticipants(group) {
    dispatch(clear(group));
  }

  function registerChecked(group) {
    dispatch(toggleChecked(group));
  }

  function registerNameChange(group, name) {
    if (name) {
      dispatch(updateName(group, name));
    }
  }

  function isValidSelection() {
    var count = 0;
    _.map(compareParticipants, (value, index) => {
      if (value["isChecked"] && value["data"].length === 0) {
        registerChecked(index);
      } else if (value["isChecked"] && value["data"].length > 0) {
        count++;
      }
    });
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }

  function compareGroups() {
    if (isValidSelection()) {
      navigate("results");
    } else {
      alert("Please check at least one group for comparison!");
    }
  }

  function handleChecked(event) {
    if (event.target.checked) {
      dispatch(check());
    } else {
      dispatch(uncheck());
    }
  }

  useEffect(() => {
    dispatch(check());
  });

  return (
    <>
      <CssBaseline />
      <div
        name="breadcrumb"
        style={{
          background: "#E6ECF2",
          position: "-webkit-sticky",
          position: "sticky",
          top: 0,
          paddingTop: "5px",
          paddingBottom: "5px",
          zIndex: 2,
        }}
      >
        <PageBreadcrumb crumbs={crumbs} />
      </div>
      <Grid
        container
        spacing={2}
        p={2}
        alignItems="center stretch"
        justifyContent="space-between"
      >
        {_.map(colors, (value, key) => {
          var group_no = parseInt(key);
          console.log(group_no);
          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              alignItems="center stretch"
              key={group_no}
            >
              <CompareGroupCards
                group={group_no}
                registerParticipants={registerParticipants}
                registerChecked={registerChecked}
                removeSingleParticipant={removeSingleParticipant}
                clearGroupParticipants={clearGroupParticipants}
                registerNameChange={registerNameChange}
                data={compareParticipants[group_no]}
                cardTitle={compareParticipants[group_no]["name"]}
                color={value}
                sx={{ alignItems: "stretch" }}
              />
            </Grid>
          );
        })}
      </Grid>
      <Grid container spacing={2} justifyContent="flex-end" p={2}>
        <FormControlLabel
          control={<Checkbox onChange={handleChecked} defaultChecked />}
          label="Compare Against All Participants"
          sx={{ color: "#748AA1" }}
        />
        <Button
          variant="contained"
          onClick={() => {
            compareGroups();
          }}
          sx={{
            bgcolor: "#748AA1",
            marginTop: "10px",
          }}
        >
          Compare
        </Button>
      </Grid>
    </>
  );
};

export default CompareGroups;
