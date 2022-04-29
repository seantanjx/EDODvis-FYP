import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { AiOutlineClose } from "react-icons/ai";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import "./Remark.css";

const AllRemarkModal = forwardRef((props, ref) => {
  const participantRemarks = props.remarks[0][1];

  return (
    <Box className="allRemarkContainer">
      <Container component="main" id="allRemarkHeader" className="modalHeader">
        <Typography className="remarkTitle"> REMARKS</Typography>
        <Button
          className="remarkCloseButton"
          onClick={props.onClickClose}
          ref={ref}
        >
          <AiOutlineClose style={{ color: "#748AA1" }} />
        </Button>
      </Container>
      <Typography className="idOfInterest">
        PARTICIPANT ID: {props.pid}
      </Typography>
      <Container className="allRemarkContent">
        {Object.keys(participantRemarks).map((key) => {
          if (
            key !== "participant_ok" &&
            participantRemarks[key].remarks !== null &&
            participantRemarks[key].remarks !== ""
          ) {
            return (
              <Container key={key} className="remarkRow" direction="column">
                <Typography className="remarkSid">{key}</Typography>
                <Typography className="remarkType">
                  {participantRemarks[key].type} (
                  {participantRemarks[key].location.replace("_", " ")})
                </Typography>
                <Typography className="allRemarkText">
                  {participantRemarks[key].remarks}
                </Typography>
              </Container>
            );
          }
        })}
      </Container>
    </Box>
  );
});

export default AllRemarkModal;