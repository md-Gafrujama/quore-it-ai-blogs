'use client';

import React, { useState, useRef, useEffect } from 'react';
import logo from "@/Assets/logo.png"
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMobileDropdownOpen(false); // Close mobile dropdown when toggling menu
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsDropdownOpen(false);
      setIsMobileDropdownOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const techJobCategories = [
    { name: 'INFORMATION TECHNOLOGY', href: '/Find-tech-jobs/Information-technology' },
    { name: 'ENGINEERING', href: '/Find-tech-jobs/engineering' },
    { name: 'GOVERNMENT SERVICES', href: '/Find-tech-jobs/government-services' },
    { name: 'AEROSPACE STAFFING', href: '/Find-tech-jobs/consulting-services' },
    
  ];

  const navItems = [
    { name: 'FIND TECH JOBS', href: '/Find-tech-jobs', hasDropdown: true },
    { name: 'FIND TECH TALENT', href: '/Find-tech-talent' },
    { name: 'WHAT WE DO', href: '/What-we-do' },
    { name: 'NEWS & EVENTS', href: '/News-and-events' },
    { name: 'ABOUT US', href: '/about-us' },
    { name: 'CONTACT US', href: '/Contact-us' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src={logo}
                alt="Harvey Nash Logo"
                width={320}
                height={120}
                className="h-12 w-auto sm:h-14 md:h-16 lg:h-20 hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4 xl:space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative" ref={item.hasDropdown ? dropdownRef : null}>
                  {item.hasDropdown ? (
                    <div className="relative">
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className="text-black hover:text-[#00d9a6] px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 relative group rounded-md hover:scale-110 hover:-translate-y-2 hover:shadow-lg transform-gpu"
                          onMouseEnter={() => setIsDropdownOpen(true)}
                        >
                          <span className="relative z-10">{item.name}</span>
                          {/* Animated underline */}
                          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c5f82a] to-[#00d9a6] group-hover:w-full transition-all duration-500 ease-out"></div>
                          {/* Subtle glow effect */}
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#c5f82a]/10 to-[#00d9a6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                        </Link>
                        <button
                          onClick={toggleDropdown}
                          onMouseEnter={() => setIsDropdownOpen(true)}
                          className="text-black hover:text-[#00d9a6] px-1 py-2 transition-all duration-300 relative group rounded-md hover:scale-110 hover:-translate-y-2 hover:shadow-lg transform-gpu ml-1"
                        >
                          <svg
                            className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Desktop Dropdown */}
                      <div
                        className={`absolute left-0 mt-2 w-64 xl:w-72 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-300 transform origin-top ${
                          isDropdownOpen
                            ? 'opacity-100 scale-100 translate-y-0'
                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                        }`}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <div className="py-2">
                          {techJobCategories.map((category, index) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#00d9a6] hover:bg-gradient-to-r hover:from-[#c5f82a]/5 hover:to-[#00d9a6]/5 transition-all duration-300 relative group border-l-2 border-transparent hover:border-[#00d9a6] hover:scale-105 transform-gpu"
                              onClick={() => setIsDropdownOpen(false)}
                              style={{
                                transitionDelay: isDropdownOpen ? `${index * 30}ms `: '0ms'
                              }}
                            >
                              <span className="relative z-10">{category.name}</span>
                              {/* Subtle side accent */}
                              <div className="absolute right-0 top-0 w-0 h-full bg-gradient-to-l from-[#00d9a6]/20 to-transparent group-hover:w-2 transition-all duration-300"></div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-black hover:text-[#00d9a6] px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 relative group rounded-md hover:scale-110 hover:-translate-y-2 hover:shadow-lg transform-gpu"
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Animated underline */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c5f82a] to-[#00d9a6] group-hover:w-full transition-all duration-500 ease-out"></div>
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#c5f82a]/10 to-[#00d9a6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-[#00d9a6] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-md transform-gpu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-transform duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-transform duration-300 rotate-180`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 -translate-y-4'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-200">
          {navItems.map((item, index) => (
            <div key={item.name} ref={item.hasDropdown ? mobileDropdownRef : null}>
              {item.hasDropdown ? (
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 text-black hover:text-[#00d9a6] px-3 py-2 text-base font-medium tracking-wide transition-all duration-300 relative group rounded-md hover:scale-105 hover:-translate-y-1 hover:shadow-md border-2 border-transparent transform-gpu"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileDropdownOpen(false);
                      }}
                      style={{
                        transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms'
                      }}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Animated underline for mobile */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c5f82a] to-[#00d9a6] group-hover:w-full transition-all duration-500 ease-out"></div>
                      {/* Subtle side border effect */}
                      <div className="absolute left-0 top-0 w-0 h-full bg-gradient-to-b from-[#c5f82a] to-[#00d9a6] group-hover:w-1 transition-all duration-300 rounded-r"></div>
                    </Link>
                    <button
                      onClick={toggleMobileDropdown}
                      className="px-3 py-2 text-black hover:text-[#00d9a6] transition-all duration-300"
                    >
                      <svg
                        className={`h-5 w-5 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Dropdown */}
                  <div
                    className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                      isMobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {techJobCategories.map((category, categoryIndex) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#00d9a6] hover:bg-gradient-to-r hover:from-[#c5f82a]/5 hover:to-[#00d9a6]/5 transition-all duration-300 relative group rounded-md hover:scale-105 transform-gpu border-l-2 border-gray-200 hover:border-[#00d9a6]"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileDropdownOpen(false);
                        }}
                        style={{
                          transitionDelay: isMobileDropdownOpen ? `${categoryIndex * 50}ms` : '0ms'
                        }}
                      >
                        <span className="relative z-10">{category.name}</span>
                        {/* Subtle background effect */}
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#c5f82a]/5 to-[#00d9a6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-black hover:text-[#00d9a6] block px-3 py-2 text-base font-medium tracking-wide transition-all duration-300 relative group rounded-md hover:scale-105 hover:-translate-y-1 hover:shadow-md border-2 border-transparent transform-gpu"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Animated underline for mobile */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#c5f82a] to-[#00d9a6] group-hover:w-full transition-all duration-500 ease-out"></div>
                  {/* Subtle side border effect */}
                  <div className="absolute left-0 top-0 w-0 h-full bg-gradient-to-b from-[#c5f82a] to-[#00d9a6] group-hover:w-1 transition-all duration-300 rounded-r"></div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;