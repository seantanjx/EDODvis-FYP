import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import "./Unauthorised.css";
import Image from "./Image";
import { getRole } from "../../API/apis";

const Unauthorized = () => {
  const role = getRole();

  return (
    <div>
      <Container className="unauthorised">
        <h1>Unauthorized Access</h1>
        <p>
          Your account does not have access to this page. Please click{" "}
          <Link
            to={role === "DE" ? "/sensoroverview/" : "/biomarkersoverview/"}
          >
            here
          </Link>{" "}
          to be redirected back to our server
        </p>
        <Image />
      </Container>
    </div>
  );
};

export default Unauthorized;
