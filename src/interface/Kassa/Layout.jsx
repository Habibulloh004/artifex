import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../components/data";

const Layout = () => {
  const location = useLocation();
  const account = localStorage.getItem("auth");
  const nav = navLinks.find((nav) => nav.role === location.pathname);

  return (
    <div className="relative">
      <main>
        <div className="container w-9/12 mx-auto mt-12">
          <p className="text-3xl">
            Добро <br /> пожаловать в <br /> ARTIFEX
          </p>
          <ul className="flex mt-12 gap-4">
            {nav?.items.map((navs) => (
              <li key={navs.name}>
                <Link
                  to={"/" + account + navs.path}
                  className="flex flex-col items-center w-20 gap-2"
                >
                  <img
                    className={`w-[30px] h-8 ${
                      navs.name === "Клиенты" && "h-[30px] w-[35px]"
                    }`}
                    src={navs.icon}
                    alt=""
                  />
                  <p className="text-sm font-medium text-center">{navs.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Layout;
