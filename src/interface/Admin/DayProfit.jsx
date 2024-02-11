import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const DayProfit = () => {
  const { year, month, day } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `${API}profit/${year}/${month}/${day}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const tableHead = [
    "№",
    "Названия",
    "Количество",
    "Цена за КГ",
    "Цена продукта",
    "Цена прод. КГ",
    "Цена продажа",
  ];

  if (!data || data === null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6 flex flex-col items-end">
        {data && (
          <table className="w-full border text-center text-sm">
            <thead>
              <tr>
                {tableHead.map((item) => (
                  <th key={item} className="border border-secondary py-2">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.detailed_profits?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td className="border border-secondary py-1">{idx + 1}</td>
                    <td className="border border-secondary py-1">
                      {item.product_name}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.quantity / 1000).replaceAll(",", ".")
                        : f.format(item.quantity).replaceAll(",", ".")}{" "}
                      {item.product_name.length >= 3 ? "кг" : "г"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.product_amount).replaceAll(",", ".")
                        : f.format(item.product_amount).replaceAll(",", ".")}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.pricekg).replaceAll(",", ".")
                        : f.format(item.pricekg).replaceAll(",", ".")}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.product_amount).replaceAll(",", ".")
                        : f.format(item.product_amount).replaceAll(",", ".")}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.profitsum).replaceAll(",", ".")
                        : f.format(item.profitdol).replaceAll(",", ".")}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {data && (
          <table className="w-[70%] border text-center text-sm mt-10">
            <thead>
              <tr>
                <th className="border border-secondary py-2" colSpan={2}>
                  Обшая цена
                </th>
                <th className="border border-secondary py-2">
                Прибыль
                </th>
                <th className="border border-secondary py-2">
                  Общая цена продажа
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-secondary py-1 px-2">сум</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_product_amountsum).replaceAll(",", ".")}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.priblsum).replaceAll(",", ".")}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_profit_sum).replaceAll(",", ".")}</td>
              </tr>
              <tr>
                <td className="border border-secondary py-1 px-2">USD</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_product_amountdol).replaceAll(",", ".")}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.pribldol).replaceAll(",", ".")}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_profit_dol).replaceAll(",", ".")}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default DayProfit;
