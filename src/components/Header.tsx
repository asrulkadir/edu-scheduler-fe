'use client';

import Link from 'next/link';

interface HeaderProps {
  showLogin?: boolean;
}

const Header = ({ showLogin = true }: HeaderProps) => {
  return (
    <header className="sticky left-0 top-0 flex h-16 w-full items-center justify-between bg-white px-4 shadow-md">
      <h1 className="text-xl font-bold text-primary-dark">
        <Link href="/">School Scheculer</Link>
      </h1>
      <div className="flex items-center gap-20">
        <div className="flex items-center justify-between gap-5">
          <h1 className="text-primary-dark hover:text-secondary">
            <Link href="/">Beranda</Link>
          </h1>
          <h1 className="text-primary-dark hover:text-secondary">
            <Link href="/about">About</Link>
          </h1>
        </div>
        {showLogin && (
          <div>
            <h1 className="text-primary-dark hover:text-secondary">
              <Link href="/login">Login</Link>
            </h1>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
