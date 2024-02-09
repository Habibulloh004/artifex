import axios from "axios";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddKassa } from "../../images";
import CurrencyInput from "react-currency-input-field";
import { useMyContext } from "../../context/Context";

const ColorSklad = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState(null);
  const [priceProducts, setPriceProducts] = useState(null);
  const [objProd, setObjProd] = useState(null);
  const [nameProducts, setNameProducts] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValues, setInputValues] = useState([]);
  const [error, setError] = useState("")
  const [allPrice, setAllPrice] = useState(0);
  const [orderTotalPrice, setOrderTotalPrice] = useState(0);
  const [orderProductPrice, setOrderProductPrice] = useState(0);
  const [orderReceptPrice, setOrderReceptPrice] = useState(0);
  const { f } = useMyContext();
  const [commentInputs, setCommentInputs] = useState(
    Array(objProd?.length).fill("")
  );
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
    const orderApi = `http://127.0.0.1:5000/orders/all_orders`;
    const productApi = `http://127.0.0.1:5000/products/products_menu`;

    axios
      .get(orderApi)
      .then((response) => {
        const order = response.data.find(
          (order) => order.order_id === Number(id)
        );
        setOrders(order);
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

      const cleanedProducts = parsedProducts.map((product) => {
        if (product.recept && Array.isArray(product.recept)) {
          product.recept[0] === "" && product?.recept?.shift();
        }
        return product;
      });

      setObjProd(
        cleanedProducts.map((item) => ({
          ...item,
          recept: [],
          description: "",
        }))
      );
      setSelectedProduct(cleanedProducts[0]); // Select the first product by default
    }
  }, [orders]);

  const handleProductClick = (index, product) => {
    setSelectedProductIndex(index);
    setSelectedProduct(product);

    const filteredIndexes = quantityRef.current
      .map((item, index) =>
        item.current && item.current.value > 0 ? index : null
      )
      .filter((index) => index !== null);

    if (objProd) {
      setObjProd((prevObjProd) => {
        const updatedRecept = prevObjProd.map((item, index) => {
          if (index === selectedProductIndex) {
            const updatedReceptForIndex = item.recept
              .filter((_, index) => !filteredIndexes.includes(index))
              .concat(
                filteredIndexes.map((index) => ({
                  product_id: Number(nameRefs.current[index].current.innerText),
                  amount: Number(quantityRef.current[index].current.value),
                  price: Number(
                    priceRef.current[index].current.innerText.slice(0, -1)
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
          {f.format(product.amount / 1000)} кг
        </span>
      </li>
      <li className="w-[50%] flex">
        <p> Цена:</p>{" "}
        <span className="ml-auto bg-fifth w-[60%] px-2 py-1 rounded-md">
          {f.format(product.price * 1000)} сум
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
    setError("")
  };

  useEffect(() => {
    setInputValues(products?.map(() => ({ quantity: "", price: "" })) || []);
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
      const totalPrices = objProd.map((product) => {
        const mainProductTotal =
          product && product.price && product.amount
            ? Number(product.price) * Number(product.amount)
            : 0;

        const receptTotal =
          product.recept?.reduce((total, item) => {
            const itemPrice = item && item.price ? Number(item.price) : 0;
            const itemAmount = item && item.amount ? Number(item.amount) : 0;

            const itemTotal =
              isNaN(itemPrice) || isNaN(itemAmount)
                ? 0
                : itemPrice * itemAmount;

            return total + itemTotal;
          }, 0) || 0;

        return {
          mainProductTotal,
          receptTotal,
          totalPrice: mainProductTotal + receptTotal,
        };
      });

      const mainProductTotalArray = totalPrices.map(
        (price) => price.mainProductTotal
      );
      const receptTotalArray = totalPrices.map((price) => price.receptTotal);
      const totalPriceArray = totalPrices.map((price) => price.totalPrice);

      const mainProductTotalSum = mainProductTotalArray.reduce(
        (total, price) => total + price,
        0
      );
      const receptTotalSum = receptTotalArray.reduce(
        (total, price) => total + price,
        0
      );
      const totalPriceSum = totalPriceArray.reduce(
        (total, price) => total + price,
        0
      );

      setOrderProductPrice(mainProductTotalSum);
      setOrderReceptPrice(receptTotalSum);
      setOrderTotalPrice(totalPriceSum || 0);
    }
  }, [inputValues, objProd]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const filteredIndexes = quantityRef.current
      .map((item, index) => (item.current.value > 0 ? index : null))
      .filter((index) => index !== null);

    if (commentInputs.map((item) => item === "").includes(true)) {
      setError("Пожалуйста, заполните все необходимые поля");
      return;
    }

    if (objProd) {
      setObjProd((prevObjProd) => {
        const updatedRecept = prevObjProd.map((item, index) => {
          if (index === selectedProductIndex) {
            const updatedReceptForIndex = item.recept
              .filter((_, index) => !filteredIndexes.includes(index))
              .concat(
                filteredIndexes.map((index) => ({
                  product_id: Number(nameRefs.current[index].current.innerText),
                  amount: Number(quantityRef.current[index].current.value),
                  price: Number(
                    priceRef.current[index].current.innerText.slice(0, -1)
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
          const formDataPut = {
            product_id: Number(updatedRecept[i].product_id),
            name: updatedRecept[i].name,
            amount: Number(updatedRecept[i].amount),
            recept: updatedRecept[i].recept.map(({ quality, ...rest }) => rest),
            price: Number(updatedRecept[i].price),
            description: updatedRecept[i].description,
          };
          reqArray.push(formDataPut);
        }

        const reqForm = {
          products: reqArray,
          user_id: Number(orders.user_id),
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

        fetch(`http://127.0.0.1:5000/orders/put_order/${id}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            setInputValues(
              inputValues.map(() => ({ quantity: "", price: "" }))
            );
          })
          .catch((error) => console.log("error", error));
        return updatedRecept;
      });
      navigate("/sklad/request");
      window.location.reload()
    }
  };

  useEffect(() => {
    setInputValues(inputValues.map(() => ({ quantity: "", price: "" })));
  }, [selectedProductIndex]);

  if (!orders || orders === null || objProd === null) {
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
                      {f.format(item.product_price)}$
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-forth">Количество</td>
                  {products?.map((item, idx) => (
                    <td
                      className={`border border-forth`}
                      style={{
                        background:
                          item?.product_quantity <= 0 ? "black" : item.color,
                      }}
                      key={idx}
                    >
                      <CurrencyInput
                        ref={quantityRef.current[idx]}
                        className="outline-none text-center bg-inherit w-full py-2"
                        value={
                          inputValues[idx]?.quantity === 0
                            ? 0
                            : inputValues[idx]?.quantity ?? ""
                        }
                        onValueChange={(value) => {
                          handleInputChange(idx, "quantity", value);
                        }}
                        disabled={item?.product_quantity <= 0 && "true"}
                        step={0.01}
                        allowDecimals
                        decimalSeparator="."
                        groupSeparator=" "
                        prefix=""
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
                            : `${f.format(
                                inputValues[idx]?.quantity * item.product_amount
                              )}$`
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
                    {f.format(
                      allPrice?.reduce(
                        (total, currentValue) => total + currentValue,
                        0
                      )
                    )}
                    $
                  </td>
                </tr>
                <tr>
                  <td className="border border-forth p-2">Комментарий</td>
                  <td
                    className="border border-forth text-center"
                    colSpan={products?.length}
                  >
                    <input
                      type="text"
                      className="w-full outline-none h-8 px-3"
                      value={objProd[selectedProductIndex]?.description}
                      onChange={(e) => {
                        const updatedCommentInputs = [...commentInputs];
                        updatedCommentInputs[0] = e.target.value;
                        setCommentInputs(updatedCommentInputs);

                        setObjProd((prevObjProd) =>
                          prevObjProd.map((prod, prodIdx) =>
                            prodIdx === selectedProductIndex
                              ? { ...prod, description: e.target.value }
                              : prod
                          )
                        );
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {error && <p className="text-red-500 mt-3">{error}</p>}
          </div>
          <article className="flex gap-3 items-end mt-5">
            <div className="flex flex-col gap-3">
              <span>
                Общая сумма товара{" "}
                <p className="ml-3 py-1 px-4 bg-forth rounded-md text-center inline">
                  {f.format(orderProductPrice)} сум
                </p>
              </span>
              <span>
                Общая сумма колировка{" "}
                <p className="ml-3 py-1 px-4 bg-forth rounded-md text-center inline">
                  {f.format(
                    orderReceptPrice +
                      allPrice?.reduce(
                        (total, currentValue) => total + currentValue,
                        0
                      )
                  )}
                  $
                </p>
              </span>
            </div>
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
