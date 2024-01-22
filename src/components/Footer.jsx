import React from "react";
import { Clock } from "../images";

function getDate() {
  const today = new Date();
  const month =
    today.getMonth() < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
  const day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}

function getDateTime() {
  const today = new Date();
  const hour =
    today.getHours() < 10 ? "0" + today.getHours() : today.getHours();
  const minute =
    today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();

  return `${hour}:${minute}`;
}

const Footer = () => {
  return (
    <footer id="footer" className="bg-primary z-50 flex items-center">
      <div className="container w-10/12 mx-auto flex justify-end">
        <article className="flex gap-3 items-center text-cText">
          <img className="w-10" src={Clock} alt="" />
          <div className="font-medium">
            <p className="text-right text-2xl">{getDateTime()}</p>
            <p className="text-right text-sm tracking-wider">{getDate()}</p>
          </div>
        </article>
      </div>
    </footer>
  );
};

export default Footer;
