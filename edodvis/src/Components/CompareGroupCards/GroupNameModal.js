import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import "./GroupNameModal.css";

const GroupNameModal = ({ group, cardTitle, updateName }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    event.preventDefault();
    setName(event.target.value);
  };

  const handleClick = () => {
    handleClose();
    updateName(group, name);
    setName("");
  };

  return (
    <div>
      <Button onClick={handleOpen} startIcon={<EditIcon />}></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box id="modal">
          <Grid container>
            <Grid item xs={12}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <strong>Edit Group Name</strong>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ mt: 1 }}>Current Name: {cardTitle}</Typography>
              <TextField
                id="standard-basic"
                variant="standard"
                margin="normal"
                required
                fullWidth
                value={name}
                onChange={handleChange}
                label="New Group Name"
                sx={{ mt: 0 }}
                inputProps={{ maxLength: 40 }}
              />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="text"
                  sx={{
                    color: "#748AA1",
                    alignItems: "right",
                    mt: 2,
                  }}
                  startIcon={<ClearIcon />}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  onClick={() => handleClick()}
                  sx={{
                    bgcolor: "#748AA1",
                    float: "right",
                    position: "sticky",
                    bottom: "20px",
                    mt: 2,
                  }}
                >
                  Change
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
};

export default GroupNameModal;
