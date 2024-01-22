import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MonthReport = () => {
  const { year, month } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `/orders/${year}/${month}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const tableHead = ["День", "Кол. Заказов", "Кол. продаж", "Продажи"];

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
                <td className="py-1 border border-forth">{idx+1}</td>
                <td className="py-1 border border-forth">
                  {item.quantity_orders}
                </td>
                <td className="py-1 border border-forth">
                  {item.sold_products}
                </td>
                <td className="py-1 border border-forth">{item.all_amount ? item.all_amount : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default MonthReport;
