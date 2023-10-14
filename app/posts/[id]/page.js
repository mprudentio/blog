"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import postImage from "../../../public/postImage.jpg";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
const Page = ({ params }) => {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState(null);
  const [users, setUsers] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const getPostById = useCallback(async () => {
    try {
      setPostLoading(true);
      const response = await fetch(
        `https://gorest.co.in/public/v2/posts/${params.id}`
      );
      if (response) {
        const result = await response.json();
        setPost(result);
        setPostLoading(false);
      } else {
        setPostError(`HTTP Error: ${response.status}`);
        setPostLoading(false);
      }
    } catch (error) {
      setPostLoading(false);
      setPostError(error);
    }
  }, [params.id]);

  const getCommentById = useCallback(async () => {
    try {
      setCommentLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/comments?post_id=${params.id}`
      );
      if (response) {
        const result = await response.json();
        setComment(result);
        setCommentLoading(false);
      } else {
        setCommentError(`HTTP Error: ${response.status}`);
        setCommentLoading(false);
      }
    } catch (error) {
      setCommentLoading(false);
      setCommentError(error);
    }
  }, [params.id]);

  const getUserById = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/users`);
      if (response) {
        const result = await response.json();
        setUsers(result);
        setUsersLoading(false);
      } else {
        setUsersError(`HTTP Error: ${response.status}`);
        setUsersLoading(false);
      }
    } catch (error) {
      setUsersLoading(false);
      setUsersError(error);
    }
  }, []);
  useEffect(() => {
    getPostById();
    getCommentById();
    getUserById();
  }, [getCommentById, getPostById, getUserById]);

  return (
    <div>
      {postLoading && commentLoading && usersLoading && <div>Loading...</div>}
      {!postLoading && postError && <div>{postError}</div>}
      {!usersLoading && usersError && <div>{usersError}</div>}
      {!commentLoading && commentError && <div>{commentError}</div>}
      {!postLoading && !commentLoading && !usersLoading && (
        <div>
          <Navbar />
          <div className="pt-[75px] mb-10">
            <Image
              src={postImage}
              alt="img"
              sizes="100vw"
              className="w-full h-[500px]"
              priority={true}
            />
            {post && (
              <div className="px-[30px]">
                <p className="text-3xl font-bold mt-4">{post.title}</p>
                <p>
                  By:{" "}
                  {(users &&
                    users.find((user) => user.id === post.user_id)?.name) ||
                    "Anonym"}
                </p>
                <p className="mt-4 text-lg">{post.body}</p>
              </div>
            )}
            {comment && (
              <div className="px-[30px] mt-5">
                <p className="text-xl font-bold">
                  {comment.length} {comment.length > 1 ? "Comments" : "Comment"}{" "}
                  :
                </p>
                {comment.map((comment) => (
                  <div key={comment.id} className="flex mt-2 gap-2 ">
                    <div className="flex justify-center">
                      <RxAvatar size={25} />
                    </div>
                    <div>
                      {" "}
                      <p className="text-md font-bold">{comment.name}</p>
                      <p className="text-md">{comment.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
