"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
  Stethoscope,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "./ui/button";
import { UserRole } from "@/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/doctors", label: "Search Doctors" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, switchRole } = useAuth();

  const isActive = (href: string) => pathname === href;

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-rose-500/30 rounded-full animate-pulse-glow" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">
              MediFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    {user.role === "doctor" && <Stethoscope className="w-4 h-4" />}
                    {user.role === "patient" && <User className="w-4 h-4" />}
                    {user.role === "receptionist" && <Shield className="w-4 h-4" />}
                    <span className="capitalize">{user.role}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  <AnimatePresence>
                    {roleMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-800 border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="p-1">
                          <button
                            onClick={() => handleRoleSwitch("patient")}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
                          >
                            <User className="w-4 h-4" /> Patient View
                          </button>
                          <button
                            onClick={() => handleRoleSwitch("doctor")}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
                          >
                            <Stethoscope className="w-4 h-4" /> Doctor View
                          </button>
                          <button
                            onClick={() => handleRoleSwitch("receptionist")}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors"
                          >
                            <Shield className="w-4 h-4" /> Admin View
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-slate-300 hover:text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 text-white border-0">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/10"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
