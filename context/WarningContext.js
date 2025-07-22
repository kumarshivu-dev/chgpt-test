import { createContext, useContext, useState } from "react";

const WarningContext = createContext();

export const useWarning = () => useContext(WarningContext);

export const WarningProvider = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <WarningContext.Provider value={{ showWarning, setShowWarning }}>
      {children}
    </WarningContext.Provider>
  );
};
