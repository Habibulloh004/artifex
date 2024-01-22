import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/sklad/request");
  }, []);
  return <div>sklad</div>;
};

export default Layout;
