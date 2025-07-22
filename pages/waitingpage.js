import React from "react";
import { Typography, CircularProgress, Button, Box, Grid, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { styled } from "@mui/material/styles";
import Link from "next/link";
const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
  },
  [`& .${"waitingBox"}`]: {
    backgroundColor: "#0d0d44",
    color: "white",
    borderRadius: 4,
    padding: theme.spacing(4),
    textAlign: "center",
  },
  [`& .${"inputBox"}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  [`& .${"textInBox"}`]: {
    fontSize: 12,
    color: "#cdcdcd",
  },
  [`& .${"btnBox"}`]: {
    width:'100%',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
  },
  [`& .${"generateBtn"}`]: {
    margin: theme.spacing(1),
    color: "white",
    backgroundColor: "#575656;",
    "&:hover": {
      color: "white",
      backgroundColor: "#575656;",
    },
  },
  [`& .${"ExitBtn"}`]: {
    margin: theme.spacing(1),
    border: "1px solid orange",
    color: "orange",
    "&:hover": {
      // Reset hover styles
      border: "1px solid orange",
      color: "orange",
      // backgroundColor: 'white',
    },
  },
}));

const arrayOfButtons = [
  <div className="nav-indicators"><p>Content Generation</p></div>,
  <div className="nav-indicators"><p>SEO</p></div>,
  <div className="nav-indicators"><p>Taxonomy</p></div>
]
function WaitingPage({ onCancel }) {
  return (
    <Root className="root">
      <Box>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={10}>
            <Box className="waitingBox">
              <CircularProgress />
              <Typography variant="body1">Generating result- This will take a while</Typography>
              <Typography variant="body2" className="textInBox">
                Your results file will be shared via email as a download link
              </Typography>
              <Box className="inputBox">
                <Box>
                  <Button
                    size={"large"}
                    variant="contained"
                    className="generateBtn"
                  // disabled
                  >
                    Generating
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Box className="btnBox" mt={2}>
            <Button
              size={"large"}
              variant="outlined"
              component="label"
              className="ExitBtn"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </Grid>

        <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={10} className="waiting-carousel-wrapper">
          <Carousel interval="8000" sx={{ height: "100%" }}
            IndicatorIcon={arrayOfButtons}
            activeIndicatorIconButtonProps={{
              style: {
                opacity: "100%",
                backgroundColor: 'transparent', // 2
              }
            }}
            indicatorIconButtonProps={{
              style: {
                // marginRight: "30px",
                borderRadius: "0",
                zIndex: "1",
                opacity: "50%"
              }
            }}
          >

            <Paper className="waiting-page" sx={{ borderRadius: 0, backgroundImage: "url(/ProductContentGenerationHorizontal.webp)" }}>
              <Grid container sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.25)", display: "flex", justifyContent: "center" }}>

              </Grid>
            </Paper>
            <Paper className="waiting-page" sx={{ borderRadius: 0, backgroundImage: "url(/SEOHorizontal.webp)" }}>
              <Grid container sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.25)", display: "flex", justifyContent: "center" }}>

              </Grid>
            </Paper>
            <Paper className="waiting-page" sx={{ borderRadius: 0, backgroundImage: "url(/Taxonomyhorizontal.webp)" }}>
              <Grid container sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.25)", display: "flex", justifyContent: "center" }}>

              </Grid>
            </Paper>
            {/* // <Item key={item.id} item={item} /> */}
            {/* ))} */}
          </Carousel>
        </Grid>
      </Grid>
      </Box>
    </Root>
  );
}

export default WaitingPage;
