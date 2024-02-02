import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { completePath } from "../../components/data";
import { ManageClient } from "./ManageClient";
import { useMyContext } from "../../context/Context";

const AllClients = () => {
  const location = useLocation();
  const [data, setData] = useState();
  const param = useParams();
  const myParam = completePath(param.clientPath);
  const { formatPhoneNumber, f } = useMyContext()
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(myParam.url);
        // const flattenedData = Object.values(response.data).flatMap((item) =>
        //   Array.isArray(item) ? item : [item]
        // );

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [param.clientPath]);

  return (
    <main>
      {!data ? (
        <p>Loading...</p>
      ) : (
        <div className="container w-10/12 mx-auto mt-10">
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={myParam.icon} className="w-[45px] h-10" alt="" />
              <p className="text-xl font-semibold">{myParam.title}</p>
            </div>
            <input
              type="number"
              placeholder="Номер клиента"
              className="border border-primary rounded-md text-sm py-1 px-2"
              onChange={(e) => setInputValue(e.target.value)}
            />
            <ManageClient />
          </section>
          <table className="border w-full mt-5">
            <thead>
              <tr>
                {myParam.tableHead.map((item) => (
                  <th className="border border-secondary p-2" key={item}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) ? (
                data
                  .filter((client) => {
                    const searchFields = [
                      "id",
                      "full_name",
                      "phone",
                      "year",
                      "amount",
                    ];
                    return searchFields.some(
                      (field) =>
                        client[field] &&
                        client[field].toString &&
                        client[field].toString().toLowerCase &&
                        client[field]
                          .toString()
                          .toLowerCase()
                          .includes(inputValue.toLowerCase())
                    );
                  })
                  .map((client, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="p-2 text-sm border border-secondary">
                        {idx + 1}
                      </td>
                      <td className="p-2 text-sm border border-secondary">
                        {client.id}
                      </td>
                      <td className="p-2 text-sm border border-secondary">
                        {client.full_name}
                      </td>
                      <td className="p-2 text-sm border border-secondary">
                        {formatPhoneNumber(client.phone)}
                      </td>
                      <td className="p-2 text-sm border border-secondary">
                        {location.pathname === "/kassa/clients/all-client"
                          ? client.year
                          : f.format(client.amount)}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={myParam.tableHead.length}
                    className="p-2 text-center"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};
export default AllClients;
