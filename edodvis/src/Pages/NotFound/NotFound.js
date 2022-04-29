import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import "./NotFound.css";
import WebImages from "./WebImages";
import { getRole } from "../../API/apis";

const NotFound = () => {
  const role = getRole();

  return (
    <div>
      <Container className="notFound">
        <h1>404 Page Not Found</h1>
        <p>
          {" "}
          Please click{" "}
          <Link
            to={role === "DE" ? "/sensoroverview/" : "/biomarkersoverview/"}
          >
            here
          </Link>{" "}
          to be redirected back to our server
        </p>
        <WebImages />
      </Container>
    </div>
  );
};

export default NotFound;
