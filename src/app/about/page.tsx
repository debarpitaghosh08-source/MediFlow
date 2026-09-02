"use client";

import { motion } from "framer-motion";
import { Heart, Cpu, Building2, Users, Award, Microscope } from "lucide-react";

const features = [
  { icon: Cpu, title: "Simple care pathways", desc: "Helping patients move from booking to treatment with less confusion." },
  { icon: Building2, title: "Well-organized care", desc: "A hospital setup designed to keep appointments, rooms, and staff aligned." },
  { icon: Users, title: "Patient-first support", desc: "Every part of the process is built around comfort, communication, and trust." },
  { icon: Award, title: "Experienced teams", desc: "Board-certified specialists working across core departments and services." },
  { icon: Microscope, title: "Clear clinical support", desc: "Diagnostic and treatment planning designed to help doctors and patients make informed decisions." },
  { icon: Heart, title: "Whole-person care", desc: "Attention to day-to-day wellbeing, recovery, and long-term health." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">About <span className="text-rose-400">MediFlow</span></h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            MediFlow brings appointments, patient information, and everyday hospital work together in one place.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-strong rounded-3xl p-8 md:p-12 mb-20 text-left md:text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our mission</h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            We believe care works better when information is clear, teams stay connected, and patients know what comes next.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              whileHover={{ y: -5 }} className="glass rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-rose-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Hospital overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            [{label:"Operating Theaters",value:"12"},{label:"ICU Beds",value:"48"},{label:"General Wards",value:"320"},{label:"Emergency Bays",value:"16"},{label:"Specialty Clinics",value:"24"},{label:"Diagnostic Labs",value:"8"},{label:"Pharmacy Units",value:"4"},{label:"Ambulance Fleet",value:"20"}].map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-3xl font-bold text-rose-400 mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
