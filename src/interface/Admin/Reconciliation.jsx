import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const Reconciliation = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { setReconUser, formatPhoneNumber } = useMyContext();
  const [inputValue, setInputValue] = useState(""); // O'zgaruvchini muhlatlantirish

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request using axios
        const response = await axios.get(`${API}orders/all_orders`);
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const tableHead = ["ID", "Номер", "ФИО", "Время"];

  if (!data || data === null) {
    return <p>Loading...</p>;
  }

  const filteredData = data.filter((item) =>
    item.user_full_name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <div className="flex items-center gap-5 w-full">
          <label htmlFor="clientName" className="text-2xl font-semibold">
            Имя клиента:
          </label>
          <input
            type="text"
            id="clientName"
            className="border rounded-md px-2 py-1 border-secondary"
            value={inputValue} // Input qiymatini o'zgaruvchiga bog'lang
            onChange={(e) => setInputValue(e.target.value)} // Qiymat o'zgarishi
          />
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
        <table className="w-full border border-forth text-center mt-5">
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
            {filteredData.map((item, idx) => (
              <tr className="relative" key={idx}>
                <td className="py-1 border border-forth">
                  {item.order_id}
                  <Link
                    className="w-full h-full absolute left-0 top-0 "
                    onClick={() => {
                      setReconUser(item);
                      localStorage.setItem("reconUser", JSON.stringify(item));
                    }}
                    to={`/admin/reconciliation/recuser`}
                  ></Link>
                </td>
                <td className="py-1 border border-forth">
                  {formatPhoneNumber(item.phone)}
                </td>
                <td className="py-1 border border-forth">
                  {item.user_full_name}
                </td>
                <td className="py-1 border border-forth">
                  {new Date(item.create_at).toLocaleTimeString()} -{" "}
                  {new Date(item.create_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Reconciliation;
