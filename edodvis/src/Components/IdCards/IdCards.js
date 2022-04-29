import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Grid from "@mui/material/Grid";

const IdCards = ({ GroupName, GroupNameColour }) => {
  return (
    <Grid container spacing={1} marginBottom="16px">
      {GroupName.map((value, index) => {
        return (
          <Grid key={value} item xs={11} md={4} sx={{ alignItems: "stretch" }}>
            <Card
              key={index}
              sx={{
                width: 1,
                height: 1,
                backgroundColor: GroupNameColour[index],
              }}
            >
              <CardContent id="CardContent">
                <AccountCircleIcon
                  sx={{
                    verticalAlign: "middle",
                    display: "inline",
                    marginRight: "5px",
                  }}
                />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    verticalAlign: "middle",
                    display: "inline",
                    wordWrap: "break-word",
                  }}
                >
                  {GroupName[index]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default IdCards;
