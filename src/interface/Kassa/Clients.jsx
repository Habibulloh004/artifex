import React from "react";
import { Users, bigUser } from "../../images";
import { clientData } from "../../components/data";
import { Link } from "react-router-dom";

const Clients = () => {
  const account = localStorage.getItem("auth");

  return (
    <main className="py-5">
      <div className="container flex w-10/12 mx-auto mt-10">
        <article className="flex flex-col gap-5 w-1/2">
          <section className="flex items-center gap-3">
            <img src={Users} className="w-[45px] h-10" alt="" />
            <p className="text-xl font-semibold">Клиенты</p>
          </section>
          <ul className="flex flex-col gap-3 mt-5 w-10/12 mx-auto">
            {clientData.map((data) => (
              <li key={data.id}>
                <Link
                  to={`/${account}${data.path}`}
                  className="flex items-center gap-4"
                >
                  <img className="w-7 h-7" src={data.icon} alt="" />
                  <p>{data.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <img className="w-[350px] mt-14" src={bigUser} alt="" />
        </article>
      </div>
    </main>
  );
};

export default Clients;
