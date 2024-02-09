import React, { useEffect, useState } from "react";
import { PlusProd } from "../../images";
import axios from "axios";
import * as XLSX from "xlsx";
import { useMyContext } from "../../context/Context";

const Remaining = () => {
  const [products, setProducts] = useState(null);
  const { f } = useMyContext();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/products/products_menu")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const tableHead = ["№", "Название", "Количество"];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      products.map((item) => ({
        id: item.id,
        product_amount: item.product_amount,
        product_name: item.product_name,
        product_quantity: item.product_quantity,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

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
                    <td className="border py-2">{f.format(index + 1)}</td>
                    <td className="border py-2">{prod.product_name}</td>
                    <td className="border py-2">
                      {f.format(
                        prod.product_name.length >= 3
                          ? Number(prod.product_quantity) / 1000
                          : Number(prod.product_quantity)
                      )}{" "}
                      {prod.product_name.length >= 3 ? "кг." : "г."}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-1 rounded-md mt-4"
          >
            Export to Excel
          </button>
        </section>
      </div>
    </main>
  );
};

export default Remaining;
