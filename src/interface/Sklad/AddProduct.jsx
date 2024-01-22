// AddProduct.jsx
import React, { useState } from "react";
import { AddKassa } from "../../images";
import axios from "axios";

const AddProduct = () => {
  const [products, setProducts] = useState([
    {
      name: "",
    },
  ]);
  const [error, setError] = useState("");

  const handleInputChange = (value, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].name = value;
    setProducts(updatedProducts);
  };

  const handleAddRow = () => {
    // Check if any existing row has an empty product name
    if (products.some((product) => !product.name)) {
      // Display an error or handle it as needed
      setError("Ошибка: необходимо заполнить все названия продуктов.");
      return;
    }
    setError("");

    setProducts([
      ...products,
      {
        name: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    console.log(products);

    // Check if any field in any row is empty
    const isAnyFieldEmpty = products.some((row) =>
      Object.values(row).some((value) => !value)
    );

    if (isAnyFieldEmpty) {
      setError("Ошибка: все вводимые данные должны быть завершены.");
      return;
    }

    // Additional form submission logic...
    try {
      for (let i = 0; i < products.length; i++) {
        const formData = new FormData();
        formData.append("product_name", `${products[i].name}`);
        formData.append("product_description", "");
        formData.append("product_quantity", 0);
        formData.append("product_amount", 0);
        formData.append("product_photo", "");
        await axios.post("/products/new_product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setProducts([{ name: "" }]);
      setError("");
    } catch (error) {
      console.log(error);
      // Handle error if necessary
    }
  };

  const tableHead = ["№", "Название товара", "Действия"];

  return (
    <main>
      <form
        onSubmit={onSubmitForm}
        autoComplete="off"
        className="container w-10/12 mx-auto mt-10"
      >
        <p className="font-semibold text-xl">Добавление товаров</p>
        <section className="mt-5">
          <div>
            <p className="font-semibold">Товары</p>
            <table className="border border-collapse text-center mt-3 w-[50%]">
              <thead>
                <tr>
                  {tableHead.map((item, idx) => (
                    <th className="border p-2 text-sm" key={idx}>
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {products.map((row, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border">{index + 1}</td>
                    <td className="border">
                      <input
                        type="text"
                        className="px-2 outline-none text-sm w-full"
                        value={row.name}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index)
                        }
                      />
                    </td>
                    <td className="border bg-red-500">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        className="w-full p-2 text-white"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
            <div className="flex gap-1 w-full">
              <button
                type="button"
                onClick={handleAddRow}
                className="mt-2 rounded-md py-1 px-3 bg-gray-300"
              >
                +
              </button>

              <button
                type="submit"
                className="ml-2 mt-2 rounded-md py-1 px-2 bg-gray-300 flex items-center gap-1 text-sm"
              >
                <img className="w-4" src={AddKassa} alt="" />
                <p>Добавить товары</p>
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
};

export default AddProduct;
