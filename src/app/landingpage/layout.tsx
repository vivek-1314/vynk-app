'use client';
import { useState, useEffect } from "react";
import Navbar from "@/component/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
const [showNavbar, setShowNavbar] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);

const handleScroll = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowNavbar(false); // Scroll down, hide navbar
      } else {
        setShowNavbar(true); // Scroll up, show navbar
      }
      setLastScrollY(currentScrollY); // Update last scroll position
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="min-h-[100vh] overflow-hidden relative w-full ">
            <div
                className={`fixed  top-0 left-0 w-full h-14 p-2 right-0 z-50 transition-transform ease-in-out duration-300 ${
                    showNavbar ? "transform-none" : "-translate-y-full"
                    }`}
                >
            <Navbar />
        </div>
        {children}
    </div>
  );
}