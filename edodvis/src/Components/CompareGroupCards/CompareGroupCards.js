import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// card APIs
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/Clear";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import GroupNameModal from "./GroupNameModal";

// search APIs
import { useState, useEffect } from "react";
import { getAllParticipant } from "../../API/apis";
import _ from "lodash";

const CompareGroupCards = ({
  group,
  registerParticipants,
  registerChecked,
  removeSingleParticipant,
  clearGroupParticipants,
  registerNameChange,
  data,
  color,
  cardTitle,
}) => {
  const [allParticipant, setAllParticipant] = useState();
  const [ListEmpty, setListEmpty] = useState(false);

  var selected_participant_list = data["data"];
  var isChecked = data["isChecked"];

  const fetchParticipants = async () => {
    try {
      const response = await getAllParticipant();
      setAllParticipant(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const choiceOptions = _.reduce(
    allParticipant,
    (participant_list, participant) => {
      var participant_id = participant.participant_id.toString();
      if (!selected_participant_list.includes(participant_id)) {
        participant_list.push(participant_id);
      }
      return participant_list;
    },
    []
  );

  const handleChecked = (event) => {
    if (selected_participant_list.length === 0) {
      setListEmpty(true);
    } else {
      registerChecked(group);
    }
  };

  useEffect(() => {
    fetchParticipants();
    if (selected_participant_list.length === 0) {
      setListEmpty(true);
    } else {
      setListEmpty(false);
    }
  }, [selected_participant_list.length]);

  return (
    <Card
      sx={{
        width: 1,
        height: 1,
        minHeight: 500,
        alignItems: "center stretch",
        justifyContent: "center",
        backgroundColor: color,
        paddingTop: "10px",
      }}
    >
      <CardContent>
        <Grid container spacing={0} sx={{ pt: 0 }}>
          <Grid
            item
            display="inline-flex"
            sx={{
              alignItems: "center",
              wordWrap: "break-word",
              overflow: "hidden",
            }}
            xs={11}
          >
            <Typography
              variant="h4"
              sx={{ wordWrap: "break-word", overflow: "hidden" }}
            >
              {" "}
              {cardTitle}{" "}
            </Typography>
            <GroupNameModal
              group={group}
              cardTitle={cardTitle}
              updateName={registerNameChange}
            />
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked}
                  onChange={handleChecked}
                  disabled={ListEmpty}
                />
              }
              label=""
              value={selected_participant_list}
            />
          </Grid>
        </Grid>
        <div>
          <Autocomplete
            sx={{ width: "200px", mt: 2 }}
            options={choiceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            renderInput={(params) => (
              <TextField {...params} label="Select participants" />
            )}
            onChange={(event, value) => [
              registerParticipants(group, value),
              setListEmpty(false),
            ]}
            isOptionEqualToValue={(option, value) => option === value}
          />
        </div>
        <Typography sx={{ mt: 4, mb: 2 }} component="div">
          <strong>Participants Selected</strong>
        </Typography>
        <List
          sx={{
            overflow: "auto",
            height: 220,
          }}
        >
          {selected_participant_list
            .sort((a, b) => a - b)
            .map((element, index) => {
              return (
                <ListItem key={index} sx={{ margin: "0px", paddingY: "0px" }}>
                  <ListItemText key={index}>{element}</ListItemText>
                  <Button
                    onClick={() => removeSingleParticipant(group, element)}
                  >
                    <ClearIcon />
                  </Button>
                </ListItem>
              );
            })}
        </List>
        <Button
          variant="text"
          sx={{
            color: "#748AA1",
            alignItems: "right",
            float: "right",
            position: "sticky",
            bottom: "5px",
            marginTop: "5px",
          }}
          onClick={() => clearGroupParticipants(group)}
          startIcon={<ClearIcon />}
        >
          Clear All
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompareGroupCards;
