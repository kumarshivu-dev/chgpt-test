import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";

export const useResponsiveBreakpoints = () => {
  const theme = useTheme();
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isNormalZoom, setIsNormalZoom] = useState(false);

  useEffect(() => {
    const getNormalizedZoom = () => {
      const baseDPR = window.devicePixelRatio >= 2 ? 2 : 1;
      const zoom = window.devicePixelRatio / baseDPR;
      return Math.round(zoom * 100) / 100;
    };

    const checkZoom = () => {
      const zoomLevel = getNormalizedZoom();

      // Flag zoom only if it's significantly outside the range
      const isZoomed = zoomLevel > 1.35 || zoomLevel < 0.85;
      const isNormalZoom = zoomLevel >= 0.95 && zoomLevel <= 1.05;

      setIsZoomed(isZoomed);
      setIsNormalZoom(isNormalZoom);
    };

    const checkBreakpoints = () => {
      if (!theme?.breakpoints) return;

      const isMobileQuery = window.matchMedia(
        theme.breakpoints.down("sm").replace("@media", "")
      ).matches;
      const isTabletQuery = window.matchMedia(
        theme.breakpoints.between("sm", "md").replace("@media", "")
      ).matches;

      setIsMobile(isMobileQuery);
      setIsTablet(isTabletQuery);
    };

    const handleResize = () => {
      checkZoom();
      checkBreakpoints();
    };

    // Initial call
    handleResize();

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return { isMobile, isTablet, isZoomed, isNormalZoom };
};
