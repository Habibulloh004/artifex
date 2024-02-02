import { Popover, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useState } from "react";
import { KassaNotice } from "../../images";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "../../context/Context";

export default function EndOrder() {
  const location = useLocation();
  const [data, setData] = useState(null);
  const [clientData, setClientData] = useState(null);
  const { setEndData, setEndPopup } = useMyContext();
  useEffect(() => {
    // Replace 'your_api_endpoint' with your actual API endpoint
    const orderApi = "http://127.0.0.1:5000/orders/all_orders";
    const clientApi = "http://127.0.0.1:5000/users/dolg_list";

    axios
      .get(orderApi)
      .then((response) => {
        // Sort the data by date in descending order
        const sortedData = response.data.sort((a, b) => {
          return new Date(b.create_at) - new Date(a.create_at);
        });

        // Get the data for the last 3 days
        const today = new Date();
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);

        const lastThreeDaysData = sortedData.filter((item) => {
          const itemDate = new Date(item.create_at);

          // Check if the item's date is within the last 3 days
          return itemDate >= threeDaysAgo && item.all_price > 0 && item.was_paid == 0;
        });

        setData(lastThreeDaysData);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
    axios
      .get(clientApi)
      .then((response) => {
        setClientData(response.data);
      })
      .catch((error) => {
        // Handle errors
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!data && !clientData) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className={`relative ${
        location.pathname === "/kassa" ? "block" : "hidden"
      }`}
    >
      <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full flex items-center justify-center w-5 h-5 z-30 text-[12px]">
        <p>{data.length > 0 ? data.length : 0}</p>
      </span>
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              className={`
                 rounded-md focus:outline-none flex items-center`}
            >
              <img className="w-9" src={KassaNotice} alt="" />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-x-1"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-1"
            >
              <Popover.Panel className="absolute right-0 top-16 z-10 mt-3 w-[300px] h-[200px] overflow-auto">
                <div className="overflow-hidden rounded-lg shadow-lg bg-forth text-black">
                  <ul>
                    {data && clientData &&
                      data.map((item, idx) => {
                        const matchingClient = clientData.find(
                          (client) => client.id === item.user_id
                        );
                        return (
                          <li
                            key={idx}
                            onClick={() => {
                              close();
                              setEndData(item.order_id);
                              setEndPopup(true);
                            }}
                            className="px-3 py-2 cursor-pointer"
                          >
                            <p className="inline-block">{item.order_id}.</p>{" "}
                            <p className="inline-block">
                              {matchingClient?.full_name}
                            </p>
                            <p>+{matchingClient?.phone}</p>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
