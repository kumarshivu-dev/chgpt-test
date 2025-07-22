import React, { createContext, useState, useContext } from "react";

const FilenameContext = createContext();

// Custom hook for easier usage
export const useFilename = () => useContext(FilenameContext);

export const FilenameProvider = ({ children }) => {
  const [isFilenameExists, setIsFilenameExists] = useState(false);

  return (
    <FilenameContext.Provider value={{ isFilenameExists, setIsFilenameExists }}>
      {children}
    </FilenameContext.Provider>
  );
};
