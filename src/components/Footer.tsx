'use client';

import dayjs from 'dayjs';

const Footer = () => {
  return (
    <footer className="bg-secondary p-4 text-center text-white">
      School Scheduler ©{dayjs().year()} Created by Asrul Kadir
    </footer>
  );
};

export default Footer;
