import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { clientData, navItem } from "./data";

const Aside = () => {
  const account = localStorage.getItem("auth");
  const nav = navItem("/" + account);
  const location = useLocation();
  const boldPaths = ["/kassa/order-2"];
  const arr = [
    "/kassa/clients/create-client",
    "/kassa/clients/all-client",
    "/kassa/clients/wait-client",
    "/kassa/clients/spam-client",
  ];

  const isSecondUlVisible = () => {
    return arr.some((path) => location.pathname.startsWith(path));
  };

  return (
    <>
      <aside id="aside" className={`bg-forth mx-5 shadow-asideSh shadow-fifth`}>
        <ul
          className={`w-9/12 mx-auto mt-12 flex-col gap-4 ${
            isSecondUlVisible() ? "hidden" : "flex"
          }`}
        >
          {nav?.items.map((navs) => (
            <li key={navs.name}>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "black" : "",
                    fontWeight:
                      isActive ||
                      (boldPaths.includes(location.pathname) &&
                        navs.path === "/order-1")
                        ? 600
                        : "",
                  };
                  // location.pathname === "/kassa/order-2" ? "text-black, font-[600]": ""
                }}
                to={"/" + account + navs.path}
                className={`flex gap-2 `}
              >
                <img
                  className={`inline w-[22px] h-6 ${
                    navs.name === "Клиенты" && "w-[24px] h-[24px]"
                  }`}
                  src={navs.icon}
                  alt=""
                />
                <p className="inline">{navs.name}</p>
              </NavLink>
            </li>
          ))}
        </ul>
        <ul
          className={`w-9/12 mx-auto mt-12 flex-col gap-3 ${
            isSecondUlVisible() ? "flex" : "hidden"
          }`}
        >
          {clientData.map((navs) => (
            <li key={navs.id}>
              <NavLink
                style={({ isActive }) => {
                  return {
                    color: isActive ? "black" : "",
                    fontWeight: isActive ? 600 : 400,
                  };
                }}
                to={"/" + account + navs.path}
                className={`flex gap-2`}
              >
                <img
                  className={`inline w-[24px] h-6 ${
                    navs.title === "Клиенты" && "h-5"
                  }`}
                  src={navs.icon}
                  alt=""
                />
                <p className="inline">{navs.title}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Aside;
