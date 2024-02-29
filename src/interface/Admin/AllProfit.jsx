import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const AllProfit = () => {
  const [data, setData] = useState(null);
  const [date, setDate] = useState("");
  const [inputValues, setInputValues] = useState({
    year: "",
    month: "",
    day: "",
  });
  const { f } = useMyContext();

  useEffect(() => {
    const localProfitData = localStorage.getItem("profitData");
    const localProfitDate = localStorage.getItem("profitDate");
    const parsedDate = JSON.parse(localProfitDate);
    if (localProfitData) {
      setData(JSON.parse(localProfitData));
      setDate(
        `${parsedDate.year}${parsedDate.month ? `/${parsedDate.month}` : ""}${
          parsedDate.month && parsedDate.day ? `/${parsedDate.day}` : ""
        }`
      );
    }
  }, []);

  const searchData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${API}profit/${inputValues.year}${
          inputValues.month ? `/${inputValues.month}` : ""
        }${inputValues.month && inputValues.day ? `/${inputValues.day}` : ""}`
      );
      setData(response.data);
      setDate(
        `${inputValues.year}${
          inputValues.month ? `/${inputValues.month}` : ""
        }${inputValues.month && inputValues.day ? `/${inputValues.day}` : ""}`
      );
      localStorage.setItem("profitData", JSON.stringify(response.data));
      localStorage.setItem("profitDate", JSON.stringify(inputValues));
      setInputValues({
        year: "",
        month: "",
        day: "",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const tableHead = [
    "№",
    "Названия",
    "Количество",
    "Цена за КГ",
    "Цена продукта",
    "Цена прод. КГ",
    "Цена продажа",
  ];

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-6 flex flex-col">
        <p className="font-semibold text-lg">Введите дату: {date}</p>
        <form onSubmit={searchData} className="mt-2 flex gap-3 items-center">
          <input
            type="text"
            value={inputValues.year}
            onChange={(e) =>
              setInputValues({ ...inputValues, year: e.target.value })
            }
            className="rounded-md border py-1 px-2 text-sm border-forth"
            placeholder="Год"
          />
          <input
            type="text"
            value={inputValues.month}
            onChange={(e) =>
              setInputValues({ ...inputValues, month: e.target.value })
            }
            className="rounded-md border py-1 px-2 text-sm border-forth"
            placeholder="Месяц"
          />
          <input
            type="text"
            value={inputValues.day}
            onChange={(e) =>
              setInputValues({ ...inputValues, day: e.target.value })
            }
            className="rounded-md border py-1 px-2 text-sm border-forth"
            placeholder="День"
          />
          <button
            type="submit"
            className="text-sm text-white py-[5px] bg-secondary px-4 rounded-md"
          >
            Поиск
          </button>
        </form>
        <div className="containe mt-6 flex flex-col items-end">
          {data !== null && (
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
                      <td className="border border-secondary py-1">
                        {idx + 1}
                      </td>
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
                          : f
                              .format(item.product_amount)
                              .replaceAll(",", ".")}{" "}
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
                          : f
                              .format(item.product_amount)
                              .replaceAll(",", ".")}{" "}
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
          {data !== null && (
            <table className="w-[70%] border text-center text-sm mt-10">
              <thead>
                <tr>
                  <th className="border border-secondary py-2" colSpan={2}>
                    Обшая цена
                  </th>
                  <th className="border border-secondary py-2">Прибыль</th>
                  <th className="border border-secondary py-2">
                    Общая цена продажа
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-secondary py-1 px-2">сум</td>
                  <td className="border border-secondary py-1 px-2">
                    {f
                      .format(data.Total_product_amountsum)
                      .replaceAll(",", ".")}
                  </td>
                  <td className="border border-secondary py-1 px-2">
                    {f.format(data.Priblsum).replaceAll(",", ".")}
                  </td>
                  <td className="border border-secondary py-1 px-2">
                    {f.format(data.Total_profit_sum).replaceAll(",", ".")}
                  </td>
                </tr>
                <tr>
                  <td className="border border-secondary py-1 px-2">USD</td>
                  <td className="border border-secondary py-1 px-2">
                    {f
                      .format(data.Total_product_amountdol)
                      .replaceAll(",", ".")}
                  </td>
                  <td className="border border-secondary py-1 px-2">
                    {f.format(data.Pribldol).replaceAll(",", ".")}
                  </td>
                  <td className="border border-secondary py-1 px-2">
                    {f.format(data.Total_profit_dol).replaceAll(",", ".")}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* {data && (
          <table className="w-full border text-center text-sm mt-4">
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
                        : f
                            .format(item.product_amount)
                            .replaceAll(",", ".")}{" "}
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
                        : f
                            .format(item.product_amount)
                            .replaceAll(",", ".")}{" "}
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
                <th className="border border-secondary py-2">Прибыль</th>
                <th className="border border-secondary py-2">
                  Общая цена продажа
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-secondary py-1 px-2">сум</td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.total_product_amountsum).replaceAll(",", ".")}
                </td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.priblsum).replaceAll(",", ".")}
                </td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.total_profit_sum).replaceAll(",", ".")}
                </td>
              </tr>
              <tr>
                <td className="border border-secondary py-1 px-2">USD</td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.total_product_amountdol).replaceAll(",", ".")}
                </td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.pribldol).replaceAll(",", ".")}
                </td>
                <td className="border border-secondary py-1 px-2">
                  {f.format(data.total_profit_dol).replaceAll(",", ".")}
                </td>
              </tr>
            </tbody>
          </table>
        )} */}
      </div>
    </main>
  );
};

export default AllProfit;
