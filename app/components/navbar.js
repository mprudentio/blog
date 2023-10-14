"use client";
import Link from "next/link";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";

export default function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const content = (
    <>
      <div className="md:hidden block absolute top-16 w-full left-0 right-0 bg-[#333333] transition">
        <ul className="text-center text-xl p-10">
          <Link smooth="true" href="/">
            <li className="my-3 py-3 border-b border-green-800 hover:bg-green-800 hover:rounded">
              Home
            </li>
          </Link>
          <Link smooth="true" href="/users">
            <li className="my-3 py-3 border-b border-green-800 hover:bg-green-800 hover:rounded">
              Users
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
  return (
    <div>
      <div className="h-[75px] fixed bg-[#333333] top-0 right-0 left-0 flex justify-between z-50  text-white lg:py-5 px-20 py-4 border-b border-[#333333]">
        <div className="flex items-center flex-1 cursor-pointer">
          <Link href="/">
            <span className="text-3xl font-bold">Blog</span>
          </Link>
        </div>
        <div className="sm:flex flex-1 items center justify-end font-normal hidden">
          <div className="flex-10">
            <ul className="flex gap-8 mr-16 text-[18px]">
              <Link smooth="true" href="/">
                <li className="hover:text-green-600 transition hover:border-b-2  hover:border-green-600 cursor-pointer">
                  Home
                </li>
              </Link>
              <Link smooth="true" href="/users">
                <li className="hover:text-green-600 transition hover:border-b-2  hover:border-green-600 cursor-pointer">
                  Users
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div>{click && content}</div>

        <button className="block sm:hidden transtion" onClick={handleClick}>
          {click ? <FaTimes /> : <CiMenuFries />}
        </button>
      </div>
    </div>
  );
}
