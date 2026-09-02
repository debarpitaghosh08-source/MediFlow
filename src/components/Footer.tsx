"use client";

import { Heart, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">
                MediFlow
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Simple, reliable care coordination for patients, families, and clinical teams.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Search Doctors", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-slate-400 hover:text-rose-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Departments</h4>
            <ul className="space-y-2">
              {["Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Oncology"].map((dept) => (
                <li key={dept}>
                  <span className="text-slate-400 text-sm">{dept}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Emergency contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-rose-500" />
                +1 (800) 911-MEDI
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-rose-500" />
                emergency@mediflow.com
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-rose-500" />
                123 Healthcare Ave, Springfield
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 MediFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
