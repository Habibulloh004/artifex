// MyContext.js
import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [endData, setEndData] = useState(null);
  const [endPopup, setEndPopup] = useState(false);

  return (
    <MyContext.Provider value={{ endData, setEndData, endPopup, setEndPopup}}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
