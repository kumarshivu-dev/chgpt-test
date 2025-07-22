import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Link,
  LinearProgress,
  Stack,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx/xlsx";
import useTaskProgress from "../../helper/useTaskProgress";
import CircularWithValueLabel from "../../../pages/circularProgress";
import LinearProgressBarWithValue from "../../../components/common-ui/LinearProgressBarWithValue";
import useTaskProgressV1 from "../../../components/helper/useTaskProgressV1";

function ProductLoader({ productTaskId, user, isSelected }) {
  const router = useRouter();

  const { progress, state, error } = useTaskProgress(
    productTaskId?.taskId,
    user,
    isSelected
  );

  const {
    progress: blogProgress,
    state: blogState,
    error: blogError,
  } = useTaskProgressV1(productTaskId?.blogTaskId, user, isSelected);

  const encoded_name = encodeURIComponent(productTaskId?.name);
  const encoded_blogname = encodeURIComponent(productTaskId?.blogName);

  useEffect(() => {
    const hasProductTask = productTaskId?.taskId;
    const hasBlogTask = productTaskId?.blogTaskId;

    if (
      (hasProductTask && state !== "SUCCESS" && state !== "FAILURE") ||
      (hasBlogTask && blogState !== "SUCCESS" && blogState !== "FAILURE")
    ) {
      return;
    }

    let query = {};
    if (hasProductTask) {
      if (state === "SUCCESS") {
        query = { ...query, getFileName: encoded_name, isSelected };
      } else {
        query = { ...query, taskState: "FAILURE", error };
      }
    }

    if (hasBlogTask) {
      if (blogState === "SUCCESS") {
        query = { ...query, getBlogFileName: encoded_blogname, isSelected };
      } else {
        query = { ...query, blogTaskState: "FAILURE", blogError };
      }
    }

    router.push({
      pathname: "/dashboard/result",
      query,
    });
    // if (state === "SUCCESS" ) {
    //   router.push({
    //     pathname: "/dashboard/result",
    //     query: { getFileName: encoded_name, isSelected },
    //   });
    // } else if (state === "FAILURE") {
    //   console.error("Task failed:", error); // Log the error for debugging
    //   router.push({
    //     pathname: "/dashboard/result",
    //     query: { taskState: "FAILURE", error },
    //   });
    // }
  }, [state, blogState, progress, blogProgress]);

  return (
    <Box
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <Typography variant="h3">Your Document is processing...</Typography>
      <Box
        sx={{
          border: "1px dashed grey",
          padding: "13px",
          borderRadius: "10px",
          padding: "30px",
          margin: "16px 0px 8px 0px",
          backgroundColor: "#F9F9FB",
          color: "#7B89B2",
          position: "relative",
        }}
      >
        <Stack direction={"column"} spacing={2}>
          {productTaskId?.taskId && (
            <Box>
              <Typography variant="body1" textAlign={"left"}>
                Content Generation :
              </Typography>
              {state === "FAILURE" ? (
                <Typography variant="body1" textAlign={"left"} color={"red"}>
                  Failed
                </Typography>
              ) : (
                <LinearProgressBarWithValue value={progress} size={70} />
              )}
            </Box>
          )}
          {productTaskId?.blogTaskId && (
            <Box>
              <Typography variant="body1" textAlign={"left"}>
                Blog Generation :
              </Typography>
              {blogState === "FAILURE" ? (
                <Typography variant="body1" textAlign={"left"} color={"red"}>
                  Failed
                </Typography>
              ) : (
                <LinearProgressBarWithValue value={blogProgress} size={70} />
              )}
            </Box>
          )}
        </Stack>

        {/* <div style={{ position: "relative" }}>
          <img src="/Ellipse.png" alt="Background-Image" />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularWithValueLabel progress={progress} />
          </div>
        </div> */}
      </Box>
      <Typography
        sx={{
          color: "#5E5E5E",
          fontSize: "15px",
          margin: "20px 0px",
        }}
      >
        You’ll be informed via email so that you don’t miss the generated
        result.
      </Typography>
      <Box
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "10px",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          sx={{
            borderRadius: "5px",
          }}
          onClick={() => {
            router.push({
              pathname: "/dashboard/home",
            });
          }}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}

export default ProductLoader;
