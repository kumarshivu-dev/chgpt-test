import { showToast } from "../../context/ToastContext";
import {
  DELETE_CHANNEL_DATA,
  GET_CHANNEL_LIST,
  POST_CHANNEL_DATA,
  PUT_CHANNEL_DATA,
} from "../../utils/apiEndpoints";
import api from "../api";

const channelApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getChannelsList: build.query({
      query: ({ isBrandSpecific, brandId } = {}) => {
        const queryParams = {};

        if (isBrandSpecific && brandId) {
          queryParams.brandId = brandId;
        }

        return {
          url: GET_CHANNEL_LIST,
          params: queryParams,
        };
      },
      transformResponse: (response) => response?.channelAttrsList,
      transformErrorResponse: (response) => {
        showToast(
          response?.message || "Failed to fetch channels list",
          "error"
        );
        return response;
      },
      providesTags: ["Channels"],
    }),
    getChannelData: build.query({
      query: (id) => {
        return {
          url: GET_CHANNEL_LIST,
          params: {
            channelId: id,
          },
        };
      },
      transformResponse: (response) => response?.channelAttrs,
      transformErrorResponse: (response) => {
        showToast(response?.message || "Failed to fetch channel data", "error");
        return response;
      },
      providedTags: ["Channel"],
    }),
    addChannelData: build.mutation({
      query: (data) => ({
        url: POST_CHANNEL_DATA,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        if (response?.status) {
          showToast(
            response?.message || "Channel Configuration added successfully",
            "success"
          );
        } else {
          showToast(
            response?.errorMessage ||
              "Something went wrong while adding channel",
            "error"
          );
        }

        return response;
      },
      transformErrorResponse: (response) => {
        showToast(
          response?.message || "Something went wrong while adding channel",
          "error"
        );
        return response;
      },
      invalidatesTags: ["Channels"],
    }),
    deleteChannelData: build.mutation({
      query: (channels) => ({
        url: DELETE_CHANNEL_DATA,
        method: "DELETE",
        body: channels,
        // params: {
        //   channelId: channel?.id,
        //   channelName: channel?.channelName,
        // },
      }),
      
      transformResponse: (response) => {
        showToast(
          response?.message || "Channel Configuration deleted successfully",
          "success"
        );
        return response;
      },
      transformErrorResponse: (response) => {
        showToast(
          response?.message || "Something went wrong while deleting channel",
          "error"
        );
        return response;
      },
      invalidatesTags: ["Channels"],
    }),
    updateChannelData: build.mutation({
      query: ({ id, data }) => {
        return {
          url: PUT_CHANNEL_DATA,
          method: "PUT",
          body: data,
          params: {
            channelId: id,
          },
        };
      },
      transformResponse: (response) => {
        if (response?.status === false) {
          showToast(
            response.errorMessage || "Something went wrong while updating channel",
            "error"
          );
        } else {
          showToast(
            response?.message || "Channel Configuration Updated successfully",
            "success"
          );
        }
        return response;
      },
      transformErrorResponse: (response) => {
        showToast(
          response?.message || "Something went wrong while updating channel",
          "error"
        );
        return response;
      },
      invalidatesTags: ["Channels", "Channel"],
    }),
  }),
});

export const {
  useGetChannelsListQuery,
  useGetChannelDataQuery,
  useDeleteChannelDataMutation,
  useUpdateChannelDataMutation,
  useAddChannelDataMutation,
} = channelApi;

export { channelApi };
