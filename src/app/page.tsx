"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Activity,
  Shield,
  Clock,
  Phone,
  ArrowRight,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const specialties = [
  { icon: Heart, name: "Cardiology", desc: "Heart care and treatment", color: "text-rose-400" },
  { icon: Brain, name: "Neurology", desc: "Care for the brain and nervous system", color: "text-purple-400" },
  { icon: Baby, name: "Pediatrics", desc: "Support for children and families", color: "text-sky-400" },
  { icon: Bone, name: "Orthopedics", desc: "Bone, joint, and mobility care", color: "text-emerald-400" },
  { icon: Stethoscope, name: "General Medicine", desc: "Everyday care and follow-up", color: "text-amber-400" },
  { icon: Sparkles, name: "Dermatology", desc: "Skin and general wellness care", color: "text-pink-400" },
];

const stats = [
  { value: "50+", label: "Specialists" },
  { value: "10K+", label: "Patients cared for" },
  { value: "99%", label: "Care follow-through" },
  { value: "24/7", label: "Emergency support" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                Care that fits your day
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-6 text-slate-100"
            >
              <span>Healthcare</span>
              <br />
              <span className="text-white">that feels a little easier.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-xl mx-auto leading-loose"
            >
              Find a doctor, book a visit, and keep your care details close at hand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/doctors">
                <Button
                  size="lg"
                  className="bg-slate-200 hover:bg-white text-slate-900 px-8 py-6 text-lg rounded-full shadow-none"
                >
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Book an appointment
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full shadow-none"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Patient login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why patients choose <span className="text-rose-400">MediFlow</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The essentials are in one place, so you can spend less time sorting things out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Activity,
                title: "Easy access to care",
                desc: "Find a specialist, book a visit, and check your records when you need them.",
              },
              {
                icon: Shield,
                title: "Clear updates",
                desc: "See your appointments, care plans, and next steps without guesswork.",
              },
              {
                icon: Clock,
                title: "Support when it matters",
                desc: "Get help from booking through follow-up, with someone to guide you along the way.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-8 hover:border-rose-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-rose-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="text-blue-400">departments</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Care for routine visits, specialist treatment, and the steps in between.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((spec, i) => (
              <motion.div
                key={spec.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <spec.icon className={`w-6 h-6 ${spec.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{spec.name}</h3>
                    <p className="text-slate-400 text-sm">{spec.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-blue-500/10" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-medium mb-6">
                <Phone className="w-4 h-4" />
                Emergency hotline
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                +1 (800) 911-MEDI
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto mb-8">
                For urgent medical help, call our team any time.
              </p>
              <Button
                size="lg"
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-rose-500/25"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
