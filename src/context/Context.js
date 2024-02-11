// MyContext.js
import React, { createContext, useContext, useState } from "react";

const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [endData, setEndData] = useState(null);
  const [endPopup, setEndPopup] = useState(false);
  const [userHistory, setUserHistory] = useState(null);
  const [reconUser, setReconUser] = useState(null);
  const f = new Intl.NumberFormat("ru-Ru");

  function formatPhoneNumber(phoneNumber) {
    const numericPhoneNumber = phoneNumber.replace(/\D/g, "");

    const formattedPhoneNumber = `+${numericPhoneNumber.slice(
      0,
      3
    )} (${numericPhoneNumber.slice(3, 5)}) ${numericPhoneNumber.slice(
      5,
      8
    )}-${numericPhoneNumber.slice(8, 10)}-${numericPhoneNumber.slice(10)}`;

    return formattedPhoneNumber;
  }

  return (
    <MyContext.Provider
      value={{
        endData,
        setEndData,
        endPopup,
        setEndPopup,
        userHistory,
        setUserHistory,
        f,
        formatPhoneNumber,
        reconUser,
        setReconUser,
      }}
    >
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
