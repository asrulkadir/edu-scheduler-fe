'use client';

import dayjs from "dayjs";

const Footer = () => {
  return (
    <footer className="text-center bg-secondary text-white p-4">
      School Scheduler ©{dayjs().year()} Created by Asrul Kadir
    </footer>
  );
};

export default Footer;