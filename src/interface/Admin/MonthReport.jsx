import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";
import * as XLSX from "xlsx";
import { API } from "../../components/data";

const MonthReport = () => {
  const { year, month } = useParams();
  const [data, setData] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}orders/${year}/${month}`);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);
  console.log(data);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item, idx) => ({
        day: idx + 1,
        quantity_orders: item.quantity_orders,
        sold_products: item.sold_products,
        all_priceDol: item.all_priceDol,
        all_priceSum: item.all_priceSum,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OrdersMonth");
    XLSX.writeFile(wb, "ordersmonth.xlsx");
  };

  const tableHead = ["День", "Кол. Заказов", "Продажи"];

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
            {data.map((item, idx) => (
              <tr className="relative" key={idx}>
                <td className="py-1 border border-forth">
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    to={`/admin/reports/${year}/${month}/${idx + 1}`}
                  ></Link>
                  {idx + 1}
                </td>
                <td className="py-1 border border-forth">
                  {f.format(item.quantity_orders).replaceAll(",", ".")}
                </td>
                <td className="py-1 border border-forth">
                  {item.all_priceDol
                    ? f.format(item.all_priceDol).replaceAll(",", ".")
                    : 0}{" "}
                  USD <br />
                  {item.all_priceSum
                    ? f.format(item.all_priceSum).replaceAll(",", ".")
                    : 0}{" "}
                  сум
                  <br />
                  {item.total_card
                    ? f.format(item.total_card).replaceAll(",", ".")
                    : 0}{" "}
                  карта
                  <br />
                  {item.total_terminal
                    ? f.format(item.total_terminal).replaceAll(",", ".")
                    : 0}{" "}
                  терминал
                  <br />
                  {item.total_transfers
                    ? f.format(item.total_transfers).replaceAll(",", ".")
                    : 0}{" "}
                  перчисления
                  <br />
                  {item.total_dolgdol
                    ? f.format(item.total_dolgdol).replaceAll(",", ".")
                    : 0}{" "}
                  долг в долларах
                  <br />
                  {item.total_dolgsum
                    ? f.format(item.total_dolgsum).replaceAll(",", ".")
                    : 0}{" "}
                  долг в суммах
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-1 rounded-md mt-4"
        >
          Export to Excel
        </button>
      </div>
    </main>
  );
};

export default MonthReport;
