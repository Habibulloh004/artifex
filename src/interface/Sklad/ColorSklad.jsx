import axios from "axios";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddKassa } from "../../images";

const ColorSklad = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [priceProducts, setPriceProducts] = useState(null);
  const [nameProducts, setNameProducts] = useState(null);
  const [objProd, setObjProd] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValues, setInputValues] = useState([]);
  const [allPrice, setAllPrice] = useState(0);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [recept, setRecept] = useState(null);
  const [colorsObj, setColorsObj] = useState([
    { name: "AN", color: "#FEFD0C" },
    { name: "B", color: "#D0CECF" },
    { name: "BK", color: "#757170" },
    { name: "C", color: "#BF8F00" },
    { name: "D", color: "#00AF53" },
    { name: "DL", color: "#90D151" },
    { name: "EG", color: "#0070C8" },
    { name: "ER", color: "#03AEF4" },
    { name: "F", color: "#C10000" },
    { name: "K", color: "#FFFFFF" },
    { name: "N", color: "#0038A4" },
    { name: "OS", color: "#F87E19" },
    { name: "P", color: "#DF1ECC" },
    { name: "QS", color: "#FA0300" },
    { name: "V", color: "#C35C0A" },
    { name: "XS", color: "#E6DD00" },
  ]);
  const nameRefs = useRef(
    Array(16)
      .fill(null)
      .map(() => createRef())
  );
  const priceRef = useRef(
    Array(16)
      .fill(null)
      .map(() => createRef())
  );
  const quantityRef = useRef(
    Array(16)
      .fill(null)
      .map(() => createRef())
  );

  useEffect(() => {
    const orderApi = "/orders/all_orders";
    const productApi = "/products/products_menu";

    axios
      .get(orderApi)
      .then((response) => {
        setOrders(response.data.find((order) => order.order_id === Number(id)));
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(productApi)
      .then((response) => {
        const filteredProducts = response.data.filter(
          (product) => product.product_name.length < 3
        );

        if (filteredProducts && colorsObj) {
          const updatedProducts = filteredProducts.map((product) => {
            const matchingColor = colorsObj.find(
              (color) => color.name === product.product_name
            );
            const productColor = matchingColor ? matchingColor.color : "";
            return { ...product, color: productColor };
          });
          setProducts(updatedProducts);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  useEffect(() => {
    if (products) {
      const productNamesArray = products.map((product) => ({
        product_id: product.id,
        product_name: product.product_name,
        product_color: product.color,
      }));

      const productPricesArray = products.map((product) => ({
        product_id: product.id,
        product_price: product.product_amount,
        product_color: product.color,
      }));
      setPriceProducts(productPricesArray);
      setNameProducts(productNamesArray);
    }
  }, [products]);

  useEffect(() => {
    if (orders) {
      const parsedProducts = JSON.parse(orders.products);

      // Clean up recept arrays by converting empty strings to null
      const cleanedProducts = parsedProducts.map((product) => {
        if (product.recept && Array.isArray(product.recept)) {
          // Convert empty strings to null in the recept array
          product.recept[0] === "" && product?.recept?.shift();
        }
        return product;
      });

      setObjProd(cleanedProducts.map((item) => ({ ...item, recept: [] })));
      setSelectedProduct(cleanedProducts[0]); // Select the first product by default
    }
  }, [orders]);

  const handleProductClick = (index, product) => {
    setSelectedProductIndex(index);
    setSelectedProduct(product);

    const filteredIndexes = quantityRef.current
      .map((item, index) => (item.current.value > 0 ? index : null))
      .filter((index) => index !== null);

    if (objProd) {
      setObjProd((prevObjProd) => {
        const updatedRecept = prevObjProd.map((item, index) => {
          if (index === selectedProductIndex) {
            // Tanlangan indeksdagi obyektni o'zgartirish
            const updatedReceptForIndex = item.recept
              .filter((_, index) => !filteredIndexes.includes(index))
              .concat(
                filteredIndexes.map((index) => ({
                  product_id: +nameRefs.current[index].current.innerText,
                  amount: +quantityRef.current[index].current.value,
                  price: +priceRef.current[index].current.innerText.slice(
                    0,
                    -1
                  ),
                }))
              );
            return { ...item, recept: updatedReceptForIndex };
          }
          return item;
        });

        return updatedRecept;
      });
    }
  };

  const renderProductDetails = (product, index) => (
    <ul
      key={product.product_id}
      className={` flex flex-col gap-3`}
      onClick={() => handleProductClick(index, product)}
    >
      <li className="w-[50%] flex">
        <p>Товар:</p>{" "}
        <span className="ml-auto bg-fifth w-[60%] px-2 py-1 rounded-md">
          {product.name}
        </span>
      </li>
      <li className="w-[50%] flex">
        <p> Количество:</p>{" "}
        <span className="ml-auto bg-fifth w-[60%] px-2 py-1 rounded-md">
          {product.amount}
        </span>
      </li>
      <li className="w-[50%] flex">
        <p> Цена:</p>{" "}
        <span className="ml-auto bg-fifth w-[60%] px-2 py-1 rounded-md">
          {product.price}
        </span>
      </li>
    </ul>
  );

  const handleInputChange = (rowIndex, columnName, value) => {
    const newInputValues = [...inputValues];
    if (!newInputValues[rowIndex]) {
      newInputValues[rowIndex] = {};
    }
    newInputValues[rowIndex][columnName] = value;
    setInputValues(newInputValues);
  };

  useEffect(() => {
    setInputValues(products?.map(() => ({ quantity: 0, price: "" })) || []);
  }, [products]);

  useEffect(() => {
    // Calculate allPrice here
    const updatedAllPrice = inputValues.map((item, idx) => {
      const quantity = Number(item.quantity);
      const productAmount = Number(products[idx].product_amount);

      if (!isNaN(quantity) && !isNaN(productAmount)) {
        return quantity * productAmount;
      }

      return 0;
    });

    setAllPrice(updatedAllPrice);
  }, [inputValues, products]);

  useEffect(() => {
    setInputValues(products?.map(() => ({ quantity: "", price: "" })) || []);
  }, [products]);

  useEffect(() => {
    if (objProd) {
      // Calculate total prices for each product
      const totalPrices = objProd.map((product) => {
        // Check if product and product.price are not null or undefined
        const mainProductTotal =
          product && product.price && product.amount
            ? Number(product.price) * Number(product.amount)
            : 0;

        const receptTotal =
          product.recept?.reduce((total, item) => {
            // Check if item, item.price, and item.amount are not null or undefined
            const itemPrice = item && item.price ? Number(item.price) : 0;
            const itemAmount = item && item.amount ? Number(item.amount) : 0;

            // Multiply amount and price for each item in the recept
            const itemTotal =
              isNaN(itemPrice) || isNaN(itemAmount)
                ? 0
                : itemPrice * itemAmount;

            return total + itemTotal;
          }, 0) || 0;

        // Include both main product total and recept total
        return mainProductTotal + receptTotal;
      });

      // Sum up total prices for all products
      const totalPriceSum = totalPrices.reduce(
        (total, price) => total + price,
        0
      );

      // Set the total price in state
      setOrderTotalPrice(totalPriceSum || 0);
    }
  }, [objProd, setOrderTotalPrice]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    // var formdata = new FormData();
    // formdata.append(
    //   "products",
    //   '[{"product_id" : 1, "name":"blue", "amount":10, "recept":[{"product_id" :4, "amount":7, "price":1}, {"product_id" : 3, "amount":7, "price":1}], "price":100}]'
    // );
    // formdata.append("user_id", "1");
    // formdata.append("pay_method", "ДОЛГ");

    const filteredIndexes = quantityRef.current
      .map((item, index) => (item.current.value > 0 ? index : null))
      .filter((index) => index !== null);

    if (objProd) {
      setObjProd((prevObjProd) => {
        const updatedRecept = prevObjProd.map((item, index) => {
          if (index === selectedProductIndex) {
            const updatedReceptForIndex = item.recept
              .filter((_, index) => !filteredIndexes.includes(index))
              .concat(
                filteredIndexes.map((index) => ({
                  product_id: +nameRefs.current[index].current.innerText,
                  amount: +quantityRef.current[index].current.value,
                  price: +priceRef.current[index].current.innerText.slice(
                    0,
                    -1
                  ),
                }))
              );
            return { ...item, recept: updatedReceptForIndex };
          }
          return item;
        });
        setObjProd(updatedRecept);
        let reqArray = [];

        for (let i = 0; i < updatedRecept.length; i++) {
          // const formDataPut = new FormData();
          // formDataPut.append("product_id", `${updatedRecept[i]?.product_id}`);
          // formDataPut.append("name", `${updatedRecept[i]?.name}`);
          // formDataPut.append("amount", `${updatedRecept[i]?.amount}`);
          // formDataPut.append(
          //   "recept",
          //   `${JSON.stringify(updatedRecept[i]?.recept)}`
          // );
          // formDataPut.append("price", `${updatedRecept[i]?.price}`);
          const formDataPut = {
            product_id: updatedRecept[i].product_id,
            name: updatedRecept[i].name,
            amount: updatedRecept[i].amount,
            recept: updatedRecept[i].recept,
            price: updatedRecept[i].price,
          };
          reqArray.push(formDataPut);
        }

        const reqForm = {
          products: reqArray,
          user_id: orders.user_id,
          pay_method: "ДОЛГ",
        };

        var requestOptions = {
          method: "PUT",
          body: JSON.stringify(reqForm), // JSON ma'lumotlarni yuborish
          headers: {
            "Content-Type": "application/json", // JSON ma'lumotlarini so'rovda o'zgartirish
          },
          redirect: "follow",
        };

        fetch(`/orders/put_order/${id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setInputValues(
              inputValues.map(() => ({ quantity: "", price: "" }))
            );
          })
          .catch((error) => console.log("error", error));

        // for (let i = 0; i < updatedRecept.length; i++) {
        //   const formDataPut = new FormData();
        //   formDataPut.append("product_id", `${updatedRecept[i]?.product_id}`);
        //   formDataPut.append("name", `${updatedRecept[i]?.name}`);
        //   formDataPut.append("amount", `${updatedRecept[i]?.amount}`);
        //   formDataPut.append("recept", `${JSON.stringify(updatedRecept[i]?.recept)}`);
        //   formDataPut.append("price", `${updatedRecept[i]?.price}`)
        //   console.log(updatedRecept);
        //   reqArray.push(formDataPut);
        // }
        // const reqForm = new FormData();
        // reqForm.append("products", "" + JSON.stringify(reqArray));
        // reqForm.append("user_id", `${orders.user_id}`);
        // reqForm.append("pay_method", "ДОЛГ");

        // var requestOptions = {
        //   method: "PUT",
        //   body: reqForm,
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   redirect: "follow",
        // };

        // fetch(`/orders/put_order/${id}`, requestOptions)
        //   .then((response) => response.text())
        //   .then((result) => console.log(result))
        //   .catch((error) => console.log("error", error));

        return updatedRecept;
      });
      navigate("/sklad/request")
    }
  };

  useEffect(() => {
    setInputValues(inputValues.map(() => ({ quantity: "", price: "" })));
  }, [selectedProductIndex]);

  if (!orders) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <form className="container w-10/12 mx-auto mt-10 ">
        <ul className="flex text-sm">
          {objProd?.map((item, idx) => (
            <li
              key={item.product_id}
              className={`${
                selectedProductIndex === idx ? "bg-[#D8F4C2]" : "bg-fifth"
              } py-2 px-5 cursor-pointer`}
              onClick={() => handleProductClick(idx, item)}
            >
              <p>{idx + 1}-товар</p>
            </li>
          ))}
        </ul>
        <section className="mt-7">
          {selectedProduct &&
            renderProductDetails(selectedProduct, selectedProductIndex)}
        </section>
        <div className="mt-4">
          <div className="container overflow-x-auto">
            <table className="border w-full border-forth text-center mt-5 text-sm ">
              <tbody>
                <tr>
                  <td className="border border-forth">Название</td>
                  {nameProducts?.map((item, idx) => (
                    <td
                      className={`border border-forth`}
                      style={{ background: item.product_color }}
                      key={idx}
                    >
                      <p className="relative py-2">
                        {item.product_name}{" "}
                        <span
                          ref={nameRefs.current[idx]}
                          className="absolute opacity-0 inset-0 m-auto w-full h-full"
                        >
                          {item.product_id}
                        </span>
                      </p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-forth">Цена за грамм</td>
                  {priceProducts?.map((item, idx) => (
                    <td
                      className="border border-forth p-2"
                      ref={priceRef.current[idx]}
                      style={{ background: item.product_color }}
                      key={idx}
                    >
                      {item.product_price}$
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-forth">Количество</td>
                  {products?.map((item, idx) => (
                    <td
                      className={`border border-forth`}
                      style={{ background: item?.product_quantity <= 0 ? "black" : item.color }}
                      key={idx}
                    >
                      <input
                        type="text"
                        className="outline-none text-center bg-inherit w-full py-2"
                        ref={quantityRef.current[idx]}
                        value={
                          inputValues[idx]?.quantity === 0
                            ? 0
                            : inputValues[idx]?.quantity ?? ""
                        }
                        onChange={(e) =>
                          handleInputChange(idx, "quantity", e.target.value)
                        }
                        disabled={item?.product_quantity <= 0 && "true"}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-forth">Сумма</td>
                  {products?.map((item, idx) => (
                    <td className="border border-forth" key={idx}>
                      <input
                        type="text"
                        className="outline-none text-center w-full p-2"
                        value={
                          isNaN(inputValues[idx]?.quantity) ||
                          isNaN(item.product_amount)
                            ? ""
                            : `${
                                inputValues[idx]?.quantity * item.product_amount
                              }$`
                        }
                        disabled
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-forth p-2">Итого</td>
                  <td
                    className="border border-forth bg-[#B5DD8F] text-center py-2"
                    colSpan={products?.length}
                  >
                    {allPrice.reduce(
                      (total, currentValue) => total + currentValue,
                      0
                    )}
                    $
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <article className="flex gap-3 items-center mt-5">
            <p>Общая сумма товара</p>
            <p className="w-24 py-px bg-forth rounded-md text-center">
              {orderTotalPrice}$
            </p>
            <button
              type="submit"
              onClick={onSubmitForm}
              className="ml-auto rounded-md py-1 px-2 bg-forth flex items-center gap-1 text-sm"
            >
              <img className="w-4" src={AddKassa} alt="" />
              <p>Переслать на кассу</p>
            </button>{" "}
          </article>
        </div>
      </form>
    </main>
  );
};

export default ColorSklad;
