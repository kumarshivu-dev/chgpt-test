import { useState, useEffect } from "react";
import axios from "axios";
import { GET_CLOUD_INFO } from "../../utils/apiEndpoints";


const useInstanceState = (user) => {
  const [Cloudresponse, setCloudResponse] = useState(null);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + GET_CLOUD_INFO, {
          headers: { Authorization: user?.id_token },
        });

        setCloudResponse(res.data); 
      } catch (err) {
        
      }
    };

    if (user) {
      fetchResponse();
    }
  }, [user]);

  return { Cloudresponse };
};

export default useInstanceState;
