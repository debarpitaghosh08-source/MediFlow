"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in <span className="text-blue-400">touch</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Have a question about an appointment or your care? Send us a note.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-6">
            [{icon:Phone,title:"Call us",lines:["+1 (800) 911-MEDI","Available 24/7"],color:"text-rose-400",bg:"bg-rose-500/20"},
              {icon:Mail,title:"Email",lines:["info@mediflow.com","support@mediflow.com"],color:"text-blue-400",bg:"bg-blue-500/20"},
              {icon:MapPin,title:"Visit us",lines:["123 Healthcare Avenue","Springfield, IL 62701"],color:"text-emerald-400",bg:"bg-emerald-500/20"},
              {icon:Clock,title:"Clinic hours",lines:["Mon - Sat: 8:00 AM - 8:00 PM","Sunday: 9:00 AM - 2:00 PM"],color:"text-amber-400",bg:"bg-amber-500/20"}].map((item) => (
              <div key={item.title} className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    {item.lines.map((line, i) => <p key={i} className={`text-sm ${i === item.lines.length - 1 && item.lines.length > 1 ? "text-slate-500 text-xs mt-1" : "text-slate-400"}`}>{line}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How can we help?</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Full name</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData,name:e.target.value})} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" /></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData,email:e.target.value})} placeholder="john@email.com" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData,subject:e.target.value})} placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" /></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({...formData,message:e.target.value})} placeholder="Tell us a little more about your question..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none" /></div>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 text-white px-8 py-3 rounded-xl">
                  {submitted ? <><CheckCircle className="w-4 h-4 mr-2" />Message sent</> : <><Send className="w-4 h-4 mr-2" />Send message</>}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
