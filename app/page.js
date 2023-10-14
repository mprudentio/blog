"use client";
import Navbar from "../app/components/navbar";
import BlogList from "./(pages)/BlogList";
export default function Home() {
  return (
    <div>
      <Navbar />
      <BlogList />
    </div>
  );
}
