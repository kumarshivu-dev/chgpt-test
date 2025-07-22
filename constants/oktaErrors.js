export const ERROR_MESSAGES = {
    okta_not_registered: (email) =>
        `We couldn’t verify your identity because your organization is not registered with us. 
        Please contact us at <a href="mailto:${email}">${email}</a> to register before using Okta authentication on our platform.`,

    okta_contact_support: (email) =>
        `Your organization needs approval before using Okta authentication. 
        Please contact us at <a href="mailto:${email}">${email}</a> to proceed.`,

    okta_invalid_credentials: "The credentials you provided are invalid. Please check your details and try again.",
    okta_access_denied: "Access denied. You don’t have permission to log in using Okta.",
    default: "An unknown authentication error occurred. Please try again later or contact support.",
};
