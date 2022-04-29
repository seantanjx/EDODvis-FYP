import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import { AiOutlineClose } from "react-icons/ai";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import "./NoMotionModal.css";
import LoadingAnimation from "../../Components/LoadingAnimation/LoadingAnimation";
import { getRole, getAllDeviceByArea } from "../../API/apis";
import { poped } from "../../Store/Actions/PopStatusAction";

const NoMotionModal = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [sensorsData, setSensorsData] = useState(null);

  useEffect(() => {
    getAllDeviceByArea("all")
      .then((response) => {
        if (response.data) {
          setSensorsData(JSON.parse(response.data));
        }
      })
      .catch((e) => {
        console.log("500 Internal Server error");
      });
    setOpen(true);
  }, []);

  if (sensorsData === null) {
    return <LoadingAnimation />;
  }

  function handleClick() {
    const role = getRole();
    if (role === "SU" && location.pathname !== "/sensoroverview") {
      navigate("/sensoroverview");
    }
  }

  function handleClose() {
    setOpen(false);
    dispatch(poped());
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box id="noMotionModal">
          <Grid container className="modalHeader" margin="10px">
            <Grid item xs={11}>
              <Typography variant="h5" id="modalTitle">
                NO MOTION DETECTED
              </Typography>
            </Grid>
            <Grid item xs={1} position="relative" top="-13px">
              <Button
                variant="outlined"
                size="small"
                startIcon={<AiOutlineClose />}
                id="CloseButton"
                onClick={() => handleClose()}
              ></Button>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} rowSpacing={4} margin="0px 10px">
              <Typography variant="h6" fontWeight="bold" paddingBottom="5px">
                Number of houses:{" "}
                {sensorsData.summary_of_sensors.total_houses_w_no_motion}
              </Typography>
              <Grid item xs={12}>
                <List
                  sx={{
                    overflow: "auto",
                    height: 220,
                    width: "100%",
                  }}
                >
                  {sensorsData.summary_of_sensors.participant_id_w_no_motion.map(
                    (participant_id, index) => (
                      <ListItem
                        key={index}
                        sx={{ marginX: "0px", paddingY: "0px" }}
                      >
                        <ListItemText key={index}>
                          {participant_id}
                        </ListItemText>
                      </ListItem>
                    )
                  )}
                </List>
              </Grid>
            </Grid>
            <Grid item container xs={12} p={5} marginBottom="5px">
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                {getRole() === "SU" &&
                location.pathname !== "/sensoroverview" ? (
                  <Button
                    variant="contained"
                    size="small"
                    id="NavigateButton"
                    onClick={handleClick}
                  >
                    <Typography id="modal-modal-description">
                      Go to Sensors Overview
                    </Typography>
                  </Button>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default NoMotionModal;
