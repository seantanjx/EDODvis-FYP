import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import Box from "@mui/material/Box";
import {
  BsFillEyeFill as Visibility,
  BsFillEyeSlashFill as VisibilityOff,
} from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import _ from "lodash";
import Modal from "@mui/material/Modal";
import "./CreateAccount.css";
import { createUser } from "../../API/apis";
import ChangesModal from "../../Components/ChangesModal/ChangesModal";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [discard, setDiscard] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    displayName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  function handleBack() {
    console.log(formData);
    if (
      formData["username"].length > 0 ||
      formData["displayName"].length > 0 ||
      formData["password"].length > 0 ||
      formData["confirmPassword"].length > 0
    ) {
      setDiscard(true);
    } else {
      navigate("/");
    }
  }

  function handleClick(events) {
    if (events.target.id === "discardYes") {
      navigate("/");
    }
    setDiscard(false);
  }

  function handleSubmit() {
    let errorArr = [];
    let missingField = [];

    _.map(Object.entries(formData), ([key, value]) => {
      if (value.length === 0) {
        if (key === "displayName") {
          missingField.push(`display name`);
        } else if (key === "confirmPassword") {
          missingField.push("confirm password");
        } else missingField.push(key);
      }
    });

    if (missingField.length > 0) {
      errorArr.push(`Please fill in the ${missingField.join(", ")} fields`);
    }

    if (formData["password"] !== formData["confirmPassword"]) {
      errorArr.push("Password and confirm password do not match");
    }

    if (formData["password"].length < 8 && formData["password"].length > 0) {
      errorArr.push("Password less than 8 characters");
    }

    if (errorArr.length > 0) {
      return setError(errorArr);
    }

    const postCreateUser = async () => {
      try {
        await createUser(
          formData["username"],
          formData["password"],
          formData["displayName"]
        );
        alert(
          "Account created successfully. Please contact your organisation's admin to activate your account."
        );
        navigate("/");
        return setError(null);
      } catch (e) {
        console.log(e);
        if (e.response.status === 400) {
          if (formData["username"].length > 0) {
            errorArr.push(
              "Username already exists. Please use another username."
            );
          } else if (missingField.length > 0) {
            errorArr.push(
              `Please fill in the ${missingField.join(", ")} fields`
            );
          }
          return setError(errorArr);
        }
      }
    };

    // call api to create account
    postCreateUser();
  }

  const [isDesktop, setDesktop] = useState(window.innerWidth > 900);
  const updateMedia = () => {
    setDesktop(window.innerWidth > 900);
  };
  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const imageURL = isDesktop
    ? `url(${process.env.PUBLIC_URL + "/Images/Desktop.png"})`
    : `url(${process.env.PUBLIC_URL + "/Images/Mobile.png"})`;

  return (
    <div
      style={{
        backgroundImage: imageURL,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          paddingBottom: 2,
          paddingTop: 3,
          paddingRight: 4,
          paddingLeft: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "rgba(255, 255, 255, 0.9)",
          boxShadow: 2,
          verticalAlign: "middle",
          position: "relative",
          width: isDesktop ? "40%" : "60%",
          top: "5%",
          left: "50%",
          marginBottom: "5%",
        }}
      >
        <Container id="createAccountBack">
          <Typography onClick={handleBack} className="createAccountLink">
            <BiArrowBack />
            &nbsp; Return to Login Page
          </Typography>
        </Container>
        <Modal open={discard}>
          <ChangesModal text="Discard Changes?" onClick={handleClick} />
        </Modal>
        <Typography
          component="h1"
          variant="h4"
          sx={{ color: "text.primary", textAlign: "center" }}
        >
          <strong>SINEW</strong>
        </Typography>
        <Typography
          sx={{
            color: "#52575C",
            mt: "5px",
            mb: "5px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          - Create Account -
        </Typography>
        <Container
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box className="createField">
            <Typography className="filterLabel">Username</Typography>
            <TextField
              margin="normal"
              id="createUsername"
              required
              label="Required"
              type="text"
              name="username"
              autoFocus
              onChange={handleChange}
              value={formData["username"]}
            />
          </Box>
          <Box className="createField">
            <Typography className="filterLabel">Display Name</Typography>
            <TextField
              margin="normal"
              id="createDisplayName"
              required
              label="Required"
              type="text"
              name="displayName"
              autoFocus
              onChange={handleChange}
              value={formData["displayName"]}
            />
          </Box>
          <Box className="createField">
            <Box padding="0px">
              <Typography className="filterLabel">Password</Typography>
              <Typography
                className="filterLabel"
                sx={{
                  fontStyle: "italic",
                  fontSize: "13px",
                }}
              >
                (At least 8 characters)
              </Typography>
            </Box>
            <TextField
              margin="normal"
              style={{ width: "210px" }}
              name="password"
              required
              label="Required"
              type={showPassword ? "text" : "password"}
              id="createPassword"
              onChange={handleChange}
              value={formData["password"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box className="createField">
            <Typography className="filterLabel">Confirm Password</Typography>
            <TextField
              margin="normal"
              style={{ width: "210px" }}
              name="confirmPassword"
              required
              label="Required"
              type={showConfirmPassword ? "text" : "password"}
              id="createConfirmPassword"
              onChange={handleChange}
              value={formData["confirmPassword"]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {error !== null && (
            <Alert severity="error" sx={{ width: "100%", mt: 1, pt: 1 }}>
              <AlertTitle>
                <strong>Unsuccessful submission</strong>
              </AlertTitle>
              <ul className="errorList">
                {_.map(error, (e) => (
                  <li>
                    <Typography>{e}</Typography>
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0px 10px 0px",
            }}
          >
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ bgcolor: "primary.dark" }}
            >
              Submit
            </Button>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default CreateAccount;
