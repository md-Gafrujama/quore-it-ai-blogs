"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PrivateComponent = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("email");
    if (!auth) {
      router.replace("/login");
    }
  }, [router]);

  // Optionally, you can show a loading state while checking auth
  const auth = typeof window !== "undefined" && localStorage.getItem("email");
  if (!auth) return null; // or a loading spinner

  return children;
};

export default PrivateComponent;
