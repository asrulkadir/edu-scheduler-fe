'use client';

import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

const Page = () => {
  const user = useContext(UserContext);
  
  return (
    <div>Halaman User {user.username}</div>
  );
};

export default Page;