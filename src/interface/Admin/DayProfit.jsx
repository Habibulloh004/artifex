import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";

const DayProfit = () => {
  const { year, month, day } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `http://127.0.0.1:5000/profit/${year}/${month}/${day}`
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
                        ? f.format(item.quantity / 1000)
                        : f.format(item.quantity)}{" "}
                      {item.product_name.length >= 3 ? "кг" : "г"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.product_amount)
                        : f.format(item.product_amount)}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.pricekg)
                        : f.format(item.pricekg)}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.product_amount)
                        : f.format(item.product_amount)}{" "}
                      {item.product_name.length >= 3 ? "сум" : "USD"}
                    </td>
                    <td className="border border-secondary py-1">
                      {item.product_name.length >= 3
                        ? f.format(item.profitsum)
                        : f.format(item.profitdol)}{" "}
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
                <td className="border border-secondary py-1 px-2">{f.format(data.total_product_amountsum)}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.priblsum)}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_profit_sum)}</td>
              </tr>
              <tr>
                <td className="border border-secondary py-1 px-2">USD</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_product_amountdol)}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.pribldol)}</td>
                <td className="border border-secondary py-1 px-2">{f.format(data.total_profit_dol)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default DayProfit;
