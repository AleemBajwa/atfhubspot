"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [showProducts, setShowProducts] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow">
      <div className="font-bold text-xl">
        <Link href="/">aihubspot</Link>
      </div>
      <div className="flex items-center gap-8">
        <div
          className="relative"
          onMouseEnter={() => setShowProducts(true)}
          onMouseLeave={() => setShowProducts(false)}
        >
          <button className="font-semibold">Products ▾</button>
          {showProducts && (
            <div className="absolute top-full left-0 bg-white border rounded shadow-lg w-64 z-10">
              <Link href="/outbound-dashboard" className="block px-4 py-2 hover:bg-gray-100">
                <div className="font-bold">Outbound Automation Dashboard</div>
                <div className="text-xs text-gray-500">AI-powered outbound automation and analytics</div>
              </Link>
              {/* Add other products here as needed */}
            </div>
          )}
        </div>
        {/* Add more nav links as needed */}
      </div>
    </nav>
  );
} 