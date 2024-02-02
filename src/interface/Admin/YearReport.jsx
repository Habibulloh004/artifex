import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";

const YearReport = () => {
  const { year } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `http://127.0.0.1:5000/orders/${year}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);


  const tableHead = ["Месяц", "Кол. Заказов", "Кол. продаж", "Продажи"];
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

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6">
        <table className="w-full border border-forth text-center">
          <thead>
            <tr>
              {tableHead.map((item) => (
                <th key={item} className="border border-forth py-1">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
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
                <td className="py-1 border border-forth">{item.all_price ? f.format(item.all_price) : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default YearReport;
