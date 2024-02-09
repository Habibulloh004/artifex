import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";

const MonthProfit = () => {
  const { year, month } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `http://127.0.0.1:5000/profit/${year}/${month}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const tableHead = ["День", "Сумма продукта", "Общая сумма прибыль"];

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
                <th key={item} className="border border-forth py-2">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([id, item]) => (
              <tr className="relative" key={id}>
                <td className="py-1 border border-forth">
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    to={`/admin/profit/${year}/${month}/${id}`}
                  ></Link>
                  {id}
                </td>
                <td className="py-1 border border-forth">
                  {item.detailed_profits && item.detailed_profits.length > 0
                    ? f.format(item.total_product_amountdol)
                    : 0}{" "}
                  USD <br />
                  {item.detailed_profits && item.detailed_profits.length > 0
                    ? f.format(item.total_product_amountsum)
                    : 0}{" "}
                  сум
                </td>
                <td className="py-1 border border-forth">
                  {item.detailed_profits && item.detailed_profits.length > 0
                    ? f.format(item.total_profit_dol)
                    : 0}{" "}
                  USD <br />
                  {item.detailed_profits && item.detailed_profits.length > 0
                    ? f.format(item.total_profit_sum)
                    : 0}{" "}
                  сум
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default MonthProfit;
