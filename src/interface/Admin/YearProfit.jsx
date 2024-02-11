import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const YearProfit = () => {
  const { year } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `${API}profit/${year}`
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
    "Месяц",
    "Прибыль",
    "Сумма продукта",
    "Общая сумма продажи",
  ];
  const months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  if (!data || data === null) {
    return <p>Loading...</p>;
  }


  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6">
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
            {Object.entries(data).map(([id, item]) => (
              <tr className="relative" key={id}>
                <td className="border border-secondary py-1">{id}</td>
                <td className="border border-secondary py-1">
                  {f.format(item.profit_dol).replaceAll(",", ".")} USD <br />{" "}
                  {f.format(item.profit_sum).replaceAll(",", ".")} сум
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    to={`/admin/profit/${year}/${id}`}
                  ></Link>
                </td>
                <td className="border border-secondary py-1">
                  {f.format(item.total_product_amountdol).replaceAll(",", ".")} USD <br />{" "}
                  {f.format(item.total_product_amountsum).replaceAll(",", ".")} сум
                </td>
                <td className="border border-secondary py-1">
                  {f.format(item.total_profit_dol).replaceAll(",", ".")} USD <br />{" "}
                  {f.format(item.total_profit_sum).replaceAll(",", ".")} сум
                </td>
              </tr>
            ))}
          </tbody>
          {/* <tbody>
            {data.map((item, idx) => (
              <tr className="relative" key={idx}>
                <td className="py-1 border border-forth">
                  {months[item.month - 1].charAt(0).toUpperCase() +
                    months[item.month - 1].slice(1)}
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    to={`/admin/reports/${year}/${item.month}`}
                  ></Link>
                </td>
                <td className="py-1 border border-forth">
                  {f.format(item.quantity_orders)}
                </td>
                <td className="py-1 border border-forth">
                  {f.format(item.sold_products)}
                </td>
                <td className="py-1 border border-forth">
                  {item.all_priceDol ? f.format(item.all_priceDol) : 0} USD <br />
                  {item.all_priceSum ? f.format(item.all_priceSum) : 0} сум
                </td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
    </main>
  );
};

export default YearProfit;
