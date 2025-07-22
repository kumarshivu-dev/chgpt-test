import { BorderColorRounded } from "@mui/icons-material";
import { Box, Card, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";
import { Button } from "react-scroll";

const ChannelConfigData = ({ channelName, channelData }) => {
  return channelName === "Blog" ? (
    <>
      <Grid item xs={12} md={3} py={1}>
        <Typography variant="h6" fontWeight="bold">
          Blog Length
        </Typography>
        <Typography fontWeight={"bold"}>
          Min Length:{" "}
          <Typography component={"span"}>
            {channelData?.blog_length?.minLength ?? "-"}
          </Typography>
        </Typography>
        <Typography fontWeight={"bold"}>
          Max Length:{" "}
          <Typography component={"span"}>
            {channelData?.blog_length?.maxLength ?? "-"}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} py={1}>
        <Typography variant="h6" fontWeight="bold">
          Blog Description
        </Typography>

        <Typography component={"span"}>
          {channelData?.blog_description ?? "-"}
        </Typography>
      </Grid>
    </>
  ) : (
    <>
      {" "}
      <Grid item xs={12} md={3} py={1}>
        <Typography variant="h6" fontWeight="bold">
          Feature Bullets
        </Typography>
        <Typography fontWeight={"bold"}>
          Count:{" "}
          <Typography component={"span"}>
            {channelData?.featureBullets?.traits?.length ?? "-"}
          </Typography>
        </Typography>
        <Typography fontWeight={"bold"}>
          Min Length:{" "}
          <Typography component={"span"}>
            {channelData?.featureBullets?.minLength ?? "-"}
          </Typography>
        </Typography>
        <Typography fontWeight={"bold"}>
          Max Length:{" "}
          <Typography component={"span"}>
            {channelData?.featureBullets?.maxLength ?? "-"}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} md={3} py={1}>
        <Typography variant="h6" fontWeight="bold">
          Short Description
        </Typography>
        <Typography fontWeight={"bold"}>
          Min Length:{" "}
          <Typography component={"span"}>
            {channelData?.shortDescription?.minLength ?? "-"}
          </Typography>
        </Typography>
        <Typography fontWeight={"bold"}>
          Max Length:{" "}
          <Typography component={"span"}>
            {channelData?.shortDescription?.maxLength ?? "-"}
          </Typography>
        </Typography>
      </Grid>
      <Grid item xs={12} md={3} py={1}>
        <Typography variant="h6" fontWeight="bold">
          Long Description
        </Typography>
        <Typography fontWeight={"bold"}>
          Min Length:{" "}
          <Typography component={"span"}>
            {channelData?.longDescription?.minLength ?? "-"}
          </Typography>
        </Typography>
        <Typography fontWeight={"bold"}>
          Max Length:{" "}
          <Typography component={"span"}>
            {channelData?.longDescription?.maxLength ?? "-"}
          </Typography>
        </Typography>
      </Grid>
    </>
  );
};

export default ChannelConfigData;
