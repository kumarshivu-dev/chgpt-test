import { OPERATE_CLOUD_INSTANCE } from "../../utils/apiEndpoints";
import { useState, useCallback } from "react";
import axios from "axios";

const useInstanceOperations = (user, setters) => {
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL + "/cloudService/operate/cloud/instance";

  const {
    setIsLaunched,
    setProgress,
    setFinalProgress,
    setTaskId,
    setSecretKey,
    setAccessKey,
    setCloudSetup,
    setInstanceLLM,
    setInstanceType,
    setInstanceVolume,
  } = setters;

  const handleOperation = async (operation, additionalActions = {}) => {
    const { beforeRequest, onSuccess, onError } = additionalActions;

    console.log("operaiotn");

    try {
      // Pre-request actions
      if (beforeRequest) {
        beforeRequest();
      }

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + OPERATE_CLOUD_INSTANCE,
        { operation },
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      // Operation-specific success handling
      if (onSuccess) {
        onSuccess(response);
      }

      console.log(
        `${operation} operation completed successfully:`,
        response.data
      );
      return response.data;
    } catch (error) {
      console.error(`Error during ${operation} operation:`, error);

      // Operation-specific error handling
      if (onError) {
        onError(error);
      }

      throw error;
    }
  };

  const handleLaunch = async () => {
    return handleOperation("launch", {
      beforeRequest: () => {
        setIsLaunched(true);
        setProgress(0);
      },
      onSuccess: (response) => {
        console.log("response: ", response);
        if (response.data?.taskId) {
          setFinalProgress(true);
          setTaskId(response.data.taskId);

          // Save instance data to localStorage
        //   localStorage.setItem(
        //     "instanceData",
        //     JSON.stringify({
        //       isLaunched: true,
        //       secretKey,
        //       accessKey,
        //       cloudSetup,
        //       instanceLLM,
        //       instanceType,
        //       instanceVolume,
        //       finalProgress: true,
        //     })
        //   );
        } else {
          throw new Error("Task ID not returned from API.");
        }
      },
      onError: () => {
        setIsLaunched(false);
      },
    });
  };

  const handleTerminate = async () => {
    return handleOperation("terminate", {
      onSuccess: () => {
        setIsLaunched(false);
        setFinalProgress(false);

        // Clear all instance-related state
        localStorage.removeItem("instanceData");
        setSecretKey("");
        setAccessKey("");
        setCloudSetup("");
        setInstanceLLM("");
        setInstanceType("");
        setInstanceVolume("");
      },
    });
  };

  const handlePause = async () => {
    return handleOperation("pause");
  };

  const handleStart = async () => {
    return handleOperation("start");
  };

  return {
    handleLaunch,
    handleTerminate,
    handlePause,
    handleStart,
  };
};

export default useInstanceOperations;
