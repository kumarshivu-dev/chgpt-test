import { useState, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { GET_USER_BRANDS_LIST } from "../../utils/apiEndpoints";
import { setUserBrands } from "../../store/userSlice";

export const useUserBrands = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserBrands = useCallback(async (idToken) => {
    if (!idToken) {
      setError(new Error("No authentication token provided"));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_BRANDS_LIST,
        // "http://localhost:8081/dashboard/profile/list/brands",
        {
          headers: {
            Authorization: idToken,
          },
        }
      );
      dispatch(setUserBrands(response?.data));
      return response?.data;
    } catch (err) {
      console.error("Error fetching user brands: ", err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchUserBrands,
    isLoading,
    error,
  };
};
