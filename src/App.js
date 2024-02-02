import React, { useEffect, useState } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Admin from "./interface/Admin/Layout";
import Boss from "./interface/Boss/Layout";
import Kassa from "./interface/Kassa/Layout";
import Sklad from "./interface/Sklad/Layout";
import Clients from "./interface/Kassa/Clients";
import CreateClient from "./interface/Kassa/CreateClient";
import Aside from "./components/Aside";
import Home from "./Home";
import AllClients from "./interface/Kassa/AllClients";
import Come from "./interface/Kassa/Return";
import Order from "./interface/Kassa/Order";
import Reports from "./interface/Admin/Reports";
import OrdersSklad from "./interface/Sklad/OrdersSklad";
import ColorSklad from "./interface/Sklad/ColorSklad";
import ListOrders from "./interface/Sklad/ListOrders";
import AddProduct from "./interface/Sklad/AddProduct";
import ComeProduct from "./interface/Sklad/ComeProduct";
import Remaining from "./interface/Sklad/Remaining";
import MenuBoss from "./interface/Boss/MenuBoss";
import YearReport from "./interface/Admin/YearReport";
import MonthReport from "./interface/Admin/MonthReport";
import { useMyContext } from "./context/Context";
import axios from "axios";
import { Cancel, createData } from "./images";
import DayReport from "./interface/Admin/DayReport";
import UserReport from "./interface/Admin/UserReport";

