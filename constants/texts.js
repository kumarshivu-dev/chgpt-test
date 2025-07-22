// constants/texts.js

export const resultPageText = "You can edit the results on this page before Saving and Exporting";
export const productPageText = "You can either enter the data manually to check how the products work. Or you can use your own file by clicking on 'Import' button. Once ready, click <b>Generate</b> to proceed.";
export const defaultPageText = "You can either enter the data manually or you can use your own file by clicking on 'Import' button. Once ready, click <b>Generate</b> to proceed.";
export const CLOUD_TNC_AMAZON_SERVICES = "https://aws.amazon.com/service-terms/";
export const LLM_TNC_LLM_SERVICES ="https://www.llama.com/llama3_1/use-policy/";
export const AWS_SERVICE_TERMS_URL = "https://aws.amazon.com/service-terms/";
export const contentHubDescription = `ContentHubGPT empowers marketers to craft compelling product stories\nby creating content that maintains brand voice consistency across all\nchannels. It is optimized for SEO, tailored to individual personas, and\nensures compliance with both internal and external policies.`;
export const contentHubDescriptionMobile =`ContentHubGPT empowers marketers/eto craft compelling product stories by/e creating content that maintains brand/e voice consistency across all channels. It/e is optimized for SEO, tailored to/eindividual personas, and ensures/e compliance with both internal and/e external policies.`
export const ACTIVITY_DESCRIPTIONS = {
    EDITOR: "This section shows your recent content-related activities, including edits, submissions, and updates you’ve made. Access is limited to your own actions",
    DEFAULT: "Stay updated with our 'Activities' feature, providing a snapshot of your latest interactions and engagements in one convenient view."
  };
export const GET_VALIDATION_RULES = (minLength, maxLength) => [
    {
      condition: minLength < 50,
      message: "Minimum length must be 50 or greater.",
    },
    {
      condition: maxLength < 100,
      message: "Maximum length must be 100 or greater.",
    },
    {
      condition: minLength >= maxLength,
      message: "Minimum length must be less than maximum length.",
    },
  ];