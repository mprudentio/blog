"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import postImage from "../../public/postImage.jpg";
import Link from "next/link";
const BlogList = () => {
  const [blogList, setBlogList] = useState();
  const [users, setUsers] = useState();
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(4);

  const itemsPerPage = 3;
  const totalItems = blogList && blogList.length - 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  const handlePageChange = (pageNumber) => {
    setStart((pageNumber - 1) * itemsPerPage + 1);
    setEnd(pageNumber * itemsPerPage + 1);
  };
  const handleNextButton = () => {
    setStart(start + itemsPerPage);
    setEnd(end + itemsPerPage);
  };
  const handlePreviousButton = () => {
    setStart(start - itemsPerPage);
    setEnd(end - itemsPerPage);
  };
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API}/posts`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setBlogList(data));
    fetch(`${process.env.NEXT_PUBLIC_API}/users`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTHORIZATION_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);
  return (
    <div className=" pt-[75px]">
      {blogList && (
        <Link href={`/posts/${blogList[0].id}`}>
          <div className="h-[500px] relative bg-cover bg-center bg-[url('../public/hero.jpg')] cursor-pointer">
            <div className="absolute left-6 bottom-[230px] text-white rounded-lg bg-white p-8 md:w-[550px] w-[250px]">
              <p className="text-lg text-[#333333] font-bold ">
                {blogList[0].title}
              </p>
            </div>
          </div>
        </Link>
      )}
      <div className="flex flex-col justify-center items-center">
        {blogList && <p className="text-2xl font-bold mt-8">Featured Topics</p>}
        <div className="flex flex-wrap justify-center items-center gap-10 mt-6">
          {blogList &&
            blogList.slice(start, end).map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="w-[250px] rounded-xl shadow-lg hover:-translate-y-5 cursor-pointer transition">
                  <div>
                    <Image
                      src={postImage}
                      alt="img"
                      width={250}
                      height="auto"
                    />
                  </div>
                  <div className="p-2 ">
                    <p className="h-[100px] font-bold text-md">{post.title}</p>
                    <p className="line-clamp-2 border-b-2 border-slate-500  ">
                      {post.body}
                    </p>
                    <p className="mt-1">
                      By:{" "}
                      {(users &&
                        users.find((user) => user.id === post.user_id)?.name) ||
                        "Anonym"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <div className="flex gap-2  mt-6 mb-5">
          <div
            onClick={handlePreviousButton}
            className={`${
              end === 4 ? "hidden" : "inline"
            } flex gap-2 justify-center items-center group cursor-pointer`}
          >
            <AiOutlineLeft className="group-hover:-translate-x-5 transition" />
            <p>Previous</p>
          </div>
          {pageNumbers.map((pageNumber) => (
            <div
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`cursor-pointer mx-2 hover:text-green-500 ${
                start === (pageNumber - 1) * itemsPerPage + 1 &&
                end === pageNumber * itemsPerPage + 1
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              {pageNumber}
            </div>
          ))}
          {blogList && (
            <div
              onClick={handleNextButton}
              className={`${
                end === 10 ? "hidden" : "inline"
              } flex justify-center items-center group gap-2 cursor-pointer`}
            >
              <p>Next</p>
              <AiOutlineRight className="group-hover:translate-x-5 transition" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
