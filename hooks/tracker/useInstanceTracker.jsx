import { useEffect, useState } from "react";

function useInstanceTracker(taskId, user,instanceOperation, onComplete) {
  const [progressData, setProgressData] = useState(0);
  const config = {
    headers: {
      Authorization: user?.id_token,
    },
  };

  useEffect(() => {
    if (!taskId) return;
    if (user?.email) {
      localStorage.setItem("useremail", user.email);
    };
    const storedStartTime = localStorage.getItem(`task_${taskId}_startTime`);
    let startTime;

    // Use stored start time if available, otherwise initialize and store it
    if (storedStartTime) {
      startTime = new Date(storedStartTime).getTime();
    } else {
      startTime = Date.now();
      localStorage.setItem(`task_${taskId}_startTime`, new Date(startTime).toISOString());
    }

    const pollTask = () => {
      fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          process_name: "aws_instance",
          email: user?.email,
          task_id: taskId,
          auth_token:user?.id_token,
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));

        
      fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/standalone/task_progress/${taskId}`,
        config
      )
        .then((response) => response.json())
        .then((data) => {
          setProgressData(data?.progress);
  
          const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Elapsed time in minutes
          if (data?.state === "SUCCESS") {
            clearInterval(interval);
            localStorage.removeItem(`task_${taskId}_startTime`); // Cleanup localStorage
            onComplete("SUCCESS"); // Notify success
          } else if (data?.state === "FAILURE") {
            clearInterval(interval);
            localStorage.removeItem(`task_${taskId}_startTime`); // Cleanup localStorage
            if (instanceOperation === "launch" && data?.progress >= 70) {
              onComplete("FAILURE_70", data, true); // Pass fail_70 as true
            } else {
              onComplete("FAILURE", data, false);
            }
          } else if (elapsedTime > 15) {
            console.warn("Timeout occurred after 15 minutes");
            clearInterval(interval); // Stop polling
            localStorage.removeItem(`task_${taskId}_startTime`);
             // Cleanup localStorage
            onComplete("TIMEOUT");
          }
        }) 
        .catch((error) => {
            localStorage.removeItem(`task_${taskId}_startTime`); // Cleanup localStorage
            onComplete("FAILURE");
            console.error("Error in polling fetch:", error);
        });
    };

    // Poll every 5 seconds
    const interval = setInterval(pollTask, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [taskId]);

  return progressData;
}

export default useInstanceTracker;
