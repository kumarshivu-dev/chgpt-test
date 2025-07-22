// utils/cookies.js
import Cookies from "js-cookie";

// Set a cookie
export const setCookie = (name, value, options = {}) => {
  Cookies.set(name, value, { ...options });
};

// Get a cookie
export const getCookie = (name) => {
  return Cookies.get(name);
};

// Remove a cookie
export const removeCookie = (name) => {
  Cookies.remove(name);
};
