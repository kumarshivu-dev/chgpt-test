import freeEmailDomains from "free-email-domains";

// validate website URL utility function
export const isValidWebsiteUrl = (websiteUrl) => {
  try {
    const url = new URL(websiteUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") 
      return false;
    if (!url.hostname) 
      return false;

    const hostnamePattern = /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;

    return hostnamePattern.test(url.hostname) || localhostOrIPPattern.test(url.hostname);
  } catch {
    return false;
  }
};


export const ValidWebsiteUrl = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
export const WeblinkValidationUrl = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;


// validate email utility function
export const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

// free domain utility function
export const isFreeEmailDomain = (email) => {
  const domain = email.split("@")[1];
  return freeEmailDomains.includes(domain);
};
