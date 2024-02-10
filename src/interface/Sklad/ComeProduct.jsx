import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Cancel, ComePRod, ComingBox, createData } from "../../images";
import CurrencyInput from "react-currency-input-field";
import { API } from "../../components/data";

const ComeProduct = () => {
  const ref = useRef(null);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
  });
  const [inputProductValue, setInputProductValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productName = await axios.get(
          `${API}products/products_menu`
        );
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
        setInputProductValue("");
      }
    };
    document.body.addEventListener("click", clickOutside);
    return () => {
      document.body.removeEventListener("click", clickOutside);
    };
  }, [ref]);

  // useEffect(() => {
  //   console.log("pr",product);
  // }, [product]);

  const handleProductClick = (product) => {
    setInputProductValue(""); // Clear input field
    setSelectedProduct(product.product_name);
    setProductId(product.product_id);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    if (fieldName === "name") {
      setInputProductValue(value);
      setSelectedProduct(value);
    }
  };

  const renderAutocompleteList = (
    objects,
    inputValue,
    handleClick,
    labelKey,
    valueKey
  ) => {
    const filteredObjects =
      objects && Array.isArray(objects)
        ? objects.filter((item) =>
            item[labelKey].toLowerCase().includes(inputValue.toLowerCase())
          )
        : [];

    return !objects ? (
      "Loading..."
    ) : (
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
                setProductId(item[valueKey]);
              }}
            >
              {item[labelKey]}
            </li>
          ))}
      </ul>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const findProductId = product.find(
      (prod) => prod.product_name === formData.name
    );

    const formDataToSubmit = {
      name: selectedProduct ? selectedProduct : formData.name,
      quantity:
        selectedProduct.length >= 3
          ? formData.quantity * 1000
          : formData.quantity,
      productIdObj: productId === null ? findProductId.id : productId,
    };


    const requestData = new FormData();
    requestData.append("product_quantity", `${formDataToSubmit.quantity}`);

    try {
      if (
        Object.values(formDataToSubmit).some(
          (value) => String(value).trim() === "" // Convert value to string before trim
        )
      ) {
        setError("Please fill in all the required fields");
      } else {
        setFormData({
          name: "",
          quantity: "",
        });
        setInputProductValue("");
        setSelectedProduct("");
        setProductId(null); // Reset productId after submitting
        setError("");
        await axios.patch(
          `${API}products/update_product/${formDataToSubmit.productIdObj}`,
          requestData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Произошла ошибка");
        console.error("Server error response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError("Ответ от сервера не получен");
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Произошла ошибка при обработке запроса");
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

  if ((!product && !productId) || product === null) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container flex mx-auto w-10/12 mt-10">
        <article className="flex flex-col gap-5 w-1/2">
          <section className="flex items-center gap-3">
            <img src={ComePRod} className="w-[45px] h-10" alt="" />
            <p className="text-xl font-semibold">Приход</p>
          </section>
          <form
            className="flex flex-col gap-3 mt-5 w-10/12 mx-auto"
            onSubmit={handleSubmit}
          >
            <p>Новый товар</p>
            <div className="flex flex-col gap-3 relative">
              <input
                type="text"
                placeholder="Название"
                className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
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
                "id"
              )}
            </div>
            <CurrencyInput
              placeholder="Количество"
              className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
              value={formData.quantity}
              onValueChange={(value) => {
                handleInputChange("quantity", value);
              }}
              step={0.01}
              allowDecimals
              decimalSeparator="."
              groupSeparator=" "
              prefix=""
            />
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 mt-3 bg-forth "
              type="submit"
            >
              <img src={createData} alt="" /> <p>Подтвердить</p>
            </button>
            <button
              onClick={(e) => cancel(e)}
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth "
            >
              <img src={Cancel} alt="" /> <p>Отменить</p>
            </button>
          </form>
        </article>
        <article className="flex items-start">
          <img className="w-[300px] mt-8" src={ComingBox} alt="" />
        </article>
      </div>
    </main>
  );
};

export default ComeProduct;
