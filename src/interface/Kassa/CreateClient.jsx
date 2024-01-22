import React from "react";
import { useForm } from "react-hook-form";
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
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Extracting the first digit from the phone number
    const firstDigit = data.phone.slice(1);

    // Creating a new FormData object with the modified phone value
    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("phone", firstDigit); // Updated this line
    formData.append("year", data.year);
    formData.append("company", data.company);
    formData.append("known_from", data.known_from);

    try {
      const apiUrl = "/users/create_user";
      await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

    } catch (error) {
      console.error("Error:", error);
    }

    reset();
    // Boshqa loyihalarda kerak bo'lgan kodlar
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
            className="flex flex-col items-center mt-6 gap-3 w-[400px]"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <p>Данные покупателя</p>
            <input
              {...register("full_name", { required: true })}
              type="text"
              placeholder="ФИО"
              className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
            />
            <input
              {...register("phone", {
                required: true,
                pattern: /^[0-9+]+$/,
                maxLength: {
                  value: 13,
                  message: "Вы написали много цифр",
                },
                minLength: {
                  value: 13,
                  message: "Вы ввели мало цифр",
                },
              })}
              type="text"
              placeholder="Тел. Номер"
              className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
              defaultValue="+998"
              onKeyPress={(e) => {
                if (e.target.type === "text" && !/^[0-9+]$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            <input
              {...register("year", { required: true })}
              type="date"
              placeholder="Дата рождения"
              className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
            />
            <input
              {...register("company", { required: true })}
              type="text"
              placeholder="Название компании"
              className="bg-forth w-[70%] rounded-md text-sm p-1 px-2"
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
                    {...register("known_from", { required: true })}
                    value={icon.for}
                    checked={watch("known_from") === icon.for}
                  />
                </span>
              ))}
            </section>
            {(errors.known_from ||
              errors.company ||
              errors.year ||
              errors.phone ||
              errors.full_name) && (
              <p className="text-red-500">{`${
                errors.phone ? errors.phone.message : "Заполнить бланки"
              }`}</p>
            )}
            <button
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth "
              type="submit"
            >
              <img src={createData} alt="" /> <p>Создать</p>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
              }}
              className="flex items-center justify-center w-[50%] rounded-md text-sm p-1 gap-2 bg-forth "
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
