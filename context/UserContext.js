import { createContext, useState, useEffect, useContext } from "react";

// Create a Context for user data
const UserContext = createContext();

// UserProvider component that will hold the user data state and provide it to the rest of the app
export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [progressData, setProgressData] = useState();

  // Add a function to manually trigger data refresh
  const refreshUserData = () => {
    setLoading(true);
    fetchUserData();
  };

  // Function to clear the task polling interval
  const clearTaskPolling = () => {
    if (window.taskProgressInterval) {
      clearInterval(window.taskProgressInterval);
      window.taskProgressInterval = null;
    }
  };

  // Separate the fetch logic into its own function for reusability
  const fetchUserData = () => {
    const userEmail = localStorage.getItem("useremail");

    if (userEmail) {
      // Step 1: Initialize the database
      fetch("/api/getUsers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => res.json())
        .then(async (usersData) => {
          setUsers(usersData);
          setLoading(false);
          setHasFetched(true);
          // Check if users data exists and has entries
          if (
            usersData &&
            usersData.length > 0 &&
            usersData[0]?.task_id &&
            usersData[0]?.auth_token
          ) {
            startTaskPolling(
              usersData[0].task_id,
              usersData[0].auth_token,
              usersData
            );
          } else {
            clearTaskPolling();
          }
          return null;
        })
        .catch((err) => {
          console.error("Error in data fetch chain:", err);
          setLoading(false);
          clearTaskPolling();
        });
    } else {
      setLoading(false);
      // Clear interval if no user email exists
      clearTaskPolling();
    }
  };

  const startTaskPolling = (taskId, authToken, usersData) => {
    if (!taskId || !authToken) {
      clearTaskPolling();
      return;
    }

    // Clear any previous intervals before starting a new one
    clearTaskPolling();

    window.taskProgressInterval = setInterval(async () => {
      try {
        // Check if user still exists in local storage before making the request
        const userEmail = localStorage.getItem("useremail");
        if (!userEmail) {
          console.log("User email no longer in localStorage, stopping polling");
          clearTaskPolling();
          return;
        }

        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL +
            `/standalone/task_progress/${taskId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        const createdAtString = usersData[0]?.created_at;
        let elapsedTime;
        if (!createdAtString) {
          console.error("created_at is missing or undefined");
        } else {
          const [datePart, timePart] = createdAtString.split(" ");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hours, minutes, seconds] = timePart.split(":").map(Number);

          const createdAt = new Date(
            Date.UTC(year, month - 1, day, hours, minutes, seconds)
          );

          if (isNaN(createdAt.getTime())) {
            console.error("Invalid created_at value:", createdAtString);
          } else {
            elapsedTime = (Date.now() - createdAt.getTime()) / 1000 / 60; // Convert to minutes
            if (elapsedTime > 15) {
              setProgressData({
                progress: "",
                state: "TIMEOUT",
                status: "Task in progress...",
              });
              clearTaskPolling();
            }
          }
        }

        if (!response.ok) {
          console.error(
            "Error response from task progress API:",
            response.status
          );
          // If we get a 401 or 404, it could mean the user is no longer valid
          if (response.status === 401 || response.status === 404) {
            clearTaskPolling();
          }
          return;
        }

        const responseData = await response.json();
        setProgressData(responseData);

        // If task is completed or failed, we can stop polling
        if (
          responseData?.state === "SUCCESS" ||
          responseData?.state === "FAILURE" ||
          responseData?.state === "TIMEOUT"
        ) {
          clearTaskPolling();
        }
      } catch (error) {
        console.error("Error fetching task progress:", error);
      }
    }, 5000); // Call every 5 seconds
  };

  // Listen for potential user data deletion in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "useremail" && !e.newValue) {
        console.log("User email removed from localStorage");
        clearTaskPolling();
        setUsers([]);
        setHasFetched(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearTaskPolling();
    };
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    if (!hasFetched) {
      fetchUserData();
    }
  }, [hasFetched]);

  const clearUserData = () => {
    clearTaskPolling();
    setUsers([]);
    setHasFetched(false);
    setProgressData([]);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        refreshUserData,
        progressData,
        clearUserData, // Expose the clear function to consumers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user data
export const useUser = () => {
  return useContext(UserContext);
};