function App() {
  const navigate = useNavigate();
  const { endData, endPopup, setEndPopup, setEndData } = useMyContext();
  const [orderData, setOrderData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(false);
  const [handlePaidSum, setHandlePaidSum] = useState("");

  useEffect(() => {
    if (window.innerWidth < 1350) {
      setWindowWidth(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    const ordersApi = "http://127.0.0.1:5000/orders/all_orders";
    axios
      .get(ordersApi)
      .then((response) => {
        setOrderData(
          response.data.filter((order) => Number(order.order_id) === Number(endData))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [endData]);

  useEffect(() => {
    const authUser = localStorage.getItem("auth");
    const currentPath = window.location.pathname;

    if (authUser) {
      if (currentPath === "/") {
        navigate(`/${authUser}`);
      }
    } else {
      if (currentPath !== "/login") {
        navigate("/login");
      }
    }
  }, [navigate]);

  const PrivateRoute = ({ element, path }) => {
    const authUser = localStorage.getItem("auth");
    if (!authUser) {
      navigate("/login");
      return null;
    }

    return React.cloneElement(element, { path });
  };

  if (windowWidth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-4xl">Размер вашего устройства мал 🙁</p>
      </div>
    );
  }

  const submitPaid = (e) => {
    e.preventDefault();
    const apiUrl = `http://127.0.0.1:5000/paymethod/${Number(endData)}`;
    const reqPaidAmount = new FormData();
    reqPaidAmount.append("paid", `${handlePaidSum}`);

    axios
      .patch(apiUrl, reqPaidAmount, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("PATCH request successful", response.data);
      })
      .catch((error) => {
        console.error("Error making PATCH request", error);
      });

    setEndPopup(false);
    setEndData(null);
    setHandlePaidSum("");
  };

  if(!orderData || orderData === null) {
    return <p>Loading...</p>
  }

  return (
    <>
      <main id="main" className="text-third h-screen relative">
        <Header />
        <Aside />
        <section
          id="section"
          className="pb-5 col-span-3 row-span-4 overflow-y-scroll "
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={<PrivateRoute element={<Admin />} />}
            />
            <Route
              path="/kassa"
              element={<PrivateRoute element={<Kassa />} />}
            />
            <Route
              path="/kassa/clients"
              element={<PrivateRoute element={<Clients />} />}
            />
            <Route
              path="/kassa/clients/create-client"
              element={<PrivateRoute element={<CreateClient />} />}
            />
            <Route
              path="/kassa/clients/:clientPath"
              element={<PrivateRoute element={<AllClients />} />}
            />
            <Route
              path="/kassa/return"
              element={<PrivateRoute element={<Come />} />}
            />
            <Route
              path="/kassa/order"
              element={<PrivateRoute element={<Order />} />}
            />
            {/* <Route
              path="/kassa/order-2"
              element={<PrivateRoute element={<OrderProcess2 />} />}
            /> */}
            <Route path="/boss" element={<PrivateRoute element={<Boss />} />} />
            <Route
              path="/boss/menu"
              element={<PrivateRoute element={<MenuBoss />} />}
            />
            <Route
              path="/sklad"
              element={<PrivateRoute element={<Sklad />} />}
            />
            <Route
              path="/sklad/request"
              element={<PrivateRoute element={<OrdersSklad />} />}
            />
            <Route
              path="/sklad/request/:id"
              element={<PrivateRoute element={<ColorSklad />} />}
            />
            <Route
              path="/sklad/orders"
              element={<PrivateRoute element={<ListOrders />} />}
            />
            <Route
              path="/sklad/add-product"
              element={<PrivateRoute element={<AddProduct />} />}
            />
            <Route
              path="/sklad/coming"
              element={<PrivateRoute element={<ComeProduct />} />}
            />
            <Route
              path="/sklad/remaining"
              element={<PrivateRoute element={<Remaining />} />}
            />
            <Route
              path="/admin"
              element={<PrivateRoute element={<Admin />} />}
            />
            <Route
              path="/admin/reports"
              element={<PrivateRoute element={<Reports />} />}
            >
              <Route
                path=":year"
                element={<PrivateRoute element={<YearReport />} />}
              />
              <Route
                path=":year/:month"
                element={<PrivateRoute element={<MonthReport />} />}
              />
              <Route
                path=":year/:month/:day"
                element={<PrivateRoute element={<DayReport />} />}
              />
              <Route
                path=":year/:month/:day/:user"
                element={<PrivateRoute element={<UserReport />} />}
              />
            </Route>
          </Routes>
        </section>
        <Footer />
        <div
          onClick={() => {
            setEndPopup(false);
            setEndData(null);
            setHandlePaidSum("");
          }}
          className={`${
            endPopup ? "block" : "hidden"
          } absolute w-screen h-screen bg-black/40`}
        ></div>
        <form
          className={`${
            endPopup ? "block" : "hidden"
          } px-8 absolute m-auto inset-0 w-[400px] max-h-[300px] rounded-md bg-forth shadow-md`}
        >
          {endData && orderData && (
            <ul className="flex justify-center items-center gap-1 flex-col h-full text-sm text-center">
              <li className="text-xl font-semibold">Оплата</li>
              <li className="mt-3">Долг</li>
              <li className="bg-white w-full py-1 rounded-md">
                {orderData[0]?.all_price}
              </li>
              <li>Оплачена</li>
              <li className="w-full">
                <input
                  type="number"
                  className="w-full py-1 rounded-md text-center"
                  onChange={(e) => setHandlePaidSum(e.target.value)}
                />
              </li>
              <li className="flex flex-col justify-center items-center gap-2 w-full">
                <button
                  className="flex items-center justify-center rounded-md w-1/2 text-sm p-1 gap-2 mt-3 bg-fifth "
                  type="submit"
                  onClick={(e) => submitPaid(e)}
                >
                  <img src={createData} alt="" /> <p>Подтвердить</p>
                </button>
                <button
                  onClick={() => {
                    setEndPopup(false);
                    setEndData(null);
                    setHandlePaidSum("");
                  }}
                  className="flex items-center justify-center rounded-md w-1/2 text-sm p-1 gap-2 bg-fifth "
                >
                  <img src={Cancel} alt="" /> <p>Отменить</p>
                </button>{" "}
              </li>
            </ul>
          )}
        </form>
      </main>
    </>
  );
}

export default App;
