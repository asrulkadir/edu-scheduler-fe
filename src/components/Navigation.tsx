'use client';

import { routes } from "@/utils/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 left-0">
      <div
        className="h-16 shadow-md flex items-center justify-center"
      >
        Logo
      </div>
      <ul className="flex flex-col gap-2 p-4">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link href={route.href} key={route.href}>
              <li 
                className={`p-2 m-2 rounded-md font-bold ${
                  isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200 text-black"
                }`}
              >
                {route.name}
              </li>
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;