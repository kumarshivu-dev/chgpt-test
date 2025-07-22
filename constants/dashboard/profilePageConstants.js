export const planImagesFull = {
  "chgpt-free": "/dashboard/Free_Badge_Full.svg",
  "chgpt-free-monthly": "/dashboard/Free_Badge_Full.svg",
  "chgpt-basic": "/dashboard/Basic_Badge_Full.svg",
  "chgpt-basic-monthly": "/dashboard/Basic_Badge_Full.svg",
  "chgpt-essentials": "/dashboard/Essentials_Badge_Full.svg",
  "chgpt-essentials-monthly": "/dashboard/Essentials_Badge_Full.svg",
  "chgpt-premium": "/dashboard/Premium_Badge_Full.svg",
  "chgpt-premium-monthly": "/dashboard/Premium_Badge_Full.svg",
  "chgpt-enterprise": "/dashboard/Enterprise_Badge_Full.svg",
  "chgpt-enterprise-burco": "/dashboard/Enterprise_Badge_Full.svg",
};

export const departments = [
  {
    value: "Administration",
    label: "Administration",
  },
  {
    value: "IT",
    label: "IT",
  },
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Operations",
    label: "Operations",
  },
  {
    value: "Product Management",
    label: "Product Management",
  },
  {
    value: "Sales",
    label: "Sales",
  },
  {
    value: "Other",
    label: "Other",
  },
];

export const personalInfoFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text", disabled: true },
  { name: "phone", label: "Phone", type: "phone" },
  { name: "country", label: "Country", type: "select" },
  { name: "defaultLanguage", label: "Default Language", type: "select" },
];

export const companyInfoFields = [
  { name: "company", label: "Company Name", type: "text" },
  { name: "websiteUrl", label: "Website", type: "text" },
  {
    name: "department",
    label: "Department",
    type: "select",
    options: departments,
  },
  {
    name: "companyMail",
    label: "Company Email",
    type: "email",
  },
];

export const COUNTRY_NAME_FIXES = {
  "Iran, Islamic Republic of": "Islamic Republic of Iran",
  "Korea, Democratic People's Republic of":
    "Democratic People's Republic of Korea",
  "Korea, Republic of": "Republic of Korea",
  "Bolivia, Plurinational State of": "Plurinational State of Bolivia",
  "Bonaire, Sint Eustatius and Saba": "Sint Eustatius, Bonaire and Saba",
  "Micronesia, Federated States of": "Federated States of Micronesia",
  "Congo, Democratic Republic of the": "Democratic Republic of the Congo",
  "Moldova, Republic of": "Republic of Moldova",
  "Palestine, State of": "State of Palestine",
  "Tanzania, United Republic of": "United Republic of Tanzania",
  "Venezuela, Bolivarian Republic of": "Bolivarian Republic of Venezuela",
};
