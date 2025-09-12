'use client'
import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import NavbarNew from "@/Components/Navbar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <>
      <ToastContainer theme="dark"/>
      <NavbarNew/>
      <div className="pt-24"> {/* Add padding-top equal to navbar height */}
        <Header/>
        <BlogList/>
        <Footer/>
      </div>
    </>
  )
} 