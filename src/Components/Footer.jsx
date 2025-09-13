'use client';

import { Facebook, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#001f26] text-white dark:bg-gray-900 dark:text-gray-100 relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001f26] via-[#002a33] to-[#001f26] opacity-50"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Logo Section */}
            <div className="space-y-4 text-center sm:text-left">
              <div className="group">
                <h1 className="text-3xl sm:text-4xl font-bold text-white group-hover:text-[#00d9a6] transition-all duration-300 ease-in-out transform group-hover:scale-105">
                  QuoreIT
                </h1>
                <div className="w-12 h-1 bg-[#00d9a6] rounded-full mt-2 mx-auto sm:mx-0 transform group-hover:w-20 transition-all duration-300"></div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
                Connecting talent with opportunities in the tech industry. Your trusted partner for career growth.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white relative">
                Quick Links
                <div className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-8 h-0.5 bg-[#00d9a6] rounded-full"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { label: "Find a job", path: "/Find-tech-jobs" },
                  { label: "Submit a vacancy", path: "/Find-tech-talent" },
                  { label: "What we do", path: "/What-we-do" },
                  { label: "News & Events", path: "/News-and-events" },
                  { label: "Contact us", path: "/Contact-us" },
                ].map(({ label, path }, idx) => (
                  <li key={idx} className="transform hover:translate-x-2 transition-all duration-200">
                    <Link
                      href={path}
                      className="text-gray-300 hover:text-[#00d9a6] transition-all duration-200 flex items-center justify-center sm:justify-start group text-sm font-medium"
                    >
                      <span className="w-0 h-0.5 bg-[#00d9a6] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-200 rounded-full"></span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white relative">
                Policies
                <div className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-8 h-0.5 bg-[#00d9a6] rounded-full"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { label: "Privacy Policy", path: "/Policies/Privacy-Policy" },
                  { label: "Cookies & Legal", path: "/Policies/Cookies-Legal" },
                  { label: "Modern Slavery Statement", path: "/Policies/Modern-Slavery-Statement" },
                ].map(({ label, path }, idx) => (
                  <li key={idx} className="transform hover:translate-x-2 transition-all duration-200">
                    <Link
                      href={path}
                      className="text-gray-300 hover:text-[#00d9a6] transition-all duration-200 flex items-center justify-center sm:justify-start group text-sm font-medium"
                    >
                      <span className="w-0 h-0.5 bg-[#00d9a6] mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-200 rounded-full"></span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white relative">
                Follow Us
                <div className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-8 h-0.5 bg-[#00d9a6] rounded-full"></div>
              </h3>
              <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                {[
                  { Icon: Facebook, label: "Facebook", href: "#" },
                  { Icon: Linkedin, label: "LinkedIn", href: "#" },
                  { Icon: Twitter, label: "Twitter", href: "#" },
                ].map(({ Icon, label, href }, idx) => (
                  <Link
                    key={idx}
                    href={href}
                    aria-label={label}
                    className="group relative p-2 sm:p-3 bg-[#213c42] rounded-full hover:bg-[#00d9a6] transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-full bg-[#00d9a6] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Link>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-4">
                Stay connected for the latest updates and opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d9a6] to-transparent h-px"></div>
          <div className="bg-[#213c42] h-px"></div>
        </div>

        {/* Bottom Section */}
        <div className="bg-[#213c42] py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="group cursor-pointer">
                  <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00d9a6] transition-colors duration-300">
                    QuoreIT
                  </h1>
                </div>
                <div className="hidden sm:block h-6 w-px bg-gray-500"></div>
                <p className="text-gray-400 text-sm">
                  © 2025 All Rights Reserved
                </p>
              </div>

              {/* Additional Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-400 text-center">
                <span className="hover:text-[#00d9a6] transition-colors duration-200 cursor-pointer">
                  Made with ❤️ for Tech Professionals
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00d9a6] rounded-full animate-pulse"></div>
                  <span className="text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}