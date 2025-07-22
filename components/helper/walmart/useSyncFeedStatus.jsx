import { useEffect, useState } from "react";
import axios from "axios";

function useSyncFeedStatus({ feedId, user }) {
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const pollTask = async () => {
      const data = {
        email: user?.email,
      };
      try {
        const userEmail = "example@email.com"; // Replace with the actual user email
        const config = {
          headers: {
            Authorization: user.id_token,
          },
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_WALMART_BASE_URL}/feed-status/${feedId}`,
          data,
          config
        );

        console.log("Sync Feed response --> ", response.data);

        const { itemsFailed, itemsSucceeded, itemsReceived, state } =
          response.data;
        const percentage =
          ((itemsFailed + itemsSucceeded) / itemsReceived) * 100;
        console.log("feed %", percentage);
        setProgressData(percentage);

        // If the task state is SUCCESS, stop polling
        if (state === "PROCESSED") {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error fetching feed status:", error);
      }
    };

    // Initialize the interval variable & Poll every 5 seconds (adjust as needed)
    const interval = setInterval(pollTask, 5000);

    // Cleanup the interval when the component unmounts or when feedId changes
    return () => {
      clearInterval(interval);
    };
  }, [feedId]);

  return progressData;
}

export default useSyncFeedStatus;
