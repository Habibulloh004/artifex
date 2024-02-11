import React, { useEffect, useState } from "react";
import { useMyContext } from "../../context/Context";
import axios from "axios";
import { API } from "../../components/data";

const CostReport = () => {
  const [dataCost, setDataCost] = useState([]);
  const [allSumPrice, setAllSumPrice] = useState(0);
  const [allDolPrice, setAllDolPrice] = useState(0);
  const [allTodaySumPrice, setTodayAllSumPrice] = useState(0);
  const [allTodayDolPrice, setTodayAllDolPrice] = useState(0);
  const { f } = useMyContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}Expenditure`);
        setDataCost(response.data.reverse());
      } catch (error) {
        console.log(error.message || "An error occurred");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setAllSumPrice(
      dataCost.reduce((total, item) => {
        return total + item.outgosum; // Har bir obyektning outgosum ni totalga qo'shish
      }, 0)
    );
    setAllDolPrice(
      dataCost.reduce((total, item) => {
        return total + item.outgodol; // Har bir obyektning outgosum ni totalga qo'shish
      }, 0)
    );

    const today = new Date().toISOString().split("T")[0]; // Bugungi kun
    const todayObjects = dataCost.filter(
      (item) => item.date.split("T")[0] === today
    );

    setTodayAllSumPrice(
      todayObjects.reduce((total, item) => total + item.outgosum, 0)
    );
    setTodayAllDolPrice(
      todayObjects.reduce((total, item) => total + item.outgodol, 0)
    );
  }, [dataCost]);

  const thead = ["ID", "Сумма", "Комментария", "Дата"];

  if (!dataCost) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <main className="mt-8">
          <p className="text-2xl font-semibold">История расходов</p>
          <table className="w-[80%] text-center mt-3">
            <thead>
              <tr>
                {thead.map((item, idx) => (
                  <th className="border border-secondary py-1 px-2" key={idx}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataCost.map((cost, idx) => (
                <tr key={idx}>
                  <td className="border border-secondary py-1">{cost.id}</td>
                  <td className="border border-secondary py-1">
                    {f.format(cost.outgodol).replaceAll(",", ".")} USD <br />
                    {f.format(cost.outgosum).replaceAll(",", ".")} сум
                  </td>
                  <td className="border border-secondary py-1">
                    {cost.description}
                  </td>
                  <td className="border border-secondary py-1">
                    {new Date(cost.date).toLocaleTimeString()} -{" "}
                    {new Date(cost.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col w-2/4">
            <ul className="flex items-center gap-3 mt-3 justify-between">
              <li className="py-1">Стоимость сегодня:</li>

              <li className="flex gap-2">
                <span className="py-1 px-3 bg-forth rounded-md">
                  USD: {f.format(allTodayDolPrice).replaceAll(",", ".")}
                </span>
                <span className="py-1 px-3 bg-forth rounded-md">
                  Cум: {f.format(allTodaySumPrice).replaceAll(",", ".")}
                </span>
              </li>
            </ul>
            <ul className="flex items-center gap-3 mt-3 justify-between">
              <li className="py-1">Вся стоимость:</li>

              <li className="flex gap-2">
                <span className="py-1 px-3 bg-forth rounded-md">
                  USD: {f.format(allDolPrice).replaceAll(",", ".")}
                </span>
                <span className="py-1 px-3 bg-forth rounded-md">
                  Cум: {f.format(allSumPrice).replaceAll(",", ".")}
                </span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </main>
  );
};

export default CostReport;
