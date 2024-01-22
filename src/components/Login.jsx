import React, { useState, useEffect } from "react";
import { Logo2, iLogin } from "../images";
import { authenticateUser } from "./data";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      const authUser = localStorage.getItem("auth");
      navigate(`/${authUser}`);
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const role = authenticateUser(login, password);
    if (role) {
      localStorage.setItem("auth", role);
      navigate(`/${role}`);
    } else {
      setError("Неправильный логин или пароль");
    }
  };

  return (
    <>
      <main className="h-[60vh]">
        <div className="container w-10/12 mx-auto flex gap-20 justify-center h-full items-center">
          <form className="flex flex-col gap-3 items-center">
            <p className="text-4xl leading-tight">
              Добро <br />
              пожаловать в <br /> ARTIFEX
            </p>
            <input
              className="bg-forth rounded px-3 py-1 w-full placeholder:text-primary text-sm"
              placeholder="Логин"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <input
              className="bg-forth rounded px-3 py-1 w-full placeholder:text-primary text-sm"
              placeholder="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-600 text-sm">{error ? error : null}</p>
            <button className="bg-forth rounded px-3 py-1" onClick={handleLogin}>
              <img className="inline mr-2" src={iLogin} alt="" />
              Войти
            </button>
          </form>
          <img className="w-[350px] mb-10" src={Logo2} alt="" />
        </div>
      </main>
    </>
  );
};

export default Login;
