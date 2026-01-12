"use client";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const onLogout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/users/personalProfile");
      console.log(res.data);
      setData(res.data.data._id);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  React.useEffect(() => {
    getUserData();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <h2 className="p-3 rounded bg-green-500">
        {data === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <button
        onClick={onLogout}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Logout
      </button>
      <button
        onClick={getUserData}
        className="p-2 border border-green-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Get Users Detail
      </button>
    </div>
  );
}
