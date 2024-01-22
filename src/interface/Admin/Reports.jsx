import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const Reports = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(null);
  const location = useLocation();
  const { month, year } = useParams();

  const generateYears = (start, end) => {
    const years = [];
    for (let i = start; i <= end; i++) {
      years.push({ year: i, id: i - start });
    }
    return years;
  };

  const years = generateYears(
    new Date().getFullYear() - count + 1,
    new Date().getFullYear()
  );

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  const handleLiClick = (year) => {
    setSelectedYear(null); // O'zgarmas holatga o'tkazish

  };
  const monthsRussian = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];

  const filteredMonth = monthsRussian.find(
    (monthName, index) => index + 1 === parseInt(month, 10)
  );

  return (
    <>
      <main>
        <div className="container w-10/12 mx-auto mt-10 flex gap-5 items-center">
          <p className="text-xl font-semibold">Отчёты</p>
          <ul className="flex">
            {years.reverse().map(({ year, id }) => (
              <li key={id} onClick={() => handleLiClick(year)}>
                <NavLink
                  style={({ isActive }) => {
                    return {
                      backgroundColor: isActive ? "#D8F4C2" : "#EDEDED",
                    };
                  }}
                  className={"py-2 px-4"}
                  to={`/admin/reports/${year}`}
                  onClick={() => handleYearClick(year)}
                >
                  {year}
                </NavLink>
              </li>
            ))}
          </ul>
          {location.pathname === `/admin/reports/${year}/${month}` && (
            <p className="font-semibold ml-4">
              {filteredMonth.charAt(0).toUpperCase() + filteredMonth.slice(1)}
            </p>
          )}
          <button
            className="ml-auto flex items-center gap-1 bg-fifth py-1 px-3 rounded-md"
            onClick={() => navigate(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <p>Назад</p>
          </button>
        </div>
      </main>
      <Outlet />
    </>
  );
};

export default Reports;
