export const responsiveSizes = ({ isMobile, isTablet, isZoomed }) => ({
  // Logo sizes
  logo1Width: isZoomed ? 180 : isMobile ? 96 : isTablet ? 240 : 220,
  logo1Height: isZoomed ? 40 : isMobile ? 25.6 : isTablet ? 48 : 48,

  logo2Width: isZoomed ? 170 : isMobile ? 200 : isTablet ? 136 : 180,
  logo2Height: isZoomed ? 37 : isMobile ? 25.6 : isTablet ? 28.8 : 50,

  logo3Width: isZoomed ? 250 : isMobile ? 240 : isTablet ? 280 : 350,
  logo3Height: isZoomed ? 40 : isMobile ? 80 : isTablet ? 50 : 55,

  logo4Width: isZoomed ? 120 : isMobile ? 130 : isTablet ? 120 : 140,
  logo4Height: isZoomed ? 35 : isMobile ? 28 : isTablet ? 28.8 : 38,

  // Image size
  imageWidth: isZoomed ? 320 : isMobile ? 30 : isTablet ? 240 : 480,
  imageHeight: isZoomed ? 280 : isMobile ? 100 : isTablet ? 240 : 340,

  // Bitmap width 
  bitmapWidth: isZoomed ? 300 : isMobile ? 200 : isTablet ? 240 : 470,
});
