export const BIG_COMMERCE = "Big Commerce";
export const LANGUAGES = ["English (UK)", "English (US)", "French", "German", "Hindi", "Spanish"];
export const ENTERPRISE_PLAN = "chgpt-enterprise";

export const SALSIFY = "Salsify";
export const API = "api";
export const SHOPIFY = "Shopify";
export const COUNTRY_AMERICA ="United States";
export const PLATFORM_DEFAULT ="English";

export const INTEGRATIONTYPES = [
  {
    type: SALSIFY,
    label: "Organization Id",
    placeholder: "No Salsify integration",
    metaKey: "organization_id",
  },
  {
    type: BIG_COMMERCE,
    label: "Store Hash",
    placeholder: "No Big Commerce integration",
    metaKey: "storeHash",
  },
  {
    type: SHOPIFY,
    label: "Store Id",
    placeholder: "No Shopify Integration",
    metaKey: "store-id",
  },
  {
    type: API,
    label: "Client Id",
    placeholder: "No API integration",
    metaKey: "clientId",
  },
];

export const CONFIRMATIONMSG = {
  confirmintegration: (integrationType) =>
    `Are you sure you want to integrate with ${integrationType}?`,
  confirmintegrationwithid: (idName, idValue, integrationType) =>
    `Are you sure you want to integrate ${idName}: ${idValue} with ${integrationType}?`,
};
