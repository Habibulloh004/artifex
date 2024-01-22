import React, { useEffect, useState } from "react";
import { List } from "../../images";
import axios from "axios";

const ListOrders = () => {
  const [orders, setOrders] = useState(null);
  const [productsId, setProductsId] = useState(null);

  useEffect(() => {
    const orderApi = "/orders/all_orders";
    const productsApi = "/products/products_menu";

    axios
      .get(orderApi)
      .then((response) => {
        const ordersWithParsedProducts = response.data.map((order) => ({
          ...order,
          products: JSON.parse(order.products),
        }));

        // Set the orders to the state
        setOrders(ordersWithParsedProducts);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(productsApi)
      .then((response) => {
        setProductsId(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const tableHead = [
    "№",
    "Товар",
    "Код товара",
    "Цвет",
    "Количество",
    "Цена",
    "Статус",
  ];
  if (!orders || !productsId) {
    return <p>Loading...</p>;
  }
  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={List} className="w-[30px] h-10" alt="" />
            <p className="text-xl font-semibold">Список заказов</p>
          </div>
        </section>
        <section className="mt-5">
          {orders === null || orders.length === 0 ? (
            <span>Заказов нет</span>
          ) : (
            <table className="border w-full">
              <thead>
                <tr>
                  {tableHead.map((item, idx) => (
                    <th className="border border-forth p-2" key={idx}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders?.map((order, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="p-2 text-sm border border-forth">
                      {idx + 1}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.products.map((product, i) => (
                        <span key={i} className="block">
                          {productsId?.map((productId) =>
                            productId.id === product?.product_id
                              ? productId.product_name
                              : null
                          ) || "Unknown Product"}
                        </span>
                      ))}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.order_id}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.products.map((product, i) => (
                        <span key={i} className="block">
                          {product.name}
                        </span>
                      ))}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.all_quantity}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.all_price}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {Number(order.all_price) > 0 ? "Готово" : "Ожидание"}
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

export default ListOrders;
