import { GET_PERSONA_LIST } from "../../utils/apiEndpoints";
import api from "../api";

const channelApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPersonasList: build.query({
      // Accept both brandId and brandSpecific
      query: ({ brandId, brandSpecific }) => {
        const queryObject = { url: GET_PERSONA_LIST };

        if (brandSpecific) {
          queryObject["params"] = { brandId: brandId };
        }

        return queryObject;
      },
      transformResponse: (response) => response.personasAttrsList,
    }),
  }),
});

export const { useGetPersonasListQuery } = channelApi;  
