'use client';

import Link from "next/link";

const Header = () => {
  return (
    <header
      className="sticky top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-4"
    >
      <h1 
        className="text-xl font-bold text-primary-dark"
      >
        School Scheculer
      </h1>
      <div
        className="flex items-center gap-20"
      >
        <div
          className="flex items-center justify-between gap-5"
        >
          <h1 className="text-primary-dark hover:text-secondary">
            <Link href="/">Beranda</Link>
          </h1>
          <h1 className="text-primary-dark hover:text-secondary">
            <Link href="/about">About</Link>
          </h1>
        </div>
        <div>
          <h1 className="text-primary-dark hover:text-secondary">
            <Link href="/login">Login</Link>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;