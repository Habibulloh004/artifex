import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";

const DayReport = () => {
  const { year, month, day } = useParams();
  const [data, setData] = useState(null);
  const { setUserHistory, formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(
          `http://127.0.0.1:5000/orders/${year}/${month}/${day}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);


  const tableHead = ["ID", "Номер", "ФИО", "Время"];

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
                  {item.order_id}
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    onClick={() => setUserHistory(item)}
                    to={`/admin/reports/${year}/${month}/${day}/${item.order_id}`}
                  ></Link>
                </td>
                <td className="py-1 border border-forth">{formatPhoneNumber(item.phone)}</td>
                <td className="py-1 border border-forth">{item.user_name}</td>
                <td className="py-1 border border-forth">
                  {new Date(item.data).toLocaleTimeString()} -{" "}
                  {new Date(item.data).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default DayReport;
