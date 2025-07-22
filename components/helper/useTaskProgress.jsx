import { useEffect, useState } from "react";

function useTaskProgress(taskId, user, isSelected) {
  const [progressData, setProgressData] = useState({
    progress: 0,
    state: "PENDING",
    error: null,
  });

  if (!taskId) return progressData;

  const config = {
    headers: {
      Authorization: user.id_token,
    },
  };

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/standalone/task/progress/${taskId}`;
    const pollTask = () => {
      fetch(url, config)
        .then((response) => response.json())
        .then((data) => {
          console.log("Polling response --> ", data);
          setProgressData({
            progress: data?.percentage || 0,
            state: data?.state || "PENDING",
            error: data?.message || null,
          });

          if (data?.state === "SUCCESS" || data?.state === "FAILURE") {
            clearInterval(interval);
          }
        })
        .catch((error) => {
          console.error("Error in fetch:", error);
          setProgressData((prev) => ({
            ...prev,
            error: error?.message,
          }));
          clearInterval(interval);
        });
    };

    // Poll every 5 seconds
    const interval = setInterval(pollTask, 5000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  return progressData;
}

export default useTaskProgress;
