import React, { useState } from "react";
import axios from "axios";
import {
  Cancel,
  Create,
  Instagram,
  Telegram,
  Tv,
  bigCreate,
  createData,
} from "../../images";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CreateClient = () => {
  const icons = [
    {
      id: 1,
      icon: Telegram,
      for: "telegram",
    },
    {
      id: 2,
      icon: Instagram,
      for: "instagram",
    },
    {
      id: 3,
      icon: Tv,
      for: "tv",
    },
  ];

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    year: "",
    company: "",
    known_from: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("full_name", formData.full_name);
    form.append("phone", formData.phone);
    form.append("year", formData.year);
    form.append("company", formData.company);
    form.append("known_from", formData.known_from);

    try {
      for (const key in formData) {
        if (!formData[key]) {
          setError("Пожалуйста, заполните все поля");
          return;
        }
      }
      const apiUrl = "http://127.0.0.1:5000/users/create_user";
      await axios.post(apiUrl, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({
        full_name: "",
        phone: "",
        year: "",
        company: "",
        known_from: "",
      });
      setError("");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create user. Please try again.");
    }
  };

  return (
    <main>
      <div className="container flex w-10/12 mx-auto mt-10">
        <article className="flex flex-col w-1/2">
          <section className="flex items-center gap-3">
            <img src={Create} className="w-[45px] h-10" alt="" />
            <p className="text-xl font-semibold">Создание клиента</p>
          </section>
          <form
            className="flex flex-col items-center mt-3 gap-3 w-[400px]"
            onSubmit={onSubmit}
            autoComplete="off"
          >
            <p>Данные покупателя</p>
            <input
              type="text"
              value={formData.full_name}
              name="full_name"
              placeholder="ФИО"
              onChange={handleChange}
              className="bg-forth w-[70%] rounded-md text-sm p-2"
            />
            <span className="w-[70%]">
              <PhoneInput
                country={"uz"}
                name="phone"
                placeholder="Тел. Номер"
                value={formData.phone}
                onChange={(value) =>
                  handleChange({ target: { name: "phone", value } })
                }
                inputStyle={{
                  background: "#DFDFDF",
                  width: "100%",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                }}
              />
            </span>
            <input
              type="date"
              value={formData.year}
              name="year"
              placeholder="Дата рождения"
              onChange={handleChange}
              className="bg-forth w-[70%] rounded-md text-sm p-2"
            />
            <input
              type="text"
              value={formData.company}
              name="company"
              placeholder="Название компании"
              onChange={handleChange}
              className="bg-forth w-[70%] rounded-md text-sm p-2"
            />
            <p className="mt-3">Откуда вы узнали о нас?</p>
            <section className="flex gap-5">
              {icons.map((icon) => (
                <span
                  key={icon.id}
                  className="flex flex-col items-center gap-2"
                >
                  <label htmlFor={icon.for}>
                    <img className="w-9" src={icon.icon} alt="" />
                  </label>
                  <input
                    id={icon.for}
                    type="radio"
                    name="known_from"
                    value={icon.for}
                    checked={formData.known_from === icon.for}
                    onChange={handleChange}
                  />
                </span>
              ))}
            </section>
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth"
              type="submit"
              onSubmit={onSubmit}
            >
              <img src={createData} alt="" /> <p>Создать</p>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setFormData({
                  full_name: "",
                  phone: "",
                  year: "",
                  company: "",
                  known_from: "",
                });
              }}
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth"
            >
              <img src={Cancel} alt="" /> <p>Отменить</p>
            </button>
          </form>
        </article>
        <article className="flex items-start">
          <img className="w-[350px] mt-8" src={bigCreate} alt="" />
        </article>
      </div>
    </main>
  );
};

export default CreateClient;
