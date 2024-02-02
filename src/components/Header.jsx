import React from "react";
import { Logo, User } from "../images";
import { Link, Outlet, useLocation } from "react-router-dom";
import { navItem } from "./data";
import EndOrder from "../interface/Kassa/EndOrder";

const Header = () => {
  const location = useLocation();
  const account = localStorage.getItem("auth");
  const nav = navItem("/" + account);

  return (
    <>
      <nav id="header" className="bg-primary flex items-center z-50 ">
        <div className="container w-10/12 mx-auto text-cText flex items-center">
          <Link to={`/${account}`} state={`${account}`}>
            <img className="w-[200px] h-[80px] mt-3" src={Logo} alt="" />
          </Link>
          <ul
            className={`${
              location.pathname === "/login" ? "hidden" : "flex"
            } ml-32 gap-8`}
          >
            {nav?.items.map((navs) => (
              <li key={navs.name}>
                <Link
                  to={"/" + account + navs.path}
                  state={"/" + account + navs.path}
                >
                  {navs.name}
                </Link>
              </li>
            ))}
            {/* <Example /> */}
          </ul>
          <span
            onClick={() => {
              localStorage.removeItem("auth")
              window.location.reload()
            }}
            className={`${
              location.pathname === "/login" ? "hidden" : "flex"
            } ml-auto justify-end items-center cursor-pointer gap-3 w-[100px]`}
          >
            <p>{account?.charAt(0)?.toUpperCase() + account?.slice(1)}</p>{" "}
            <img className="w-[40px]" src={User} alt="" />
          </span>
          <span className="ml-10">
            <EndOrder />
          </span>
        </div>
      </nav>
      <Outlet></Outlet>
    </>
  );
};

export default Header;
