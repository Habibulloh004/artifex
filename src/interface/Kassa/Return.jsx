import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Base, Cancel, bigBase, createData } from "../../images";
import CurrencyInput from "react-currency-input-field";
import PhoneInput from "react-phone-input-2";
import { useMyContext } from "../../context/Context";
import { API } from "../../components/data";

const Return = () => {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const [client, setClient] = useState(null);
  const [product, setProduct] = useState(null);
  const { f } = useMyContext();
  const [formData, setFormData] = useState({
    client: "",
    comment: "",
  });
  const [inputClientValue, setInputClientValue] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [inputProductValue, setInputProductValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [clientId, setClientId] = useState(null);
  const [productId, setProductId] = useState(null);
  const { formatPhoneNumber } = useMyContext();
  const [returnProd, setReturnProd] = useState({
    productId: "",
    sum: 0,
    dollar: 0,
    name: "",
    quantity: "",
  });
  const [retReqArray, setRetReqArray] = useState([]);
  const [openData, setOpenData] = useState(false);
  const [vozData, setVozData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productName = await axios.get(
          `${API}products/products_menu`
        );
        const clientName = await axios.get(`${API}users/all`);
        const vozvratData = await axios.get(`${API}vozvrats`);
        setClient(clientName.data);
        setProduct(productName.data);
        setVozData(vozvratData.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const clickOutside = (e) => {
      if (!e.composedPath().includes(ref.current)) {
        setInputClientValue("");
        setInputProductValue("");
      }
    };
    document.body.addEventListener("click", clickOutside);
    return () => {
      document.body.removeEventListener("click", clickOutside);
    };
  }, [ref]);

  const handleClientClick = (user) => {
    setInputClientValue("");
    setSelectedClient(user.phone);
    setFormData({ ...formData, client: user.phone });
    setClientId(user.id); // Set clientId when client is selected
  };

  const handleProductClick = (product) => {
    setInputProductValue("");
    setSelectedProduct(product.product_name);
    setProductId(product.id);
    setReturnProd({ ...returnProd, productId: product.id });
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    if (fieldName === "client") {
      setInputClientValue(value);
      setSelectedClient(value);
    } else if (fieldName === "name") {
      setInputProductValue(value);
      setSelectedProduct(value);
    }
  };
  const handleInputChangeProd = (fieldName, value) => {
    setReturnProd((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    setError("");
  };

  const renderAutocompleteList = (
    objects,
    inputValue,
    handleClick,
    labelKey,
    idKey
  ) => {
    // Ensure that objects is an array before using filter and map
    const filteredObjects =
      Array.isArray(objects) &&
      objects.filter((item) =>
        item[labelKey].toLowerCase().includes(inputValue.toLowerCase())
      );

    return (
      <ul
        ref={ref}
        className={`${
          !inputValue.length ||
          !Array.isArray(filteredObjects) ||
          filteredObjects.length === 0
            ? "hidden"
            : "flex"
        } flex-col absolute top-9 gap-2 w-[70%] py-3 rounded-lg bg-white_sec z-50`}
      >
        {inputValue.length > 0 &&
          Array.isArray(filteredObjects) &&
          filteredObjects.map((item, idx) => (
            <li
              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
              key={idx}
              onClick={() => {
                handleClick(item);
              }}
            >
              {labelKey === "phone"
                ? formatPhoneNumber(item[labelKey])
                : item[labelKey]}{" "}
              {idKey && <span className="hidden">{item[idKey]}</span>}
            </li>
          ))}
      </ul>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filterClientForName = client?.find(
      (cl) => cl.phone === formData?.client
    );

    try {
      if (
        Object.values(formData).some((value) => String(value).trim() === "")
      ) {
        setError("Пожалуйста, заполните все необходимые поля");
        return;
      } else {
        const newArray = retReqArray.map(
          ({ productId, quantity, sum, dollar }) => ({
            product_id: Number(productId),
            quantity: Number(quantity),
            summaSum: Number(sum),
            summaDol: Number(dollar),
          })
        );

        const requestData = {
          user_id: clientId === null ? filterClientForName.id : clientId,
          description: formData.comment,
          products: newArray,
        };

        // const myHeader = new Headers();
        // myHeader.append("Content-Type", "application/json");

        // const requestOptions = {
        //   method: "POST",
        //   headers: myHeader,
        //   body: JSON.stringify(requestData),
        //   redirect: "follow",
        // };
        // fetch("${API}vozvrat", requestOptions)
        //   .then((res) => res.json())
        //   .then((result) => console.log(result));

        const response = await axios.patch(
          `${API}vozvrat`, // replace with your API endpoint
          JSON.stringify(requestData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Update successful", response.data);

        setFormData({
          comment: "",
          client: "",
        });
        setInputClientValue("");
        setSelectedClient("");
        setInputProductValue("");
        setSelectedProduct("");
        setProductId(null); // Reset productId after submitting
        setClientId(null); // Reset clientId after submitting
        setError("");
        setRetReqArray([]);
        window.location.reload();
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
    setFormData({
      name: "",
      quantity: "",
      price: "",
      client: "",
    });
    setError("");
    setReturnProd({
      productId: "",
      sum: "",
      dollar: "",
      name: "",
      quantity: "",
    });
    setRetReqArray([])
  };

  const addRow = () => {
    if (
      returnProd.productId === "" ||
      returnProd.name === "" ||
      returnProd.quantity === ""
    ) {
      setError("Пожалуйста, заполните все необходимые поля");
      return;
    }

    if (returnProd.sum === "") {
      setReturnProd({ ...returnProd, sum: 0 });
    }
    if (returnProd.dollar === "") {
      setReturnProd({ ...returnProd, dollar: 0 });
    }
    setRetReqArray([...retReqArray, returnProd]);

    setReturnProd({
      productId: "",
      sum: "",
      dollar: "",
      name: "",
      quantity: "",
    });
    setSelectedProduct("");
  };


  if ((!product && !client) || product === null || client === null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container flex flex-col mx-auto w-10/12 mt-10">
        <ul className="flex gap-3">
          <li
            className={`${
              !openData ? "bg-[#D8F4C2]" : "bg-forth"
            } py-1 px-4 text-sm rounded-md cursor-pointer`}
            onClick={() => setOpenData(false)}
          >
            Возврат
          </li>
          <li
            className={`${
              openData ? "bg-[#D8F4C2]" : "bg-forth"
            } py-1 px-4 text-sm rounded-md cursor-pointer`}
            onClick={() => setOpenData(true)}
          >
            История возврат
          </li>
        </ul>
        <section className="flex">
          {openData ? (
            <article className="w-full mt-5">
              <table className="text-center w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 border border-secondary" colSpan={2}>
                      Названия товара
                    </th>
                    <th className="p-2 border border-secondary">Количество</th>
                    <th className="p-2 border border-secondary">Цена за КГ</th>
                    <th className="p-2 border border-secondary">
                      Цена продажа
                    </th>
                    <th className="p-2 border border-secondary">Комментария</th>
                  </tr>
                </thead>
                <tbody>
                  {vozData &&
                    vozData.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td className="border border-secondary p-2">
                            {i + 1}
                          </td>
                          <td className="border border-secondary p-2">
                            {item.products.map((itVoz, idx) => {
                              const findProd = product.find(
                                (pr) => pr.id === itVoz.product_id
                              );
                              return (
                                <span key={idx}>
                                  <span>{findProd.product_name}</span> <br />
                                </span>
                              );
                            })}
                          </td>
                          <td className="border border-secondary p-2">
                            {item.products.map((itVoz, idx) => {
                              const findProd = product.find(
                                (pr) => pr.id === itVoz.product_id
                              );
                              return (
                                <span key={idx}>
                                  <span>
                                    {f.format(itVoz.quantity)}{" "}
                                    {findProd.product_name.length >= 3
                                      ? "кг"
                                      : "г"}
                                  </span>{" "}
                                  <br />
                                </span>
                              );
                            })}
                          </td>
                          <td className="border border-secondary p-2">
                            {item.products.map((itVoz, idx) => {
                              return (
                                <span key={idx}>
                                  <span>{f.format(itVoz.summaDol)}</span> USD{" "}
                                  <span key={idx}>
                                    {f.format(itVoz.summaSum)}
                                  </span>{" "}
                                  сум <br />
                                </span>
                              );
                            })}
                          </td>
                          <td className="border border-secondary p-2">
                            {item.products.map((itVoz, idx) => {
                              return (
                                <span key={idx}>
                                  <span>{f.format(itVoz.summaDol)}</span> USD{" "}
                                  <span key={idx}>
                                    {f.format(itVoz.summaSum)}
                                  </span>{" "}
                                  сум <br />
                                </span>
                              );
                            })}
                          </td>
                          <td className="border border-secondary p-2">
                            {item.description}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </article>
          ) : (
            <>
              <article className="flex flex-col gap-5 w-1/2">
                <form
                  className="flex flex-col gap-3 mt-3"
                  onSubmit={handleSubmit}
                >
                  <p>Оплата</p>
                  <div className="flex flex-col gap-3 relative w-[70%]">
                    <PhoneInput
                      country={"uz"}
                      placeholder="Номер клиента"
                      value={selectedClient}
                      onChange={(value) => {
                        handleInputChange("client", value);
                      }}
                      inputStyle={{
                        background: "#DFDFDF",
                        width: "100%",
                        borderRadius: "0.375rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.25rem",
                      }}
                    />

                    {renderAutocompleteList(
                      client,
                      inputClientValue,
                      handleClientClick,
                      "phone",
                      "id" // Assuming 'id' is the field for client ID
                    )}
                  </div>
                  <textarea
                    placeholder="Комментария"
                    value={formData.comment}
                    onChange={(e) => {
                      handleInputChange("comment", e.target.value);
                    }}
                    className="bg-forth w-[70%] rounded-md text-sm p-2 min-h-[100px]"
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
              </article>
              <article className="flex flex-col gap-3 w-1/2">
                <p>Товар</p>
                <form className="flex gap-3 flex-wrap">
                  <div className="relative w-[40%]">
                    <input
                      type="text"
                      placeholder="Товар"
                      className="bg-forth w-full rounded-md text-sm p-2"
                      value={
                        selectedProduct ? selectedProduct : returnProd.name
                      }
                      onChange={(e) => {
                        handleInputChangeProd("name", e.target.value);
                        handleInputChange("name", e.target.value);
                      }}
                    />
                    {renderAutocompleteList(
                      product,
                      inputProductValue,
                      handleProductClick,
                      "product_name",
                      "id" // Assuming 'product_id' is the field for product ID
                    )}
                  </div>
                  <CurrencyInput
                    placeholder="Кол"
                    className="bg-forth w-[40%] rounded-md text-sm p-2"
                    value={returnProd.quantity}
                    onValueChange={(value, name) => {
                      handleInputChangeProd("quantity", value);
                    }}
                    step={0.01}
                    allowDecimals
                    decimalSeparator="."
                    groupSeparator=" "
                    prefix=""
                  />{" "}
                  <CurrencyInput
                    placeholder="Доллар"
                    className="bg-forth w-[40%] rounded-md text-sm p-2"
                    value={returnProd.dollar > 0 ? returnProd.dollar : ""}
                    onValueChange={(value, name) => {
                      handleInputChangeProd("dollar", value);
                    }}
                    step={0.01}
                    allowDecimals
                    decimalSeparator="."
                    groupSeparator=" "
                    prefix=""
                  />
                  <CurrencyInput
                    placeholder="Сум"
                    className="bg-forth w-[40%] rounded-md text-sm p-2"
                    value={returnProd.sum > 0 ? returnProd.sum : ""}
                    onValueChange={(value, name) => {
                      handleInputChangeProd("sum", value);
                    }}
                    step={0.01}
                    allowDecimals
                    decimalSeparator="."
                    groupSeparator=" "
                    prefix=""
                  />
                </form>
                <button
                  onClick={() => addRow()}
                  className="bg-forth p-2 w-[30px] h-[30px] flex justify-center items-center rounded-md"
                >
                  +
                </button>
                {retReqArray && (
                  <ul>
                    {retReqArray.map((item, i) => {
                      const findProd = product.find(
                        (items) => items.id === item.productId
                      );
                      return (
                        <li className="w-[80%] flex justify-between items-center gap-3" key={i}>
                          <span>
                            {i + 1}.{" "}
                            {findProd ? findProd.product_name : item.name}
                          </span>{" "}
                          <span>
                            {f.format(item.quantity)}{" "}
                            {findProd.product_name.length >= 3 ||
                            item.name.length >= 3
                              ? "кг"
                              : "г"}
                          </span>

                          <span>
                            {
                              item.dollar === undefined ? 0 : f.format(item.dollar) 
                            } USD
                            {" "}{" | "}{" "}
                            {
                              item.sum === undefined ? 0 :f.format(item.sum)
                            } сум
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </article>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Return;
