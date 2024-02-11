import React, { useEffect, useState } from "react";
import { Cancel, createData } from "../../images";
import CurrencyInput from "react-currency-input-field";
import { useMyContext } from "../../context/Context";
import axios from "axios";
import { API } from "../../components/data";

const CostRequest = () => {
  const [error, setError] = useState("");
  const [costDataToRequest, setCostDataToRequest] = useState({
    dollar: 0,
    sum: 0,
    comment: "",
  });
  const handleInputChange = (fieldName, value) => {
    setCostDataToRequest((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (costDataToRequest.comment === "") {
        setError("Пожалуйста, заполните все необходимые поля");
      } else {
        // const myHeader = new Headers();
        // myHeader.append("Content-Type", "application/json");

        // const postData = {
        //   description: costDataToRequest.comment,
        //   outgodol: Number(costDataToRequest.dollar),
        //   outgosum: Number(costDataToRequest.sum),
        // };
        // console.log(postData);

        // const requestOptions = {
        //   method: "POST",
        //   headers: myHeader,
        //   body: JSON.stringify(postData),
        //   redirect: "follow",
        // };
        // fetch("http://127.0.0.1:5000/Expenditurepost", requestOptions)
        //   .then((res) => res.json())
        //   .then((result) => console.log(result));

        const postData = {
          description: costDataToRequest.comment,
          outgodol: Number(costDataToRequest.dollar),
          outgosum: Number(costDataToRequest.sum),
        };
        const response = await axios.post(
          `${API}Expenditurepost`, // replace with your API endpoint
          JSON.stringify(postData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Update successful", response.data);

        setCostDataToRequest({
          dollar: "",
          sum: "",
          comment: "",
        });
        setError("");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "An error occurred");
        console.error("Server error response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from the server");
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("An error occurred while processing the request");
        console.error("Error setting up request:", error.message);
      }
    }
  };
  const cancel = (e) => {
    e.preventDefault();
    setCostDataToRequest({
      dollar: "",
      sum: "",
      comment: "",
    });
    setError("");
  };
  return (
    <>
      <main className="mt-8">
        <form className="flex flex-col gap-3 w-[400px]" onSubmit={handleSubmit}>
          <CurrencyInput
            placeholder="Доллар"
            className="bg-forth w-[70%] rounded-md text-sm p-2"
            value={costDataToRequest.dollar > 0 ? costDataToRequest.dollar : ""}
            onValueChange={(value, name) => {
              handleInputChange("dollar", value);
            }}
            step={0.01}
            allowDecimals
            decimalSeparator="."
            groupSeparator=" "
            prefix=""
          />
          <CurrencyInput
            placeholder="Сум"
            className="bg-forth w-[70%] rounded-md text-sm p-2"
            value={costDataToRequest.sum > 0 ? costDataToRequest.sum : ""}
            onValueChange={(value, name) => {
              handleInputChange("sum", value);
            }}
            step={0.01}
            allowDecimals
            decimalSeparator="."
            groupSeparator=" "
            prefix=""
          />
          <textarea
            placeholder="Комментария"
            value={costDataToRequest.comment}
            onChange={(e) => {
              handleInputChange("comment", e.target.value);
            }}
            className="bg-forth w-[70%] rounded-md text-sm p-2 min-h-[150px]"
          ></textarea>

          {error && <p className="text-red-500">{error}</p>}
          <span className="flex flex-col items-center w-[70%] gap-3">
            <button
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 mt-3 bg-forth"
              type="submit"
            >
              <img src={createData} alt="" /> <p>Подтвердить</p>
            </button>
            <button
              onClick={(e) => cancel(e)}
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth"
            >
              <img src={Cancel} alt="" /> <p>Отменить</p>
            </button>
          </span>
        </form>
      </main>
    </>
  );
};

const CostData = () => {
  const [dataCost, setDataCost] = useState([]);
  const [allSumPrice, setAllSumPrice] = useState(0);
  const [allDolPrice, setAllDolPrice] = useState(0);
  const { f } = useMyContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}Expenditure`);

        const today = new Date();
        const todayDate = today.toISOString().slice(0, 10); // Sanani yyy-MM-dd formatiga olish

        const filteredData = response.data.filter((item) => {
          const itemDate = new Date(item.date).toISOString().slice(0, 10); // Ma'lumotning sanasi
          return itemDate === todayDate; // Faqat bugungi kunga mos keladigan ma'lumotlarni qaytarish
        });

        setDataCost(filteredData.reverse());
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
  }, [dataCost]);

  const thead = ["ID", "Сумма", "Комментария", "Дата"];

  if (!dataCost) {
    return <p>Loading...</p>;
  }

  return (
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
      <ul className="flex gap-3 mt-3">
        <li className="py-1 px-3 bg-forth rounded-md">Cум: {allSumPrice}</li>
        <li className="py-1 px-3 bg-forth rounded-md">USD: {allDolPrice}</li>
      </ul>
    </main>
  );
};

const Cost = () => {
  const [openData, setOpenData] = useState(false);
  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <ul className="flex gap-3">
          <li
            className={`${
              !openData ? "bg-[#D8F4C2]" : "bg-forth"
            } py-1 px-4 text-sm rounded-md cursor-pointer`}
            onClick={() => setOpenData(false)}
          >
            Расход
          </li>
          <li
            className={`${
              openData ? "bg-[#D8F4C2]" : "bg-forth"
            } py-1 px-4 text-sm rounded-md cursor-pointer`}
            onClick={() => setOpenData(true)}
          >
            История расходов
          </li>
        </ul>
        {!openData ? <CostRequest /> : <CostData />}
      </div>
    </main>
  );
};

export default Cost;
