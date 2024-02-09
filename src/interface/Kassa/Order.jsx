import React, { useEffect, useRef, useState } from "react";
import { AddKassa } from "../../images";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import { useMyContext } from "../../context/Context";
import CurrencyInput from "react-currency-input-field";

const Order = () => {
  //   const Products = () => {
  //     const { control, register, handleSubmit, setValue, watch } = useForm({
  //       defaultValues: {
  //         products: [],
  //       },
  //     });

  //     const { fields, append, remove } = useFieldArray({
  //       control,
  //       name: "products",
  //     });

  //     const onSubmit = (data) => {
  //       console.log(data);
  //     };

  //     return (
  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         <p className="text-lg font-semibold">Товары</p>
  //         <table className="border border-collapse mt-3 w-full">
  //           <thead>
  //             <tr>
  //               <th className="border p-2 text-sm">№</th>
  //               <th className="border p-2 text-sm">Названия товара</th>
  //               <th className="border p-2 text-sm">Качество белого краски</th>
  //               <th className="border p-2 text-sm">Количество</th>
  //               <th className="border p-2 text-sm">Цена</th>
  //               <th className="border p-2 text-sm">Действия</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {fields.map((row, index) => (
  //               <tr key={row.id}>
  //                 <td className="border">{index + 1}</td>
  //                 <td className="border">
  //                   <input
  //                     {...register(`products.${index}.name`)}
  //                     type="text"
  //                     className="px-2 outline-none text-sm w-full"
  //                   />
  //                 </td>
  //                 <td className="border">
  //                   <input
  //                     {...register(`products.${index}.quality`)}
  //                     type="text"
  //                     className="px-2 outline-none text-sm w-full"
  //                   />
  //                 </td>
  //                 <td className="border">
  //                   <input
  //                     {...register(`products.${index}.amount`)}
  //                     type="text"
  //                     className="px-2 outline-none text-sm w-full"
  //                   />
  //                 </td>
  //                 <td className="border">
  //                   <input
  //                     {...register(`products.${index}.price`)}
  //                     type="text"
  //                     className="px-2 outline-none text-sm w-full"
  //                   />
  //                 </td>
  //                 <td className="border">
  //                   <button
  //                     type="button"
  //                     onClick={() => remove(index)}
  //                     className="bg-red-500 p-2 text-white"
  //                   >
  //                     O'chirish
  //                   </button>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //         <button
  //           type="button"
  //           onClick={() => {
  //             append({ name: "", quality: "", amount: "", price: "" });
  //           }}
  //           className="mt-2 p-2 bg-forth"
  //         >
  //           Qator qo'shish
  //         </button>
  //         <button type="submit" className="mt-2 p-2 bg-green-500 text-white">
  //           Saqlash
  //         </button>
  //       </form>
  //     );
  //   };
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [inputProduct, setInputProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [products, setProducts] = useState([
    {
      name: "",
      quality: "",
      amount: "",
      price: "",
      product_id: "",
      recept: [""],
    },
  ]);
  const [clients, setClients] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");
  const [drop, setDrop] = useState(false);
  const { formatPhoneNumber, f } = useMyContext();
  const ref = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (!e.composedPath().includes(ref.current)) {
        setDrop(false);
      }
    };
    document.body.addEventListener("click", clickOutside);
    return () => {
      document.body.removeEventListener("click", clickOutside);
    };
  }, [ref]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productGet = await axios.get(
          "http://127.0.0.1:5000/products/products_menu"
        );
        const clientGet = await axios.get("http://127.0.0.1:5000/users/all");
        setProduct(
          productGet.data.filter(
            (prod) => prod.product_quantity > 0 && prod.product_name.length >= 3
          )
        );
        setClients(clientGet.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (value, index) => {
    try {
      const updatedProducts = [...products];
      updatedProducts[index].quality = value;

      setInputProduct(value);
      setFilteredProducts((prev) => ({ ...prev, [index]: [] }));

      // Use the product state for filtering
      const filteredData = product.filter((prod) =>
        prod.product_name.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredProducts((prev) => ({ ...prev, [index]: filteredData }));
      setProducts(updatedProducts);

      // Check if filtered products are empty
      if (filteredData.length === 0) {
        setError(`Нет данных для "${value}"`);
      } else {
        setError("");
      }
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  const handleProductSelect = (product, index) => {
    const updatedProducts = [...products];
    updatedProducts[index].quality = product.product_name;
    updatedProducts[index].product_id = Number(product.id);

    setSelectedProducts((prev) => ({ ...prev, [index]: product }));
    setFilteredProducts((prev) => ({ ...prev, [index]: [] }));
    setProducts(updatedProducts);
  };

  const handleAddRow = () => {
    const updatedProducts = [
      ...products,
      {
        name: "",
        quality: "",
        amount: "",
        price: "",
        product_id: "",
        recept: [],
      },
    ];

    // Check if the last row is completely empty
    const isLastRowEmpty =
      updatedProducts.length > 0 &&
      Object.values(updatedProducts[updatedProducts.length - 1]).every(
        (value) => !value
      );

    if (isLastRowEmpty) {
      setError("Ошибка: все вводимые данные должны быть завершены.");
      return;
    }

    setError("");
    setProducts(updatedProducts);
  };

  const handleRemoveRow = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };
  const handleClientInput = (value) => {
    setInputNumber(value);
    setDrop(true);

    setFilteredClients(
      clients?.filter((client) =>
        client.phone?.toLowerCase().includes(value?.toLowerCase())
      ) || []
    );

    if (!value) {
      setFilteredClients([]);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const findClientFromNumber = clients.find(
      (client) => client.phone === inputNumber
    );

    const isAnyFieldEmpty = products.some((row) =>
      Object.values(row).some((value) => !value)
    );

    if (isAnyFieldEmpty || selectedClient == null) {
      setError("Ошибка: все вводимые данные должны быть завершены.");
      return;
    }
    const formdata = new FormData();
    formdata.append(
      "products",
      "" +
        JSON.stringify(
          products.map(({ quality, ...rest }) => ({
            ...rest,
            amount: +rest.amount * 1000,
            price: +rest.price / 1000,
          }))
        )
    );
    formdata.append(
      "user_id",
      selectedClient === null ? findClientFromNumber?.id : selectedClient?.id
    );
    formdata.append("pay_method", "ДОЛГ");

    try {
      await axios.post("http://127.0.0.1:5000/orders/new_order", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProducts([
        { name: "", quality: "", amount: "", price: "", product_id: "" },
      ]);
      setInputNumber("");
      setError("");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const tableHead = [
    "№",
    "Названия товара",
    "Качество белого краски",
    "Количество",
    "Цена",
    "Действия",
  ];

  if (!clients) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <form
        onSubmit={onSubmitForm}
        autoComplete="off"
        className="container w-10/12 mx-auto mt-10"
      >
        <div className="flex gap-4 items-center">
          <p className={`font-semibold text-xl`}>Новый заказ</p>
          <div className="flex flex-col gap-3 relative">
            <PhoneInput
              country={"uz"}
              placeholder="Номер клиента"
              value={inputNumber}
              onChange={(value) => {
                setInputNumber(value);
                setSelectedClient(null);
                handleClientInput(value);
              }}
              inputStyle={{
                background: "#DFDFDF",
                width: "100%",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
              }}
            />

            {drop && filteredClients.length > 0 && inputNumber.length > 0 && (
              <ul
                ref={ref}
                className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-[200px] py-3 rounded-lg bg-fifth z-50"
              >
                {filteredClients.map((client, idx) => (
                  <li
                    className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                    key={idx}
                    onClick={() => {
                      setInputNumber(client.phone);
                      setSelectedClient(client);
                      setFilteredClients([]);
                    }}
                  >
                    {formatPhoneNumber(client.phone)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedClient && <p className="">{selectedClient.full_name}</p>}
        </div>
        <section className="mt-5">
          <div>
            <p className="font-semibold ">Товары</p>
            <table className="border border-collapse text-center mt-3 w-full">
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
                        onChange={(e) => {
                          const updatedProducts = [...products];
                          updatedProducts[index].name = e.target.value;
                          setProducts(updatedProducts);
                        }}
                      />
                    </td>
                    <td className="border relative">
                      <input
                        type="text"
                        autoComplete="off"
                        className="px-2 outline-none text-sm w-full"
                        value={row.quality}
                        onChange={(e) =>
                          handleInputChange(e.target.value, index)
                        }
                      />
                      {inputProduct && filteredProducts[index]?.length > 0 && (
                        <ul className="flex flex-col overflow-auto absolute gap-2 h-[200px] p-3 rounded-lg bg-fifth z-50">
                          {filteredProducts[index].map((prod, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => handleProductSelect(prod, index)}
                            >
                              {prod.product_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="border">
                      <CurrencyInput
                        className="px-2 outline-none text-sm w-full"
                        value={row.amount}
                        onValueChange={(value, name) => {
                          const updatedProducts = [...products];
                          updatedProducts[index].amount = value;
                          setProducts(updatedProducts);
                        }}
                        step={0.01}
                        allowDecimals
                        decimalSeparator="."
                        groupSeparator=" "
                        prefix=""
                      />
                    </td>
                    <td className="border">
                      <CurrencyInput
                        className="px-2 outline-none text-sm w-full"
                        value={row.price}
                        onValueChange={(value, name) => {
                          const updatedProducts = [...products];
                          updatedProducts[index].price = value;
                          setProducts(updatedProducts);
                        }}
                        step={0.01}
                        allowDecimals
                        decimalSeparator="."
                        groupSeparator=" "
                        prefix=""
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
                className="mt-2 rounded-md py-1 px-3 bg-forth"
              >
                +
              </button>

              <button
                type="submit"
                onClick={onSubmitForm}
                className="ml-2 mt-2 rounded-md py-1 px-2 bg-forth flex items-center gap-1 text-sm"
              >
                <img className="w-4" src={AddKassa} alt="" />
                <p>Переслать на колировка</p>
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
};

export default Order;
