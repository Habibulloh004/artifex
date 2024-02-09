import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { Trash, AddSpam } from "../../images";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import { useMyContext } from "../../context/Context";
import CurrencyInput from "react-currency-input-field";

const MinusDebt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");
  const [formData, setFormData] = useState({ number: "", sum: 0, dol: 0 });
  const [formErrors, setFormErrors] = useState({
    number: "",
    sum: "",
    dol: "",
  });
  const { formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "http://127.0.0.1:5000/users/dolg_list"
        );
        setClients(clientData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ number: "", sum: "" });
    setFormErrors({ number: "", sum: "" });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);

    setFilteredClients(
      clients?.filter((client) =>
        client.phone.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  const validateForm = () => {
    let valid = true;
    const errors = { number: "", sum: "" };

    if (!formData.number) {
      errors.number = "Требуется номер!";
      valid = false;
    }

    if (!formData.sum) {
      setFormData({ ...formData, sum: 0 });
    }
    if (!formData.dol) {
      setFormData({ ...formData, dol: 0 });
    }

    setFormErrors(errors);
    return valid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      try {
        const userPhone = formData.number;

        const user = clients.find(
          (client) => client.phone.toLowerCase() === userPhone.toLowerCase()
        );
        if (user) {
          const userId = user.id;
          console.log(formData);
          const formPatch = new FormData();
          formPatch.append("debt_amountSum", `${formData.sum}`);
          formPatch.append("debt_amountDol", `${formData.dol}`);

          const { data } = await axios.patch(
            `http://127.0.0.1:5000/users/update_debt/${userId}`,
            formPatch
          );

          console.log("Deleted successfully:", data);
        } else {
          console.log("Foydalanuvchi topilmadi");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }

      closeModal();
      window.location.reload();
    }
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

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-forth shadow-xl rounded-2xl">
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                >
                  <div className="flex flex-col gap-3 relative">
                    <PhoneInput
                      country={"uz"}
                      name="phone"
                      value={formData.number}
                      onChange={(value) => {
                        setFormData({ ...formData, number: value });
                        handleInputChange(value);
                      }}
                      inputStyle={{
                        borderRadius: "0.375rem",
                        fontSize: "12px",
                        width: "200px",
                      }}
                    />
                    {filteredClients.length > 0 && inputNumber.length > 0 && (
                      <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                        {filteredClients.map((client, idx) => (
                          <li
                            className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                            key={idx}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                number: client.phone,
                              });
                              setFilteredClients([]);
                            }}
                          >
                            {formatPhoneNumber(client.phone)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {formErrors.number && (
                    <p className="text-red-500 text-sm">{formErrors.number}</p>
                  )}
                  <CurrencyInput
                    className="py-2 px-3 text-[12px] w-[200px] rounded-md"
                    value={formData.dol > 0 ? formData.dol : ""}
                    placeholder="USD"
                    onValueChange={(value, name) => {
                      setFormData({ ...formData, dol: value });
                    }}
                    step={0.01}
                    allowDecimals
                    decimalSeparator="."
                    groupSeparator=" "
                    prefix=""
                  />
                  <CurrencyInput
                    className="py-2 px-3 text-[12px] w-[200px] rounded-md"
                    value={formData.sum > 0 ? formData.sum : ""}
                    placeholder="Сум"
                    onValueChange={(value, name) => {
                      setFormData({ ...formData, sum: value });
                    }}
                    step={0.01}
                    allowDecimals
                    decimalSeparator="."
                    groupSeparator=" "
                    prefix=""
                  />
                  {formErrors.sum && (
                    <p className="text-red-500 text-sm">{formErrors.sum}</p>
                  )}
                  <div className="flex flex-col mt-3 text-[12px] gap-2">
                    <button
                      type="submit"
                      className="rounded-md bg-white py-1 px-4"
                    >
                      Подтвердить
                    </button>
                    <button
                      type="button"
                      className="rounded-md bg-white py-1 px-4"
                      onClick={closeModal}
                    >
                      Отменить
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
const AddClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clients, setClients] = useState(null);
  const [allSimpleClients, setAllSimpleClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [inputNumber, setInputNumber] = useState("");
  const [formData, setFormData] = useState({ number: "" });
  const [formErrors, setFormErrors] = useState({ number: "" });
  const { formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "http://127.0.0.1:5000/users/dolg_list"
        );
        const simpleClient = await axios.get("http://127.0.0.1:5000/users/all");

        setClients(clientData.data);
        setAllSimpleClients(simpleClient.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setFormData({ number: "" });
    setFormErrors({ number: "" });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);

    setFilteredClients(
      clients
        ?.filter((client) =>
          client.phone.toLowerCase().includes(value.toLowerCase())
        )
        .map((item) =>
          allSimpleClients.filter(
            (cli) => cli.phone === item.phone && cli.in_blacklist === false
          )
        )
        .flat(Infinity)
    );
  };

  const validateForm = () => {
    let valid = true;
    const errors = { number: "" };

    if (!formData.number) {
      errors.number = "Требуется номер!";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      try {
        const userPhone = formData.number;

        const user = clients.find(
          (client) => client.phone.toLowerCase() === userPhone.toLowerCase()
        );

        if (user) {
          const userId = user.id;
          axios
            .post(`http://127.0.0.1:5000/users/add_to_blacklist/${userId}`)
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

      closeModal();
      window.location.reload();
    }
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    <div className="flex flex-col gap-3 relative">
                      <PhoneInput
                        country={"uz"}
                        name="number"
                        value={formData.number}
                        onChange={(value) => {
                          handleInputChange(value);
                          setFormData({
                            ...formData,
                            number: value,
                          });
                        }}
                        inputStyle={{
                          borderRadius: "0.375rem",
                          fontSize: "12px",
                          width: "200px",
                        }}
                      />
                      {filteredClients.length > 0 && inputNumber.length > 0 && (
                        <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                          {filteredClients.map((client, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  number: client.phone,
                                });
                                setFilteredClients([]);
                              }}
                            >
                              {formatPhoneNumber(client.phone)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {formErrors.number && (
                      <p className="text-red-500 text-sm">
                        {formErrors.number}
                      </p>
                    )}
                    <div className="flex flex-col mt-3 text-[12px] gap-2">
                      <button
                        type="submit"
                        className="rounded-md bg-white py-1 px-4"
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [error, setError] = useState("");
  const { formatPhoneNumber } = useMyContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientData = await axios.get(
          "http://127.0.0.1:5000/users/blacklist_users"
        );
        setClients(clientData.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setInputNumber("");
    setFilteredClients([]);
    setSelectedClient(null);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const handleInputChange = (value) => {
    setInputNumber(value);
    setError("");

    // Filter clients based on input value
    setFilteredClients(
      clients?.filter((client) =>
        client.phone.toLowerCase().includes(value.toLowerCase())
      ) || []
    );
  };

  const handleClientSelection = (client) => {
    setInputNumber(client.phone);
    setFilteredClients([]);
    setSelectedClient(client);
  };

  const onSubmit = async () => {
    try {
      if (selectedClient) {
        const userId = selectedClient.id;
        await axios.delete(
          `http://127.0.0.1:5000/users/remote_from_blacklist/${userId}`
        );
        console.log("Deleted successfully");

        setClients((prevData) => prevData.filter((item) => item.id !== userId));
      } else {
        setError("Пользователь не найден");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }

    closeModal();
    window.location.reload();
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
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSubmit();
                    }}
                  >
                    <div className="flex flex-col gap-3 relative">
                      <PhoneInput
                        country={"uz"}
                        name="number"
                        value={inputNumber}
                        placeholder="Номер"
                        onChange={(value) => handleInputChange(value)}
                        inputStyle={{
                          borderRadius: "0.375rem",
                          fontSize: "12px",
                          width: "200px",
                        }}
                      />
                      {filteredClients.length > 0 && inputNumber.length > 0 && (
                        <ul className="flex-col overflow-auto absolute top-9 gap-2 w-[200px] h-auto py-3 rounded-lg bg-fifth z-50">
                          {filteredClients.map((client, idx) => (
                            <li
                              className="px-3 py-1 cursor-pointer hover:bg-fifth w-full"
                              key={idx}
                              onClick={() => handleClientSelection(client)}
                            >
                              {formatPhoneNumber(client.phone)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
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
  const location = useLocation();

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

  return (
    <section
      className={`flex gap-3 ${
        location.pathname === "/kassa/clients/all-client" && "hidden"
      }`}
    >
      {renderComponents()}
    </section>
  );
};
