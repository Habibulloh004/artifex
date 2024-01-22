import React, { useEffect, useState } from "react";
import { PlusProd } from "../../images";
import axios from "axios";

const Remaining = () => {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    axios
      .get("/products/products_menu")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const tableHead = ["№", "Название", "Количество"];

  if (!products) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <div className="container w-10/12 mx-auto mt-10">
        <div className="flex gap-3 items-center">
          <img src={PlusProd} alt="" />
          <p className="font-semibold text-xl">Остаток товаров</p>
        </div>
        <section className="mt-5">
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
              {Array.isArray(products) &&
                products.map((prod, index) => (
                  <tr key={index} className="text-sm">
                    <td className="border py-2">{index + 1}</td>
                    <td className="border py-2">{prod.product_name}</td>
                    <td className="border py-2">{prod.product_quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
};

export default Remaining;
