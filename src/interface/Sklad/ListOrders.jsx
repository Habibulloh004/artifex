import React, { useEffect, useState } from "react";
import { List } from "../../images";
import axios from "axios";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const ListOrders = () => {
  const [orders, setOrders] = useState(null);
  const [productsId, setProductsId] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const orderApi = `${API}orders/all_orders`;
    const productsApi = `${API}products/products_menu`;

    axios
      .get(orderApi)
      .then((response) => {
        const ordersWithParsedProducts = response.data.map((order) => ({
          ...order,
          products: JSON.parse(order.products),
        }));

        // Bugungi kun
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Bugun sanasini temirle

        // Bugungi kunli buyurtmalarni ajratib olish
        const todayOrders = ordersWithParsedProducts.filter((order) => {
          const orderDate = new Date(order.create_at);
          return orderDate >= today;
        });

        // Buguni qolmasdan boshqa kunlarga qarab saralash
        const sortedOrders = [...todayOrders].sort((a, b) => {
          const dateA = new Date(a.create_at);
          const dateB = new Date(b.create_at);
          return dateB - dateA; // Kamayish tartibida saralash
        });

        // sortedOrders ni sotib olish uchun setOrders(sortedOrders) qilishni unutmang
        setOrders(sortedOrders);
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
  if (!orders || !productsId || orders === null || productsId === null) {
    return <p>Loading...</p>;
  }
  console.log(orders);
  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <section className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={List} className="w-[30px] h-10" alt="" />
            <p className="text-xl font-semibold">Список заказов</p>
          </div>
        </section>
        <section className="mt-4">
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
                      {f.format(idx + 1).replaceAll(",", ".")}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.products.map((product, i) => (
                        <span key={i}>
                          {product.recept.map((recept, indexR) => (
                            <span key={indexR} className="block">
                              {productsId?.map((productId) =>
                                productId.id === recept?.product_id
                                  ? productId.product_name
                                  : null
                              ) || "Unknown Product"}
                            </span>
                          ))}
                        </span>
                      ))}
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
                      {f.format(order.order_id).replaceAll(",", ".")}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.products.map((product, i) => (
                        <span key={i} className="block">
                          {product.name}
                        </span>
                      ))}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {order.products.map((product, i) => (
                        <span key={i}>
                          {product.recept &&
                            product.recept.length > 0 &&
                            product.recept.some((item) => item !== "") &&
                            product.recept.map(
                              (recept, indexR) =>
                                recept !== "" && (
                                  <span key={indexR} className="block">
                                    {f.format(recept.amount).replaceAll(",", ".")} г
                                  </span>
                                )
                            )}
                        </span>
                      ))}
                      {order.products.map((product, i) => (
                        <span key={i} className="block">
                          {f.format(product.amount / 1000)} кг
                        </span>
                      ))}
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {f.format(Number(order.all_priceDol)).replaceAll(",", ".")} USD <br />
                      {f.format(Number(order.all_priceSum)).replaceAll(",", ".")} сум
                    </td>
                    <td className="p-2 text-sm border border-forth">
                      {Number(order.all_priceDol) > 0 ? "Готово" : "Ожидание"}
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
