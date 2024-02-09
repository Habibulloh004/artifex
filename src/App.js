import React, { useEffect, useState } from "react";
import { useNavigate, Route, Routes, useLocation } from "react-router-dom";
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
import DayReport from "./interface/Admin/DayReport";
import UserReport from "./interface/Admin/UserReport";
import Cost from "./interface/Kassa/Cost";
import YearProfit from "./interface/Admin/YearProfit";
import Profit from "./interface/Admin/Profit";
import MonthProfit from "./interface/Admin/MonthProfit";
import DayProfit from "./interface/Admin/DayProfit";
import { useMyContext } from "./context/Context";
import { Cancel, createData } from "./images";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import CostReport from "./interface/Sklad/CostReport";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(false);
  const { endData, endPopup, setEndPopup, setEndData, f } = useMyContext();
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState({
    dollar: 0,
    cash: 0,
    terminal: 0,
    card: 0,
    transfers: 0,
    comments: "",
  });
  const [allSumData, setAllSumData] = useState(0);

  useEffect(() => {
    const localItem = localStorage.getItem("auth");
    const windowPath = location.pathname;

    if (!windowPath.startsWith("/" + localItem)) {
      navigate("/" + localItem);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1350) {
      setWindowWidth(true);
    }
  }, [windowWidth]);

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

  useEffect(() => {
    const ordersApi = "http://127.0.0.1:5000/orders/all_orders";
    axios
      .get(ordersApi)
      .then((response) => {
        setOrderData(
          response?.data?.find(
            (order) => Number(order.order_id) === Number(endData?.order_id)
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [endData]);

  const PrivateRoute = ({ element, path }) => {
    const authUser = localStorage.getItem("auth");
    if (!authUser) {
      navigate("/login");
      return null;
    }

    return React.cloneElement(element, { path });
  };

  const handleInputChange = (fieldName, value) => {
    setPaymentData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    setError("");
  };

  console.log(endData);
  useEffect(() => {
    setAllSumData(
      Number(paymentData.cash) +
        Number(paymentData.terminal) +
        Number(paymentData.card) +
        Number(paymentData.transfers)
    );
  }, [paymentData]);


  const submitPaid = async (e) => {
    e.preventDefault();

    const raw = {
      paidDol: Number(paymentData.dollar),
      paidSum:
        Number(paymentData.cash) +
        Number(paymentData.card) +
        Number(paymentData.terminal) +
        Number(paymentData.transfers),
      payMethod: [
        {
          dollar: Number(paymentData.dollar),
          cash: Number(paymentData.cash),
          terminal: Number(paymentData.terminal),
          card: Number(paymentData.card),
          transfers: Number(paymentData.transfers),
        },
      ],
    };

    if(Number(endData.all_priceSum) > Number(raw.paidSum) || Number(endData.all_priceDol) > Number(raw.paidDol)) {
      setError("Введенная сумма большая!")
      return
    }
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(raw), // Ma'lumotlarni JSON formatida jo'natish
      redirect: "follow",
    };

    const apiURL = "http://127.0.0.1:5000/paymethod/" + endData.order_id;

    try {
      // Fetch so'rovni yuborish
      const response = await fetch(apiURL, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json(); // Natijani JSON formatida olish
      console.log(result);
      setEndPopup(false);
      setEndData(null);
      window.location.reload()
    } catch (error) {
      console.log("error", error);
    }
  };  

  if (windowWidth) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-4xl">Размер вашего устройства мал 🙁</p>
      </div>
    );
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
            <Route
              path="/kassa/cost"
              element={<PrivateRoute element={<Cost />} />}
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
              path="/sklad/cost-report"
              element={<PrivateRoute element={<CostReport />} />}
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
            {/* <Route
              path="/admin/profit"
              element={<PrivateRoute element={<Profit />} />}
            >
              <Route
                path=":year"
                element={<PrivateRoute element={<YearProfit />} />}
              />
              <Route
                path=":year/:month"
                element={<PrivateRoute element={<MonthProfit />} />}
              />
              <Route
                path=":year/:month/:day"
                element={<PrivateRoute element={<DayProfit />} />}
              />
            </Route> */}
          </Routes>
        </section>
        <Footer />
        <div
          onClick={() => {
            setEndPopup(false);
            setEndData(null);
            setPaymentData({
              dollar: 0,
              cash: 0,
              terminal: 0,
              card: 0,
              transfers: 0,
              comments: "",
            });
          }}
          className={`${
            endPopup ? "block" : "hidden"
          } absolute w-screen h-screen bg-black/40`}
        ></div>
        <form
          className={`${
            endPopup ? "block" : "hidden"
          } px-8 absolute m-auto inset-0 w-[400px] h-[70%] z-50 rounded-md bg-forth shadow-md`}
        >
          {endData && orderData && (
            <ul className="flex justify-center items-center gap-2 flex-col h-full text-sm text-center">
              <li className="text-xl font-semibold">Сумма заказа</li>
              <li className="mt-3 flex gap-4 w-full justify-around">
                <span className="py-1 px-2 bg-fifth rounded-md">
                  {f.format(orderData?.all_priceSum)} сум
                </span>
                <span className="py-1 px-2 bg-fifth rounded-md">
                  {f.format(orderData?.all_priceDol)} USD
                </span>
              </li>
              <li className="w-full py-1 rounded-md text-xl">Оплата</li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Доллар"
                  className="w-full py-1 px-2 rounded-md"
                  value={paymentData.dollar > 0 ? paymentData.dollar : ""}
                  onValueChange={(value) => {
                    handleInputChange("dollar", value);
                  }}
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Наличные"
                  className="w-full py-1 px-2 rounded-md"
                  value={paymentData.cash > 0 ? paymentData.cash : ""}
                  onValueChange={(value) => {
                    handleInputChange("cash", value);
                  }}
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Терминал"
                  className="w-full py-1 px-2 rounded-md"
                  value={paymentData.terminal > 0 ? paymentData.terminal : ""}
                  onValueChange={(value) => {
                    handleInputChange("terminal", value);
                  }}
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Карта"
                  className="w-full py-1 px-2 rounded-md"
                  value={paymentData.card > 0 ? paymentData.card : ""}
                  onValueChange={(value) => {
                    handleInputChange("card", value);
                  }}
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Перечисления"
                  className="w-full py-1 px-2 rounded-md"
                  value={paymentData.transfers > 0 ? paymentData.transfers : ""}
                  onValueChange={(value) => {
                    handleInputChange("transfers", value);
                  }}
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <CurrencyInput
                  placeholder="Общая сумма"
                  className="w-full py-1 px-2 rounded-md"
                  value={allSumData === 0 ? "" : allSumData}
                  disabled
                  step={0.01}
                  allowDecimals
                  decimalSeparator="."
                  groupSeparator=" "
                  prefix=""
                />
              </li>
              <li className="w-full">
                <textarea
                  placeholder="Комментария"
                  value={paymentData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  className=" w-full rounded-md text-sm p-2 min-h-[50px]"
                ></textarea>
              </li>
              {error && <p className="text-red-500">{error}</p>}

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
                    setPaymentData({
                      dollar: 0,
                      cash: 0,
                      terminal: 0,
                      card: 0,
                      transfers: 0,
                      comments: "",
                    });
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
