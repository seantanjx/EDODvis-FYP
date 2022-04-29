import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "./SensorCards.css";

const SensorCards = (props) => {
  return (
    <>
      {props.isButton ? (
        <Card variant="outlined" className="summaryCard" sx={props.sx}>
          <CardActionArea
            className="sensorCardAction"
            onClick={props.onClick}
            id={props.id}
          >
            <CardContent className={props.contentClassName} component="span">
              <Typography
                className="sensorValueInline"
                data-testid="sensorCount"
              >
                {props.data}{" "}
              </Typography>
              <Typography className="sensorDesc" data-testid="sensorType">
                {props.text}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ) : (
        <Card variant="outlined" className="sensorCard" sx={props.sx}>
          <CardContent className={props.contentClassName}>
            <Typography className="sensorValue">{props.data}</Typography>
            <Typography className="sensorType">{props.text}</Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SensorCards;
