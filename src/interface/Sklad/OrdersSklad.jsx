import React, { useEffect, useState } from "react";
import { Notice } from "../../images";
import axios from "axios";
import { Link } from "react-router-dom";

const Layout = () => {
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const orderApi = "/orders/all_orders";
    const userApi = "/users/all";

    axios
      .get(orderApi)
      .then((response) => {
        setOrders(
          response.data.filter(
            (order) => order.all_price <= 0 
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(userApi)
      .then((response) => {
        const usersMap = {};
        response.data.forEach((user) => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const tableHead = ["№", "Клиент", "Создано в"];

  return (
    <main className="w-full h-full">
      <div className="container w-10/12 mx-auto mt-10 h-full">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Notice} className="w-[45px] h-10" alt="" />
            <p className="text-xl font-semibold">Новые заказы</p>
          </div>
        </section>

        <section className="bg-forth w-full min-h-[50%] mt-4 p-3">
          {orders === null || orders.length === 0 ? (
            <span>Новых заказов нет</span>
          ) : (
            <table className="border border-primary border-collapse text-center w-full">
              <thead>
                <tr>
                  {orders &&
                    tableHead.map((item, idx) => (
                      <th
                        className="border border-primary p-2 text-sm"
                        key={idx}
                      >
                        {item}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="text-sm relative">
                    <td className="border border-primary py-2">
                      {index + 1}
                      <Link
                        className="w-full h-full absolute left-0 top-0 "
                        to={`/sklad/request/${order.order_id}`}
                      ></Link>
                    </td>
                    <td className="border border-primary py-2">
                      {users[order.user_id]?.full_name || "Unknown Client"}{" "}
                    </td>
                    <td className="border border-primary py-2">
                      {new Date(order.create_at).toLocaleTimeString()} -{" "}
                      {new Date(order.create_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
};

export default Layout;
