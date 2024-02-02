import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";

const UserReport = () => {
  const { year, month, day, user } = useParams();
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [userHis, setUserHis] = useState(null);
  const [usersAll, setUsersAll] = useState(null);
  const [productsId, setProductsId] = useState(null);
  const { f, formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const productsApi = "http://127.0.0.1:5000/products/products_menu";
    const orders = "http://127.0.0.1:5000/orders/all_orders";

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/orders/${year}/${month}/${day}/${user}`
        );
        const parsedData = JSON.parse(response.data.products);
        setData(response.data);
        setProducts(parsedData);

        axios
          .get(productsApi)
          .then((response) => {
            setProductsId(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });

        axios
          .get(orders)
          .then((response) => {
            setUserHis(
              response.data.find((order) => +order.order_id === +user)
            );
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const client = "http://127.0.0.1:5000/users/all";

    if (userHis) {
      axios
        .get(client)
        .then((response) => {
          setUsersAll(response.data.find((us) => us.id === userHis.user_id));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userHis]);

  const tableHead = ["ID", "Номер", "ФИО", "Время"];

  if (!data && !userHis && !usersAll) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6">
        {data && userHis && (
          <table className="w-full border-2 border-third border-third-forth text-center">
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th
                    key={item}
                    className="border-2 border-third border-third-forth py-1"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1 border-2 border-third border-third-forth">
                  {userHis?.order_id}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {usersAll?.phone && formatPhoneNumber(usersAll?.phone)}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {usersAll?.full_name}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {new Date(userHis?.create_at).toLocaleTimeString()} -{" "}
                  {new Date(userHis?.create_at).toLocaleDateString()}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <section className="mt-4">
          <table className="w-full text-center">
            <tbody>
              {products &&
                products?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border-2 border-third w-[15%]">
                      <span>
                        {productsId?.map((productId) =>
                          productId.id === item?.product_id
                            ? productId.product_name
                            : null
                        ) || "Unknown Product"}
                      </span>
                    </td>

                    <td className="border-2 border-third w-[5%]">
                      {item?.amount}
                    </td>

                    <td className="border-2 border-third w-[50%]">
                      <table className="w-full text-center">
                        <tbody>
                          <tr>
                            {item?.recept?.map((recept, i) => (
                              <td
                                key={i}
                                className={`border-r-2 border-third ${
                                  item.recept && i === item.recept.length - 1
                                    ? "last:border-r-0"
                                    : ""
                                }`}
                              >
                                {productsId?.map((productId) =>
                                  productId.id === recept?.product_id
                                    ? productId.product_name
                                    : null
                                ) || "Unknown Product"}
                              </td>
                            ))}
                          </tr>
                          <tr>
                            {item?.recept?.map((recept, i) => (
                              <td
                                key={i}
                                className={`border-r-2 border-t-2 border-third ${
                                  i === item.recept.length - 1
                                    ? "last:border-r-0"
                                    : ""
                                }`}
                              >
                                {recept?.amount}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>

                    <td className="border-2 border-third w-[30%] overflow-auto">
                      {item?.description}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        {data && (
          <section className="mt-4 ml-auto">
            <table className="w-2/5 text-center">
              <tbody>
                <tr>
                  <td className="border-2 border-third">Общые сумма заказа</td>
                  <td className="border-2 border-third w-[20%]">
                    {f.format(data?.all_price)}
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-third">Долг</td>
                  <td className="border-2 border-third w-[20%]">
                    {f.format(data?.dolg)}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
    </main>
  );
};

export default UserReport;
