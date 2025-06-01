"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProducts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Cricinfo-style accent bar */}
      <div className="w-full h-1 bg-[#00b8ff]" />
      <nav className="w-full bg-[#1a2b49] shadow flex items-center justify-between px-6 md:px-12 py-0 h-14">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center h-full">
          <Link href="/" className="text-white font-extrabold text-xl tracking-wide flex items-center h-full">
            <span className="uppercase">Aihubspot</span>
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8 h-full">
          <div className="relative h-full flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="flex items-center gap-1 text-white font-semibold h-full px-2 hover:underline hover:text-[#00b8ff] transition border-b-2 border-transparent hover:border-[#00b8ff]"
            >
              Products
              <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProducts ? 'rotate-180' : ''}`} />
            </button>
            {showProducts && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded shadow-lg border border-gray-100 py-2 animate-fade-in">
                <Link 
                  href="/outbound-dashboard"
                  className="block px-4 py-3 hover:bg-[#e6f7ff] text-[#1a2b49] hover:text-[#00b8ff] font-semibold transition-colors duration-200"
                  onClick={() => setShowProducts(false)}
                >
                  Outbound Automation Dashboard
                </Link>
                {/* Add other products here */}
              </div>
            )}
          </div>
          <Link href="/docs" className="text-white font-semibold px-2 h-full flex items-center hover:underline hover:text-[#00b8ff] transition border-b-2 border-transparent hover:border-[#00b8ff]">Documentation</Link>
          <Link href="/pricing" className="text-white font-semibold px-2 h-full flex items-center hover:underline hover:text-[#00b8ff] transition border-b-2 border-transparent hover:border-[#00b8ff]">Pricing</Link>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center h-full">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded text-white hover:bg-[#223366] focus:outline-none focus:ring-2 focus:ring-[#00b8ff]"
            aria-label="Open menu"
            title="Open menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </nav>
      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {/* Mobile menu drawer */}
      <div className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1a2b49] shadow-lg transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 md:hidden flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00b8ff]">
          <span className="text-white font-extrabold text-lg uppercase">Aihubspot</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2" aria-label="Close menu" title="Close menu"><FiX className="w-6 h-6" /></button>
        </div>
        <nav className="flex flex-col gap-2 px-6 py-4">
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="flex items-center gap-2 text-white font-semibold py-2 hover:text-[#00b8ff]"
          >
            Products
            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProducts ? 'rotate-180' : ''}`} />
          </button>
          {showProducts && (
            <div className="pl-4 flex flex-col gap-1">
              <Link
                href="/outbound-dashboard"
                className="block px-2 py-2 text-[#1a2b49] bg-white rounded hover:bg-[#e6f7ff] hover:text-[#00b8ff] font-semibold"
                onClick={() => { setShowProducts(false); setIsMobileMenuOpen(false); }}
              >
                Outbound Automation Dashboard
              </Link>
            </div>
          )}
          <Link href="/docs" className="text-white font-semibold py-2 hover:text-[#00b8ff]" onClick={() => setIsMobileMenuOpen(false)}>Documentation</Link>
          <Link href="/pricing" className="text-white font-semibold py-2 hover:text-[#00b8ff]" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
        </nav>
      </div>
    </header>
  );
} 