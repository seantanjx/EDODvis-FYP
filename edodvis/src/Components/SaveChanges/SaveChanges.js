import { Fragment } from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./SaveChanges.css";

const SaveChanges = (props) => {
  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={props.handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={6000}
        onClose={props.handleClose}
        message={props.message}
        action={action}
      />
    </div>
  );
};

export default SaveChanges;
