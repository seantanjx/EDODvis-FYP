import { forwardRef, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AiOutlineClose } from "react-icons/ai";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { updateRemarks } from "../../API/apis";
import ChangesModal from "../ChangesModal/ChangesModal";

const RemarkModal = forwardRef((props, ref) => {
  const [edit, setEdit] = useState(false);
  const [remarks, setRemarks] = useState(props.remarks);
  const [save, setSave] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [currRemark, setCurrRemark] = useState(null);

  const handleEdit = () => {
    setEdit(true);
    setSave(false);
  };

  console.log(currRemark);

  const handleSave = (event) => {
    if (currRemark !== undefined) {
      setRemarks(currRemark);
      setSave(true);
      try {
        updateRemarks([props.sid], currRemark);
      } catch (e) {
        console.log(e);
      }
    }

    setEdit(false);

    let items = [...props.device];
    items.filter((row) => row.id.toString() === event.target.id)[0].remarks =
      currRemark;
    props.setDevice(items);
  };

  const handleCancel = () => {
    if (currRemark !== remarks && currRemark !== null) {
      setDiscard(true);
    } else {
      setEdit(false);
    }
  };

  const handleClick = (events) => {
    if (events.target.id === "discardYes") {
      setEdit(false);
    }
    setDiscard(false);
  };

  return (
    <Box className="remarkModalContainer">
      <Container component="main" id="remarkHeader" className="modalHeader">
        <Typography className="remarkTitle">REMARK</Typography>
        {edit ? (
          <></>
        ) : (
          <Button
            className="remarkCloseButton"
            onClick={props.onClickClose}
            ref={ref}
          >
            <AiOutlineClose style={{ color: "#748AA1" }} />
          </Button>
        )}
      </Container>
      <Typography id="remarkIdOfInterest" className="idOfInterest">
        SENSOR ID: {props.sName}
      </Typography>
      <Container component="form" className="remarkModalContent">
        {edit ? (
          <TextField
            id={props.sid}
            margin="normal"
            multiline
            fullWidth
            type="search"
            defaultValue={remarks}
            onChange={(event) => setCurrRemark(event.target.value)}
            label="Add/Edit Remark"
            rows={4}
            ref={ref}
          />
        ) : (
          <Typography className="remarkText" ref={ref}>
            {remarks}
          </Typography>
        )}
      </Container>
      <Container className="remarkButton">
        {edit ? (
          <Container className="saveContainer">
            <Button
              variant="text"
              sx={{ color: "primary.dark", mr: 2 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
              onClick={handleSave}
              disabled={currRemark === null ? true : false}
              id={props.sid}
            >
              Save
            </Button>
          </Container>
        ) : (
          <Container className="editContainer">
            <Typography className="changesSaved">
              {save ? "Changes saved" : " "}
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Container>
        )}
      </Container>
      <Modal open={discard}>
        <ChangesModal text="Discard Changes?" onClick={handleClick} />
      </Modal>
    </Box>
  );
});

export default RemarkModal;
