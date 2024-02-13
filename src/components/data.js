import {
  Users,
  Edit,
  Base,
  All,
  Create,
  Spam,
  Wait,
  Notice,
  List,
  ComePRod,
  PlusProd,
  Report,
  Boss,
  AddProdSvg,
  Cost,
  ProfitSvg,
  ReconSvg,
  RemoveProdSvg
} from "../images";
import RemoveProd from "../interface/Sklad/RemoveProd";

export const API = "http://192.168.0.124/";

const users = [
  { role: "kassa", login: "kassauser", password: "kassapass" },
  { role: "boss", login: "bossuser", password: "bosspass" },
  { role: "admin", login: "adminuser", password: "adminpass" },
  { role: "sklad", login: "skladuser", password: "skladpass" },
];
const navLinks = [
  {
    role: "/kassa",
    items: [
      { name: "Клиенты", path: "/clients", icon: Users },
      { name: "Запрос", path: "/order", icon: Edit },
      { name: "Возврат", path: "/return", icon: Base },
      { name: "Расход", path: "/cost", icon: Cost },
    ],
  },
  { role: "/boss", items: [{ name: "Меню", path: "/menu", icon: Boss }] },
  {
    role: "/admin",
    items: [
      { name: "Отчёты", path: "/reports", icon: Report },
      { name: "Прибыль", path: "/profit", icon: ProfitSvg },
      { name: "Ак Сверка", path: "/reconciliation", icon: ReconSvg },
    ],
  },
  {
    role: "/sklad",
    items: [
      { name: "Запросы", path: "/request", icon: Notice },
      // { name: "Список заказов", path: "/orders", icon: List },
      { name: "Приход", path: "/coming", icon: ComePRod },
      { name: "Остаток товаров", path: "/remaining", icon: PlusProd },
      { name: "Добавление товаров", path: "/add-product", icon: AddProdSvg },
      { name: "Удаленные товар", path: "/remove-product", icon: RemoveProdSvg },
      { name: "История расходов", path: "/cost-report", icon: Cost },
    ],
  },
];
const clientData = [
  {
    id: 1,
    title: "Создать Клиента",
    icon: Create,
    path: "/clients/create-client",
  },
  {
    id: 2,
    title: "Все клиенты",
    icon: All,
    path: "/clients/all-client",
  },
  {
    id: 3,
    title: "Долговые клиенты",
    icon: Wait,
    path: "/clients/wait-client",
  },
  {
    id: 4,
    title: "Чёрный список",
    icon: Spam,
    path: "/clients/spam-client",
  },
];
const clientPath = [
  {
    id: 1,
    url: `${API}users/all`,
    path: "all-client",
    icon: All,
    title: "Все клиенты",
    tableHead: ["№", "ID", "ФИО", "Тел. Номер", "Дата рож.", "Компания"],
  },
  {
    id: 2,
    url: `${API}users/dolg_list`,
    path: "wait-client",
    icon: Wait,
    title: "Долговые клиенты",
    tableHead: ["№", "ID", "ФИО", "Тел. Номер", "Долг"],
  },
  {
    id: 3,
    url: `${API}users/blacklist_users`,
    path: "spam-client",
    icon: Spam,
    title: "Чёрный список",
    tableHead: ["№", "ID", "ФИО", "Тел. Номер", "Долг"],
  },
];

export const completePath = (path) => {
  const cPath = clientPath.find((pathc) => pathc.path === path);
  return cPath ? cPath : null;
};
export const authenticateUser = (login, password) => {
  const user = users.find(
    (user) => user.login === login && user.password === password
  );
  return user ? user.role : null;
};

export const navItem = (role) => {
  const navLink = navLinks.find((nav) => nav.role === role);
  return navLink ? navLink : null;
};

export { navLinks, clientData };
