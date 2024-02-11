import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";
import { useNavigate } from "react-router-dom";

const RecUser = () => {
  const [products, setProducts] = useState(null);
  const [productsId, setProductsId] = useState(null);
  const { f, formatPhoneNumber } = useMyContext();
  const navigate = useNavigate();
  const reconUser = JSON.parse(localStorage.getItem("reconUser"));

  useEffect(() => {
    const productsApi = `${API}products/products_menu`;

    const fetchData = async () => {
      try {
        const parsedData = JSON.parse(reconUser.products);
        setProducts(parsedData);

        axios
          .get(productsApi)
          .then((response) => {
            setProductsId(response.data);
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

  const tableHead = ["ID", "Номер", "ФИО", "Время"];

  if (!reconUser || products === null || products === null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6">
        <div className="flex items-center gap-5 w-full">
          <label htmlFor="clientName" className="text-2xl font-semibold">
            Имя клиента:
          </label>
          <button
            className="ml-auto flex items-center gap-1 bg-fifth py-1 px-3 rounded-md"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <p>Назад</p>
          </button>
        </div>
        {reconUser && (
          <table className="w-full border-2 border-third border-third-forth text-center mt-5">
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
                  {f.format(reconUser?.order_id).replaceAll(",", ".")}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {reconUser?.phone && formatPhoneNumber(reconUser?.phone)}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {reconUser?.user_full_name}
                </td>
                <td className="py-1 border-2 border-third border-third-forth">
                  {new Date(reconUser?.create_at).toLocaleTimeString()} -{" "}
                  {new Date(reconUser?.create_at).toLocaleDateString()}
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
        {reconUser && (
          <section className="mt-4 ml-auto">
            <table className="w-2/5 text-center">
              <tbody>
                <tr>
                  <td className="border-2 border-third">Общые сумма заказа</td>
                  <td className="border-2 border-third px-5">
                    {reconUser.all_priceDol ? f.format(reconUser.all_priceDol).replaceAll(",", ".") : 0} USD{" "}
                    <br />
                    {reconUser.all_priceSum ? f.format(reconUser.all_priceSum).replaceAll(",", ".") : 0} сум
                  </td>
                </tr>
                <tr>
                  <td className="border-2 border-third">Долг</td>
                  <td className="border-2 border-third px-5">
                    {reconUser.dolgDol ? f.format(reconUser.dolgDol).replaceAll(",", ".") : 0} USD <br />
                    {reconUser.dolgSum ? f.format(reconUser.dolgSum).replaceAll(",", ".") : 0} сум
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

export default RecUser;
