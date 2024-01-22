import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Trash, AddSpam } from "../../images";
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom'
import axios from "axios";

const MinusDebt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "/users/dolg_list"
        );
        setClients(clientData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   console.log(clients);
  // }, [clients]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const closeModal = () => {
    setIsOpen(false);
    reset({
      number: "",
      sum: "",
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);

    // Filter clients based on input value
    setFilteredClients(
      clients?.filter((client) =>
        client.phone.toLowerCase().includes(value.toLowerCase())
      ) || []
    );

    // Tozalash sharti
  };

  const onSubmit = async (data) => {
    try {
      // data.name orqali foydalanuvchi kiritgan name input qiymatini olish
      const userPhone = data.number;

      // Foydalanuvchining backenddan kelgan ma'lumotlar asosida id'sini olish
      const user = clients.find(
        (client) => client.phone.toLowerCase() === userPhone.toLowerCase()
      );

      if (user) {
        const userId = user.id;

        const formPatch = new FormData()
        formPatch.append("debt_amount", data.sum)
        console.log();
        axios
          .patch(`/users/update_debt/${userId}`, formPatch)
          .then((response) => {
            console.log("Deleted successfully:", response);
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
          });
        console.log("Foydalanuvchi ID:", userId);
      } else {
        console.log("Foydalanuvchi topilmadi");
      }
    } catch (error) {
      console.log(error);
    }

    reset({
      number: "",
      sum: "",
    });
    closeModal()
    window.location.reload()
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md px-4 py-2 font-medium flex gap-2 items-center text-[12px] bg-forth"
        >
          <img className="w-3" src={Trash} alt="" />
          <p>Удалить</p>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col items-center gap-3 w-full max-w-md transform rounded-2xl bg-forth p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 text-center"
                  >
                    Удалить
                    <br />
                    <span className="text-[12px]">Клиент</span>
                  </Dialog.Title>
                  <form
                    className="flex flex-col gap-3 items-center"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-3 relative">
                      <input
                        type="text"
                        className="py-1 px-3 text-[12px] w-[200px] rounded-md"
                        placeholder="Номер"
                        {...register("number", {
                          required: "Требуется номер!",
                        })}
                        onChange={(e) => {
                          setInputNumber(e.target.value);
                          handleInputChange(e.target.value);
                        }}
                      />
                      {filteredClients.length > 0 && inputNumber.length > 0 && (
                        <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                          {filteredClients.map((client, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => {
                                reset({
                                  number: client.phone,
                                });
                                setFilteredClients([]);
                              }}
                            >
                              {client.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {errors.number && (
                      <p className="text-red-500">{errors.number.message}</p>
                    )}
                    <input
                      type="text"
                      className="py-1 px-3 text-[12px] w-[200px] rounded-md"
                      placeholder="Цена"
                      {...register("sum", {
                        required: "Требуется цена!",
                      })}
                    />
                    {errors.sum && (
                      <p className="text-red-500">{errors.sum.message}</p>
                    )}
                    <div className="flex flex-col mt-3 text-[12px] gap-2">
                      <button
                        type="submit"
                        className="rounded-md bg-white py-1 px-4"
                        // onClick={closeModal}
                      >
                        Подтвердить{" "}
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-white py-1 px-4"
                        onClick={closeModal}
                      >
                        Отменить{" "}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
const AddClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "/users/dolg_list"
        );
        setClients(clientData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   console.log(clients);
  // }, [clients]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const closeModal = () => {
    setIsOpen(false);
    reset({
      number: "", // boshqa inputlarni tozalash (agar boshqa inputlar mavjud bo'lsa)
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);

    // Filter clients based on input value
    setFilteredClients(
      clients?.filter((client) =>
        client.phone.toLowerCase().includes(value.toLowerCase())
      ) || []
    );

    // Tozalash sharti
  };

  const onSubmit = async (data) => {
    try {
      const userPhone = data.number;

      const user = clients.find(
        (client) => client.phone.toLowerCase() === userPhone.toLowerCase()
      );

      if (user) {
        const userId = user.id;
        axios
          .post(`/users/add_to_blacklist/${userId}`)
          .then((response) => {
            console.log("Post successfully:", response);
          })
          .catch((error) => {
            console.error("Error post data:", error);
          });
        console.log("Foydalanuvchi ID:", userId);
      } else {
        console.log("Foydalanuvchi topilmadi");
      }
    } catch (error) {
      console.log(error);
    }

    reset({
      number: "",
    });
    closeModal()
    window.location.reload()
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md px-4 py-2 font-medium flex gap-2 items-center text-[12px] bg-forth"
        >
          <img className="w-3" src={AddSpam} alt="" />
          <p>Добавить</p>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col items-center gap-3 w-full max-w-md transform rounded-2xl bg-forth p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 text-center"
                  >
                    Добавить
                    <br />
                    <span className="text-[12px]">Клиент</span>
                  </Dialog.Title>
                  <form
                    className="flex flex-col gap-3 items-center"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-3 relative">
                      <input
                        type="text"
                        className="py-1 px-3 text-[12px] w-[200px] rounded-md"
                        placeholder="Номер"
                        {...register("number", {
                          required: "Требуется номер!",
                        })}
                        onChange={(e) => {
                          setInputNumber(e.target.value);
                          handleInputChange(e.target.value);
                        }}
                      />
                      {filteredClients.length > 0 && inputNumber.length > 0 && (
                        <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                          {filteredClients.map((client, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => {
                                reset({
                                  number: client.phone,
                                });
                                setFilteredClients([]);
                              }}
                            >
                              {client.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {errors.number && (
                      <p className="text-red-500">{errors.number.message}</p>
                    )}
                    <div className="flex flex-col mt-3 text-[12px] gap-2">
                      <button
                        type="submit"
                        className="rounded-md bg-white py-1 px-4"
                        // onClick={closeModal}
                      >
                        Подтвердить{" "}
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-white py-1 px-4"
                        onClick={closeModal}
                      >
                        Отменить{" "}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
const DeleteClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "/users/blacklist_users"
        );
        setClients(clientData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  // useEffect(() => {
  //   console.log(clients);
  // }, [clients]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const closeModal = () => {
    setIsOpen(false);
    reset({
      number: "", // name nomli inputni tozalash
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);

    // Filter clients based on input value
    setFilteredClients(
      clients?.filter((client) =>
        client.phone.toLowerCase().includes(value.toLowerCase())
      ) || []
    );

    // Tozalash sharti
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      // data.name orqali foydalanuvchi kiritgan name input qiymatini olish
      const userPhone = data.number;

      // Foydalanuvchining backenddan kelgan ma'lumotlar asosida id'sini olish
      const user = clients.find(
        (client) => client.phone.toLowerCase() === userPhone.toLowerCase()
      );

      if (user) {
        const userId = user.id;
        axios
          .delete(`/users/remote_from_blacklist/${userId}`)
          .then((response) => {
            console.log("Deleted successfully:", response);

            // Update your local state or trigger a re-fetch if needed
            // For example, update state after successful deletion
            setClients((prevData) =>
              prevData.filter((item) => item.id !== userId)
            );
          })
          .catch((error) => {
            console.error("Error deleting data:", error);
          });
        console.log("Foydalanuvchi ID:", userId);
      } else {
        console.log("Foydalanuvchi topilmadi");
      }
    } catch (error) {
      console.log(error);
    }

    reset({
      number: "",
    });
    closeModal()
    window.location.reload()
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md px-4 py-2 font-medium flex gap-2 items-center text-[12px] bg-forth"
        >
          <img className="w-3" src={Trash} alt="" />
          <p>Удалить</p>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col items-center gap-3 w-full max-w-md transform rounded-2xl bg-forth p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900 text-center"
                  >
                    Удалить
                    <br />
                    <span className="text-[12px]">Клиент</span>
                  </Dialog.Title>
                  <form
                    className="flex flex-col gap-3 items-center"
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex flex-col gap-3 relative">
                      <input
                        type="text"
                        className="py-1 px-3 text-[12px] w-[200px] rounded-md"
                        placeholder="Номер"
                        {...register("number", {
                          required: "Требуется номер!",
                        })}
                        onChange={(e) => {
                          setInputNumber(e.target.value);
                          handleInputChange(e.target.value);
                        }}
                      />
                      {filteredClients.length > 0 && inputNumber.length > 0 && (
                        <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                          {filteredClients.map((client, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => {
                                reset({
                                  number: client.phone,
                                });
                                setFilteredClients([]);
                              }}
                            >
                              {client.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {errors.number && (
                      <p className="text-red-500">{errors.number.message}</p>
                    )}
                    <div className="flex flex-col mt-3 text-[12px] gap-2">
                      <button
                        type="submit"
                        className="rounded-md bg-white py-1 px-4"
                        // onClick={closeModal}
                      >
                        Подтвердить{" "}
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-white py-1 px-4"
                        onClick={closeModal}
                      >
                        Отменить{" "}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export const ManageClient = () => {
  const location = useLocation()

  // Check the location.pathname and render components accordingly
  const renderComponents = () => {
    if (location.pathname === "/kassa/clients/wait-client") {
      return <MinusDebt />;
    } else if (location.pathname === "/kassa/clients/spam-client") {
      return (
        <>
          <AddClient />
          <DeleteClient />
        </>
      );
    } else {
      // If the path is neither "/kassa/clients/wait-client" nor "/kassa/clients/spam-client"
      return null; // or any default content or message
    }
  };

  return <section className={`flex gap-3 ${location.pathname === "/kassa/clients/all-client" && "hidden"}`}>{renderComponents()}</section>;
};
