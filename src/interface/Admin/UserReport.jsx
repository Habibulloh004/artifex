import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const UserReport = () => {
  const { year, month, day, user } = useParams();
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);
  const [userHis, setUserHis] = useState(null);
  const [usersAll, setUsersAll] = useState(null);
  const [productsId, setProductsId] = useState(null);
  const { f, formatPhoneNumber } = useMyContext();
  

  useEffect(() => {
    const productsApi = `${API}products/products_menu`;
    const orders = `${API}orders/all_orders`;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API}orders/${year}/${month}/${day}/${user}`
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
    const client = `${API}users/all`;

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
                  {f.format(userHis?.order_id).replaceAll(",", ".")}
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
                  <React.Fragment key={idx}>
                    <tr>
                      <td className="border-2 border-third w-[50%]">
                        <span>
                          {productsId?.map((productId) =>
                            productId.id === item?.product_id
                              ? productId.product_name
                              : null
                          ) || "Unknown Product"}
                        </span>
                      </td>

                      <td className="border-2 border-third w-[20%]">
                        {f.format(item?.amount / 1000).replaceAll(",", ".")} кг
                      </td>

                      <td className="border-2 border-third w-[30%]">
                        <table className="w-full text-center">
                          <tbody>
                            <tr>
                              {item?.recept?.map((recept, i) => (
                                <td
                                  key={i}
                                  className={`border-r-2 border-third w-[12.5%] ${
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
                              {item?.recept &&
                                item.recept.length < 8 &&
                                Array.from({
                                  length: 8 - item.recept.length,
                                }).map((_, i) => (
                                  <td
                                    key={i}
                                    className="border-r-2 border-third w-[12.5%] last:border-r-0"
                                  >
                                    {/* Bo'sh td */}
                                  </td>
                                ))}
                            </tr>
                            <tr>
                              {item?.recept?.map((recept, i) => (
                                <td
                                  key={i}
                                  className={`border-r-2 border-t-2 border-third w-[12.5%] ${
                                    i === item.recept.length - 1
                                      ? "last:border-r-0"
                                      : ""
                                  }`}
                                >
                                  {recept?.amount} г
                                </td>
                              ))}
                              {item?.recept &&
                                item.recept.length < 8 &&
                                Array.from({
                                  length: 8 - item.recept.length,
                                }).map((_, i) => (
                                  <td
                                    key={i}
                                    className="border-r-2 border-t-2 w-[12.5%] border-third last:border-r-0"
                                  >
                                    {/* Bo'sh td */}
                                  </td>
                                ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="border-2 border-third w-[45%] py-2 overflow-auto"
                      >
                        {item?.description}
                      </td>
                    </tr>
                  </React.Fragment>
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
                  <td className="border-2 border-third px-5">
                    {data.all_priceDol ? f.format(data.all_priceDol).replaceAll(",", ".") : 0} USD{" "}
                    <br />
                    {data.all_priceSum ? f.format(data.all_priceSum).replaceAll(",", ".") : 0} сум
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-third">Долг</td>
                  <td className="border-2 border-third px-5">
                    {data.dolgDol ? f.format(data.dolgDol).replaceAll(",", ".") : 0} USD <br />
                    {data.dolgSum ? f.format(data.dolgSum).replaceAll(",", ".") : 0} сум
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
