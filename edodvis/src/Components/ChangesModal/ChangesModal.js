import { forwardRef } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import "./ChangesModal.css";

const ChangesModal = forwardRef((props, ref) => {
  return (
    <Box className="discardContainer">
      <Typography className="discardText">{props.text}</Typography>
      <Container className="discardButton">
        <Button
          variant="outlined"
          sx={{ border: "1px solid #748AA1" }}
          id="discardNo"
          onClick={props.onClick}
          ref={ref}
        >
          No
        </Button>
        <Button
          variant="contained"
          sx={{ background: "#748AA1" }}
          id="discardYes"
          onClick={props.onClick}
          ref={ref}
        >
          Yes
        </Button>
      </Container>
    </Box>
  );
});

export default ChangesModal;
