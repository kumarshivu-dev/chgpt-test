import { useMemo } from "react";
import { useSelector } from "react-redux";
import { LANGUAGES, ENTERPRISE_PLAN } from "../../constants/globalvars";

export const useBrandDisplay = () => {
  // Get required state from Redux
  const userState = useSelector((state) => state.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const userBrands = userState?.userBrands;
  const orgName = userState?.userInfo?.company;
  const orgUrl = userState?.userInfo?.websiteUrl;
  // Memoize the display name calculation
  const displayName = useMemo(() => {
    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      const brand = userBrands?.find(
        (brand) => brand.brand_id === brandSpecification.brandId
      );
      return brand?.name || null; // Return null if brand not found
    } else if (brandSpecification?.brandSpecific === false) {
      return orgName || null; // Return null if orgName is falsy
    }
    return null;
  }, [brandSpecification, userBrands, orgName]);

  // Memoize the brand URL calculation
  const brandUrl = useMemo(() => {
    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      const brand = userBrands?.find(
        (brand) => brand.brand_id === brandSpecification.brandId
      );
      return brand?.website_url || null;
    } else if (brandSpecification?.brandSpecific === false) {
      return orgUrl || null; // Return null if orgName is falsy
    }
    return null;
  }, [brandSpecification, userBrands]);

  const brandLanguages = useMemo(() => {
    const userPlan = userState?.userPlan; 
    const planType = userPlan?.split("-").slice(0, 2).join("-"); 
    if (planType !== ENTERPRISE_PLAN) return LANGUAGES;
  
    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      const brand = userBrands?.find(brand => brand?.brand_id === brandSpecification?.brandId);
      return brand?.Languages?.length ? [...new Set(brand.Languages)] || LANGUAGES : LANGUAGES;
    } 
  
    if (userState?.userInfo?.brandSpecific) {
      return userState?.userBrands?.[0]?.Languages || LANGUAGES;
    } 
    return userState?.userInfo?.allowedLanguage || LANGUAGES;
  }, [brandSpecification, userBrands, userState]);
  

  const defaultLanguage = useMemo(() => {
    const userInfo = userState?.userInfo;
    if (!userInfo) {
      return undefined; // Keep it undefined instead of null!
    }
    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      return userInfo?.brandLanguagePreferences
        ? userInfo?.brandLanguagePreferences[brandSpecification?.brandId]
        : null;
    }
    if (userState?.userInfo?.brandSpecific === true) {
      const brand_id = userState?.userBrands?.[0]?.brand_id;
      return userInfo?.brandLanguagePreferences
        ? userInfo?.brandLanguagePreferences[brand_id]
        : null;
    }
    return userInfo?.orgDefaultLanguage || null;
  }, [brandSpecification, userState?.userInfo]);

  // const defaultLanguage = useMemo(() => {
  //   const userInfo = userState?.userInfo;
  //   if (!userInfo) return undefined; // Keep it undefined instead of null!

  //   if (userInfo?.brandSpecific === true) {
  //     const brandId = brandSpecification?.brandSpecific
  //       ? brandSpecification?.brandId
  //       : userState?.userBrands?.[0]?.brand_id;
  //     const brandLang = brandId
  //       ? userInfo?.brandLanguagePreferences?.[brandId]
  //       : null;

  //     return brandLang || null;
  //   }

  //   return userInfo?.orgDefaultLanguage || null;
  // }, [brandSpecification, userState?.userInfo]);
  

  // Return both display name and URL
  return {
    displayName,
    brandUrl,
    isSpecificBrand: !!brandSpecification?.brandSpecific,
    brandSpecification,
    brandId: brandSpecification?.brandId,
    isActive:
      userBrands?.find(
        (brand) => brand.brand_id === brandSpecification?.brandId
      )?.status === "active",
    brandLanguages,
    defaultLanguage,
  };
};