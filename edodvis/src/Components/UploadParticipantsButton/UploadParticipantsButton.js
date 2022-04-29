import React from "react";
import { ImFolderUpload } from "react-icons/im";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { UploadParticipantsExcel } from "../../API/apis";
import "./UploadParticipantsButton.css";

const UploadParticipantsButton = () => {
  const [responseText, setResponseText] = React.useState("");
  const [isUploadSuccess, setIsUploadSuccess] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const Input = styled("input")({
    display: "none",
  });

  const uploadFile = function (e) {
    var bodyFormData = new FormData();
    bodyFormData.append("file", e.target.files[0]);

    UploadParticipantsExcel(bodyFormData)
      .then((res) => {
        console.log(res);
        setResponseText(res.data);
        setIsUploadSuccess(true);
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
  };

  // modal to show upload success
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const [openError, setOpenError] = React.useState(true);
  const handleCloseError = () => {
    setOpenError(false);
  };

  return (
    <div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <label htmlFor="contained-button-file">
          <Input
            accept=".xlsx"
            id="contained-button-file"
            multiple
            type="file"
            onChange={uploadFile}
          />
          <Button
            variant="contained"
            component="span"
            startIcon={<ImFolderUpload />}
            sx={{ backgroundColor: "#748AA1" }}
          >
            Upload Participants Excel
          </Button>
        </label>
      </Stack>
      {!isUploadSuccess ? null : (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Participants Added Successfully!
          </Alert>
        </Snackbar>
      )}
      {!isError ? null : (
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleCloseError}
        >
          <Alert onClose={handleCloseError} severity="error">
            Invalid file added, please check again.
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default UploadParticipantsButton;
