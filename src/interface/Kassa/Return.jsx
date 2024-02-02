import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Base, Cancel, bigBase, createData } from "../../images";
import CurrencyInput from "react-currency-input-field";
import PhoneInput from "react-phone-input-2";
import { useMyContext } from "../../context/Context";

const Return = () => {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const [client, setClient] = useState(null);
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    client: "",
  });
  const [inputClientValue, setInputClientValue] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [inputProductValue, setInputProductValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [clientId, setClientId] = useState(null);
  const [productId, setProductId] = useState(null);
  const { formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productName = await axios.get(
          "http://127.0.0.1:5000/products/products_menu"
        );
        const clientName = await axios.get("http://127.0.0.1:5000/users/all");
        setClient(clientName.data);
        setProduct(productName.data);
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

  // useEffect(() => {
  //   console.log("pr", product);
  // }, [product]);

  const handleClientClick = (user) => {
    setInputClientValue("");
    setSelectedClient(user.phone);
    setClientId(user.id); // Set clientId when client is selected
  };

  const handleProductClick = (product) => {
    setInputProductValue("");
    setSelectedProduct(product.product_name);
    setProductId(product.id); // Set productId when product is selected
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

  const renderAutocompleteList = (
    objects,
    inputValue,
    handleClick,
    labelKey,
    idKey // Add idKey parameter to get the ID
  ) => {
    const filteredObjects = objects?.filter((item) =>
      item[labelKey].toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <ul
        ref={ref}
        className={`${
          !inputValue.length || filteredObjects?.length === 0
            ? "hidden"
            : "flex"
        } flex-col absolute top-9 gap-2 w-[70%] py-3 rounded-lg bg-white_sec z-50`}
      >
        {inputValue.length > 0 &&
          filteredObjects?.map((item, idx) => (
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

    const filterClientForName = client.find(
      (client) => client.phone === formData.client
    );
    const filterProductForName = product.find(
      (prod) => prod.product_name === formData.name
    );

    const formDataToSubmit = {
      name: selectedProduct ? selectedProduct : formData.name,
      quantity: formData.quantity,
      price: formData.price,
      client: selectedClient ? selectedClient : formData.client,
      clientId: clientId === null ? filterClientForName?.id : clientId,
      productId: productId === null ? filterProductForName?.id : productId,
    };

    try {
      if (
        Object.values(formDataToSubmit).some(
          (value) => String(value).trim() === ""
        )
      ) {
        setError("Please fill in all the required fields");
      } else {
        const formReq = new FormData();
        formReq.append(
          "user_id",
          `${clientId === null ? filterClientForName[0].id : clientId}`
        );
        formReq.append(
          "product_id",
          `${productId === null ? filterProductForName[0].id : productId}`
        );
        formReq.append("quantity", `${formDataToSubmit.quantity}`);
        formReq.append("summa", `${formDataToSubmit.price}`);

        const response = await axios.patch(
          "http://127.0.0.1:5000/vozvrat", // replace with your API endpoint
          formReq,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Update successful", response.data);

        setFormData({
          name: "",
          quantity: "",
          price: "",
          client: "",
        });
        setInputClientValue("");
        setSelectedClient("");
        setInputProductValue("");
        setSelectedProduct("");
        setProductId(null); // Reset productId after submitting
        setClientId(null); // Reset clientId after submitting
        setError("");

        console.log("form", formDataToSubmit);
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
  };

  if (!product && !client) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container flex mx-auto w-10/12 mt-10">
        <article className="flex flex-col gap-5 w-1/2">
          <section className="flex items-center gap-3">
            <img src={Base} className="w-[45px] h-10" alt="" />
            <p className="text-xl font-semibold">Возврат</p>
          </section>
          <form
            className="flex flex-col gap-3 mt-5 w-10/12 mx-auto"
            onSubmit={handleSubmit}
          >
            <p>Данные товара</p>
            <div className="flex flex-col gap-3 relative">
              <input
                type="text"
                placeholder="Название"
                className="bg-forth w-[70%] rounded-md text-sm p-2"
                value={selectedProduct}
                onChange={(e) => {
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
              placeholder="Количество"
              className="bg-forth w-[70%] rounded-md text-sm p-2"
              value={formData.quantity}
              onValueChange={(value, name) => {
                handleInputChange("quantity", value);
              }}
              step={0.01}
              allowDecimals
              decimalSeparator="."
              groupSeparator=","
              prefix=""
            />
            <CurrencyInput
              placeholder="Цена"
              className="bg-forth w-[70%] rounded-md text-sm p-2"
              value={formData.price}
              onValueChange={(value, name) => {
                handleInputChange("price", value);
              }}
              step={0.01}
              allowDecimals
              decimalSeparator="."
              groupSeparator=","
              prefix=""
            />
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
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 mt-3 bg-forth ml-10"
              type="submit"
            >
              <img src={createData} alt="" /> <p>Подтвердить</p>
            </button>
            <button
              onClick={(e) => cancel(e)}
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth ml-10"
            >
              <img src={Cancel} alt="" /> <p>Отменить</p>
            </button>
          </form>
        </article>
        <article className="flex items-start">
          <img className="w-[300px] mt-8" src={bigBase} alt="" />
        </article>
      </div>
    </main>
  );
};

export default Return;
