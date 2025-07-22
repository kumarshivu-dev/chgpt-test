import { useEffect, useState } from "react";

function useTaskProgressTracker({ taskID, user }) {
  const [progressData, setProgressData] = useState(null);
  const config = {
    headers: {
        Authorization: user.id_token,
    }
};

  useEffect(() => {
    const pollTask = () => {
      fetch(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL +
          `/task_progress/${taskID}`,
          config
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Polling response --> ", data);
          setProgressData(data.progress);

          // If the task state is SUCCESS, stop polling
          if (data.state === "SUCCESS") {
            clearInterval(interval);
          }
        });
    };

    // Initialize the interval variable
    let interval;

    // Poll every 5 seconds (adjust as needed)
    interval = setInterval(pollTask, 5000);

    // Clean up the interval on component unmount or when the task state becomes SUCCESS
    return () => {
      clearInterval(interval);
    };
  }, [taskID]);

  return progressData;
}

export default useTaskProgressTracker;
