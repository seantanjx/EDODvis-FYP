import { useReducer, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { rehydrate } from "../../Store/Actions/CompareGroupsAction";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import { login, getRole, getUserState } from "../../API/apis";
import "./Login.css";
import { persist } from "../../Store/Actions/DateAction";
import WindowDimension from "../../utils/WindowDimension";

const theme = createTheme({
  palette: {
    primary: {
      dark: "#748AA1",
      main: "#FFFFF",
      contrastText: "#fff",
    },
    background: {
      default: "#E6ECF2",
    },
    text: {
      primary: "#31394D",
    },
  },
});

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

const LogIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useReducer(formReducer, {});
  const [validCredentials, setValidCredentials] = useState(true);

  function rehydrateReduxState(data) {
    dispatch(rehydrate(JSON.parse(data["compareGroups"])));
    dispatch(persist(JSON.parse(data["persistDate"])));
    // dispatch(poped());
  }

  const retrieveUserState = async () => {
    try {
      const response = await getUserState();
      if (response.data) {
        var data = JSON.parse(response.data);
        console.log(data);
        rehydrateReduxState(data);
      }
    } catch (e) {
      console.log("No previous state");
    }
  };

  function roleNavigation() {
    const role = getRole();
    if (role === "DE") {
      navigate("/sensoroverview");
    } else {
      navigate("/biomarkersoverview");
    }
  }

  const authenticate = async (data) => {
    try {
      const response = await login(data);
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        retrieveUserState();
        roleNavigation();
      }
    } catch (e) {
      setValidCredentials(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  function handleLogin(event) {
    event.preventDefault();
    authenticate(formData);
    formData["username"] = "";
    formData["password"] = "";
    setValidCredentials(true);
    // updateStatusDevice()
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      roleNavigation();
    }
  });

  const isDesktop = WindowDimension();

  const imageURL = isDesktop
    ? `url(${process.env.PUBLIC_URL + "/Images/Desktop.png"})`
    : `url(${process.env.PUBLIC_URL + "/Images/Mobile.png"})`;

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          backgroundImage: imageURL,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            paddingBottom: 4,
            paddingTop: 4,
            paddingRight: 5,
            paddingLeft: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            boxShadow: 2,
            verticalAlign: "middle",
            position: "absolute",
            width: isDesktop ? "32%" : "50%",
            top: "50%",
            left: isDesktop ? "70%" : "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ color: "text.primary" }}
          >
            <strong>SINEW</strong>
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              onChange={handleChange}
              defaultValue=""
              value={formData["username"]}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleChange}
              defaultValue=""
              value={formData["password"]}
            />

            {!validCredentials && (
              <Alert severity="error" sx={{ mt: 2, py: 0 }}>
                <AlertTitle>
                  <strong>Wrong password or username</strong>
                </AlertTitle>
                <Typography>Please try again</Typography>
              </Alert>
            )}
            <Grid
              item
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, bgcolor: "primary.dark" }}
              >
                Log In
              </Button>
            </Grid>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "20px",
              }}
            >
              <Link
                to={{ pathname: "/createaccount" }}
                className="createAccountLink"
              >
                Create account
              </Link>
            </Container>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};
export default LogIn;
