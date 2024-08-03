'use client';

import Link from "next/link";

const Header = () => {
  return (
    <header
      className="sticky top-0 left-0 w-full h-16 bg-white shadow-md flex items-center justify-between px-4"
    >
      <h1>Header</h1>
      <div
        className="flex items-center justify-between gap-5"
      >
        <h1>
          <Link href="/">Beranda</Link>
        </h1>
        <h1>
          <Link href="/about">About</Link>
        </h1>
      </div>
      <div>
        <h1>
          <Link href="/login">Login</Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;