import React, { useEffect, useState } from "react";
import { AddKassa, Boss } from "../../images";
import axios from "axios";
import { useMyContext } from "../../context/Context";

const MenuBoss = () => {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState([]);
  const [textMsg, setTextMsg] = useState("");
  const { f } = useMyContext();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/products/products_menu")
      .then((response) => {
        setProducts(response.data);
        // Initialize prices with the same length as products and set default values
        setPrices(new Array(response.data.length).fill());
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePriceChange = (index, value) => {
    // Update prices array with the new value for the specified index
    const updatedPrices = [...prices];
    updatedPrices[index] = value;
    setPrices(updatedPrices);

    // Update products array with the new product_amount value
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      product_amount: value,
    };
    setProducts(updatedProducts);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (products === null) {
      // Handle the case when products are still being loaded
      setError("Loading products...");
      return;
    }

    try {
      // Update the prices array with the current values from the inputs
      const updatedPrices = prices.map((price, index) =>
        products[index].product_amount > 0 ? products[index].product_amount : 0
      );
      setPrices(updatedPrices);

      const isAnyFieldEmpty = products.some((row) => {
        // Check if product_amount is empty, not a number, or is less than or equal to 0
        return (
          row.product_amount === undefined ||
          row.product_amount === null || // Add null check if necessary
          isNaN(row.product_amount) ||
          row.product_amount <= 0
        );
      });

      if (isAnyFieldEmpty) {
        setError("Ошибка: все вводимые данные должны быть завершены.");
        return;
      } else {
        const sanitizedPrices = updatedPrices.map((price) =>
          price === undefined ? 0 : price
        );

        const updatedProducts = products.map((product, index) => ({
          ...product,
          product_amount: Number(sanitizedPrices[index]),
        }));

        const postRequests = updatedProducts.map(async (product) => {
          const formData = new FormData();
          formData.append("product_amount", `${product.product_amount}`); // Use the corresponding price from the sanitizedPrices array

          return axios.patch(
            `http://127.0.0.1:5000/products/update_product/${product.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        });

        await Promise.all(postRequests);
        setTextMsg("Цены на продукцию указаны");
        setPrices(new Array(products.length).fill()); // Reset prices to default values
        setError("");
        setTimeout(() => {
          setTextMsg("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      // Handle error if necessary
    }
  };

  const tableHead = ["№", "Название", "Цена", "Количество"];

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <form
        onSubmit={onSubmitForm}
        autoComplete="off"
        className="container w-10/12 mx-auto mt-10"
      >
        <div className="flex items-center gap-3">
          <img src={Boss} alt="" />
          <p className="font-semibold text-xl">Меню</p>
        </div>
        <section className="mt-5">
          <div>
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
                {!products ? (
                  <tr>
                    <td colSpan="4">Loading...</td>
                  </tr>
                ) : Array.isArray(products) && products.length > 0 ? (
                  products.map((prod, index) => (
                    <tr key={index} className="text-sm">
                      <td className="border py-2">{index + 1}</td>
                      <td className="border py-2">{prod.product_name}</td>
                      <td className="border py-2">
                        <input
                          type="number"
                          value={
                            prod.product_amount !== undefined &&
                            prod.product_amount !== null && prod.product_amount !== 0
                              ? prod.product_amount
                              : ""
                          }
                          onChange={(e) =>
                            handlePriceChange(index, e.target.value)
                          }
                          step={"any"}
                          className="px-2 outline-none text-sm w-full"
                        />
                      </td>
                      <td className="border py-2">
                        {f.format(prod.product_quantity)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No products available.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
            {textMsg && (
              <p className="text-sm mt-2 text-green-500">{textMsg}</p>
            )}
            <button
              type="submit"
              className="mt-3 rounded-md py-1 px-2 bg-gray-300 flex items-center gap-1 text-sm"
            >
              <img className="w-4" src={AddKassa} alt="" />
              <p>Сохранить</p>
            </button>
          </div>
        </section>
      </form>
    </main>
  );
};

export default MenuBoss;
