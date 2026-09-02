"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, MapPin, Clock, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "@/types";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [branch, setBranch] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const specialties = ["all", "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Dermatology", "Oncology"];
  const branches = ["all", "Main Branch", "North Branch", "South Branch"];
  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"];

  useEffect(() => { fetchDoctors(); }, [specialty, branch]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialty !== "all") params.append("specialization", specialty);
      if (branch !== "all") params.append("branch", branch);
      const res = await fetch(`/api/doctors?${params}`);
      setDoctors(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filteredDoctors = doctors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()));

  const handleBook = async () => {
    if (!bookingDoctor || !bookingDate || !bookingTime) return;
    try {
      await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: "pat-002", doctorId: bookingDoctor.id, date: bookingDate, timeSlot: bookingTime, status: "Pending", type: "General Consultation" }) });
      setBookingSuccess(true);
      setTimeout(() => { setBookingSuccess(false); setBookingDoctor(null); setBookingDate(""); setBookingTime(""); }, 2000);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find the right <span className="text-rose-400">doctor</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Search by specialty or location, then choose a time that suits you.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or specialty"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-all" />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="pl-9 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500/50 appearance-none cursor-pointer">
                  {specialties.map((s) => <option key={s} value={s} className="bg-slate-800">{s === "all" ? "All specialties" : s}</option>)}
                </select>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select value={branch} onChange={(e) => setBranch(e.target.value)} className="pl-9 pr-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500/50 appearance-none cursor-pointer">
                  {branches.map((b) => <option key={b} value={b} className="bg-slate-800">{b === "all" ? "All branches" : b}</option>)}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDoctors.map((doctor, i) => (
                <motion.div key={doctor.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5 }} className="glass rounded-2xl overflow-hidden hover:border-rose-500/30 transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={doctor.photo} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3"><Badge variant="success" className="bg-green-500/80 backdrop-blur-sm"><Star className="w-3 h-3 mr-1 fill-current" />{doctor.rating}</Badge></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-1">{doctor.name}</h3>
                    <p className="text-rose-400 text-sm font-medium mb-3">{doctor.specialization}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-400 text-sm"><MapPin className="w-4 h-4" />{doctor.branch}</div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm"><Clock className="w-4 h-4" />{doctor.experience} years experience</div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm"><Calendar className="w-4 h-4" />{doctor.opdTimings}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent text-xs" onClick={() => setSelectedDoctor(doctor)}>View profile</Button>
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 text-white text-xs" onClick={() => setBookingDoctor(doctor)}>Book visit</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {selectedDoctor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDoctor(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                className="glass-strong rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <img src={selectedDoctor.photo} alt={selectedDoctor.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div><h2 className="text-xl font-bold text-white">{selectedDoctor.name}</h2><p className="text-rose-400">{selectedDoctor.specialization}</p></div>
                  </div>
                  <button onClick={() => setSelectedDoctor(null)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4 text-slate-300 text-sm">
                  <p>{selectedDoctor.about}</p>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                    <div><span className="text-slate-500">Experience</span><p className="text-white font-medium">{selectedDoctor.experience} years</p></div>
                    <div><span className="text-slate-500">Patients</span><p className="text-white font-medium">{selectedDoctor.patientsCount}+</p></div>
                    <div><span className="text-slate-500">Rating</span><p className="text-white font-medium flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{selectedDoctor.rating}</p></div>
                    <div><span className="text-slate-500">Branch</span><p className="text-white font-medium">{selectedDoctor.branch}</p></div>
                  </div>
                  <div><span className="text-slate-500 block mb-1">OPD timings</span><p className="text-white">{selectedDoctor.opdTimings}</p></div>
                  <div><span className="text-slate-500 block mb-1">Contact</span><p className="text-white">{selectedDoctor.email}</p><p className="text-white">{selectedDoctor.phone}</p></div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-rose-500 text-white" onClick={() => { setSelectedDoctor(null); setBookingDoctor(selectedDoctor); }}>Book an appointment</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {bookingDoctor && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setBookingDoctor(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}
                className="glass-strong rounded-2xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Book an appointment</h2>
                  <button onClick={() => setBookingDoctor(null)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-5 h-5" /></button>
                </div>
                {bookingSuccess ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-green-400" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">Appointment booked</h3><p className="text-slate-400">We’ll confirm the details with you shortly.</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-white/5">
                      <img src={bookingDoctor.photo} alt={bookingDoctor.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div><p className="text-white font-medium">{bookingDoctor.name}</p><p className="text-slate-400 text-sm">{bookingDoctor.specialization}</p></div>
                    </div>
                    <div className="space-y-4">
                      <div><label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500/50" /></div>
                      <div><label className="block text-sm font-medium text-slate-300 mb-2">Time slot</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((slot) => (
                            <button key={slot} onClick={() => setBookingTime(slot)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${bookingTime === slot ? "bg-rose-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{slot}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-rose-500 text-white py-3" disabled={!bookingDate || !bookingTime} onClick={handleBook}>Confirm booking</Button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
