const API_ENDPOINTS = {
  //   flask api
  GET_USER_PROFILE: "/dashboard/profile/get/user",

  //   spring-boot api
};
export default API_ENDPOINTS;

//dashboard end points

//Flask Server Endpoint
export const GET_AUTH_USER_PROFILE = "/auth/user/profile";
export const GET_PERSONA_LIST = "/dashboard/hypertarget/list/personas";
export const POST_ADD_PERSONA = "/dashboard/hypertarget/add/persona";
export const PUT_COMPLIANCE_PRODUCT = "/compliance/product/v1";
export const GET_COMPLIANCE_FILES = "/compliance/files";
export const GET_SAMPLE_COMPLIANCE_FILES = "/compliance/sample-data";
export const POST_SPLITTER_RESET = "/compliance/splitter/reset";
export const POST_IMAGE_RECOGNITION = "/img/image/recognition";
export const GET_ACCOUNT_PARAMETERS = "/standalone/show/account_parameters";
export const GET_CLOUD_INFO = "/cloudService/cloud/information";
export const GET_MODELS_LIST = "/cloudService/llm/list";
export const SAVE_CLOUD_DETAILS = "/cloudService/save/cloud/details";
export const OPERATE_CLOUD_INSTANCE = "/cloudService/operate/cloud/instance";
export const CLOUDSERVICE_CLOUD_VERIFY_CREDENTIALS =
  "/cloudService/cloud/verify/credentials";
export const CLOUD_SERVICE_PEM = "/cloudService/download/pem";
export const PRODUCT_SEO_SUGGESTION = "/content/seo_suggestions";
export const GET_CLOUD_AWS_REGIONS = "/cloudService/cloud/aws/regions";
export const FETCH_EXISTING_BRAND_VOICE_FILE = "/standalone/fetch/brand_voice_file_fetch";
export const UPLOAD_BRAND_VOICE_FILE = "/standalone/upload/brand_voice_file_upload";
export const DELETE_BRAND_VOICE_FILE = "/standalone/delete/brand_voice_file";
export const INVITE_VALIDATION = "/auth/accept/invite/";

//Spring-boot Server Endpoint
export const ADD_LLM_KEY = "/dashboard/env/settings/add/llm/key";
export const GET_USER_PROFILE = "/dashboard/profile/get/user";
export const UPDATE_USER_PROFILE = "/dashboard/profile/user/update";
export const GET_ANALYTICS = "/dashboard/get/analytics";
export const GET_DOCUMENTS_V2 = "/dashboard/get/document/v2";
export const POST_ANALYZE_DESCRIPTION = "/adsense/analyze_description";
export const POST_SAVE_PRODUCTS = "/dashboard/save/products";
export const GET_DOCUMENTS_LIST_V2 = "/dashboard/get/documents/list/v2";
export const GET_FAVOURITE_LIST = "/dashboard/get/favourite/list";
export const POST_DELETE_DOCUMENT = "/dashboard/delete/document";
export const POST_STAR_DOCUMENT = "/dashboard/star/document";
export const GET_DOCUMENTS_LIST = "/dashboard/get/favourite/list";
export const POST_UPDATE_DOCUMENT = "/dashboard/update/document";
export const POST_SHARE_DOCUMENTS_V2 = "/dashboard/share/documents/v2";
export const GET_ACTIVITY_LIST = "/dashboard/admin/check/user/activities";
export const POST_CHECK_USER_ACTIVITIES =
  "/dashboard/admin/check/user/activities";
export const GET_FETCH_USERS = "/dashboard/user/fetch_users";
export const POST_ADD_USERS = "/dashboard/user/add_users";
export const POST_DISABLE_USER = "/dashboard/user/disable_user";
export const POST_EDIT_USER_ROLE = "/dashboard/user/edit/user_role";
export const PUT_TRANSFER_DOCUMNET_OWNER = "/dashboard/transfer/document/owner";
export const POST_CONTACT_SUPPORT = "/dashboard/contact/support";
export const POST_INTEGRATION = "/dashboard/integration";
export const PAID_INTEGRATION = "/dashboard/save/paid/integration"
export const GET_INTEGRATION = "/client/register";
export const POST_ADD_BRAND = "/dashboard/profile/add/brand";
export const POST_UPDATE_BRAND = "/dashboard/profile/update/brand";
export const GET_USER_BRANDS_LIST = "/dashboard/profile/list/brands";
export const SAVE_BRAND_VOICE = "/dashboard/save/brand-voice";
export const CREATE_BRAND_VOICE = "/standalone/create/brand_voice";
export const GET_BRAND_VOICE = "/dashboard/fetch/brand-voice";
export const UPDATE_BRANDS_TO_USER = "/dashboard/profile/user/update/brand";
export const POST_FILE_UPLOAD = "/dashboard/file/upload";
export const POST_ENV_SETTINGS_ADD_LLM_KEY =
  "/dashboard/env/settings/add/llm/key";
export const DELETE_INTEGRATION = "/dashboard/delete/integration";
/* Channels */
export const GET_CHANNEL_LIST = "/dashboard/channel/list";
export const POST_CHANNEL_DATA = "/dashboard/channel/add";
export const PUT_CHANNEL_DATA = "/dashboard/channel/update";
export const DELETE_CHANNEL_DATA = "/dashboard/channel/delete";
export const GET_CHANNEL_DATA = "/dashboard/channel/get";

//walmart end points
export const POST_AUTH_LOGIN = "/auth/login";
export const GET_ITEM_LIST = "/item-list";
export const POST_UPLOAD_SEO_KEYWORDS = "/upload/seo-keywords";
export const POST_FETCH_SEO_KEYWORDS = "/fetch/seo-keywords";

//adsense apis
export const POST_GENERATE_KEYWORDS = "/adsense/generate_keywords";
export const POST_TRACK_KEYWORDS = "/content/track_seo";
export const GET_TRACK_VOLUME = "/content/track_volume";
export const GET_SEO_REPORT = "/content/get_seo_report";

export const POST_ANALYZE_INDUSTRY_GENERATE_KEYWORDS =
  "/adsense/analyze_industry_and_generate_keywords";
export const GET_TWITTER_TRENDS = "/adsense/twitter_trends";
//compliance get and put endpoints
export const CONFIG_GET_API = "/compliance/get/config";
export const CONFIG_PUT_API = "/compliance/save/config";
