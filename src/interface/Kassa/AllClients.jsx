import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { completePath } from "../../components/data";
import { ManageClient } from "./ManageClient";
import { useMyContext } from "../../context/Context";
import PhoneInput from "react-phone-input-2";

const AllClients = () => {
  const location = useLocation();
  const [data, setData] = useState();
  const { clientPath } = useParams();
  const myParam = completePath(clientPath);
  const { formatPhoneNumber, f } = useMyContext();
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(myParam.url);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [clientPath]);

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
            <span>
              <PhoneInput
                country={"uz"}
                name="phone"
                placeholder="Номер клиента"
                onChange={(value) => setInputValue(value)}
                inputStyle={{
                  background: "#DFDFDF",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                  width: "100%",
                }}
              />
            </span>
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
                        {f.format(idx + 1).replaceAll(",", ".")}
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
                        {location.pathname === "/kassa/clients/all-client" ? (
                          client.year
                        ) : (
                          <>{f.format(client.amountDol).replaceAll(",", ".")} USD <br />
                            {f.format(client.amountSum).replaceAll(",", ".")} сум
                          </>
                        )}
                      </td>
                      {location.pathname === "/kassa/clients/all-client" && (
                        <td className="p-2 text-sm border border-secondary">
                          {client.company},{" "}
                          {client.known_from.charAt(0).toUpperCase() +
                            client.known_from.slice(1)}
                        </td>
                      )}
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
