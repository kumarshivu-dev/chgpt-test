import axios from "axios";

const trackActivity = async (
  action,
  filename,
  user,
  editor_email,
  orgId,
  changed_role,
  number_of_products,
  changed_chunking_type,
  brandIds,
  brand_invited_to = [],
  brand_invited_user = [],
  updatedBrand = null
) => {
  const data = {
    action: action,
    filename: filename,
    orgId: user?.org_id,
    userId: user?.userId || user?.user_id,
    editor_user_mail: editor_email,
    op_status: "success",
    orgId: orgId || user?.org_id,
    changed_plan: changed_role || null,
    numberOfCompliantProducts: number_of_products,
    changedChunkingType: changed_chunking_type,
    brandIds: brandIds,
  };
  if (updatedBrand) {
    data.updatedBrand = updatedBrand;
    data.op_status = "failed";
  }
  if (action === "USER_INVITATION_BRAND") {
    data.BrandInvitedUser = brand_invited_user;
    data.BrandInvitedTo = brand_invited_to;
  }

  // console.log("Tracking data in helper function:", data);
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + "/dashboard/log/activity",
      data,
      {
        headers: {
          Authorization: user?.id_token,
        },
      }
    );
    // console.log("Response after tracking activity:", response.data);
    return response?.data;
  } catch (error) {
    console.error("Error while tracking activity:", error);
  }
};

export default trackActivity;
