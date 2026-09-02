"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarClock,
  Clock3,
  MapPin,
  Stethoscope,
  Syringe,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { doctors, roster, appointments, patients } from "@/lib/mockData";
import { Doctor } from "@/types";

export default function DoctorDashboard({ doctor }: { doctor?: Doctor }) {
  const currentDoctor = useMemo(() => doctor ?? doctors[0], [doctor]);

  const doctorRoster = roster.filter((entry) => entry.doctorId === currentDoctor.id);
  const doctorAppointments = appointments.filter((apt) => apt.doctorId === currentDoctor.id);
  const assignedPatients = patients.filter((patient) => patient.assignedDoctorId === currentDoctor.id);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentDoctor.photo}
              alt={currentDoctor.name}
              className="w-16 h-16 rounded-2xl object-cover border border-white/10"
            />
            <div>
              <p className="text-sm text-blue-300 uppercase tracking-[0.2em]">Doctor</p>
              <h1 className="text-3xl font-bold text-white">{currentDoctor.name}</h1>
              <p className="text-slate-400">{currentDoctor.specialization}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Doctor ID</p>
              <p className="font-semibold text-white">{currentDoctor.id}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Experience</p>
              <p className="font-semibold text-white">{currentDoctor.experience} yrs</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Department</p>
              <p className="font-semibold text-white">{currentDoctor.specialization}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" /> Duty Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-4">
                <div>
                  <p className="text-slate-400 text-sm">OPD Sign-in</p>
                  <p className="text-white font-medium">08:45 AM</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-slate-400 text-sm">Surgery assignment</p>
                  <p className="text-white font-medium mt-2">Yes • OR-3</p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-slate-400 text-sm">Ward round</p>
                  <p className="text-white font-medium mt-2">2:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-400" /> Patient Attendance Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assignedPatients.map((patient) => (
                <div key={patient.id} className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">{patient.name}</p>
                    <p className="text-slate-400 text-sm">{patient.ward || "Ward A"} • {patient.bedNumber || "Bed TBD"}</p>
                  </div>
                  <Badge variant="warning">Consult 11:30 AM</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400" /> Primary Branch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Primary branch</span><span className="text-white">{currentDoctor.branch}</span></div>
              <div className="flex justify-between"><span>OPD timings</span><span className="text-white">{currentDoctor.opdTimings}</span></div>
              <div className="flex justify-between"><span>Rating</span><span className="text-white">{currentDoctor.rating}/5</span></div>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" /> Schedule Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {doctorRoster.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium">{entry.type}</p>
                    <Badge variant={entry.type === "Surgery" ? "destructive" : entry.type === "Break" ? "secondary" : "success"}>{entry.type}</Badge>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{entry.startTime} - {entry.endTime}</p>
                  {entry.room && <p className="text-slate-400 text-sm">{entry.room}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock3 className="w-5 h-5 text-rose-400" /> Daily Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "08:45 AM", title: "OPD sign-in", label: "Patient triage" },
              { time: "09:30 AM", title: "Consultation block", label: "3 patient reviews" },
              { time: "12:30 PM", title: "Ward round", label: "Cardiac ward A" },
              { time: "02:00 PM", title: "Surgery", label: "OR-3 procedure" },
              { time: "04:30 PM", title: "Break", label: "Recovery / review" },
            ].map((item, index) => (
              <div key={item.time} className="flex gap-4 items-start">
                <div className="w-24 text-right text-slate-400 text-sm pt-2">{item.time}</div>
                <div className="relative flex-1">
                  {index !== 4 && <div className="absolute left-[0.7rem] top-8 bottom-[-1.5rem] w-px bg-white/10" />}
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 mt-3 rounded-full bg-gradient-to-r from-blue-500 to-rose-500" />
                    <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-slate-400 text-sm">{item.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-blue-300"><Stethoscope className="w-5 h-5" /> OPD</div>
          <p className="mt-3 text-2xl font-bold text-white">24</p>
          <p className="text-slate-400 text-sm">Patients scheduled</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-rose-300"><Syringe className="w-5 h-5" /> Surgery</div>
          <p className="mt-3 text-2xl font-bold text-white">2</p>
          <p className="text-slate-400 text-sm">Procedures today</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-emerald-300"><CalendarClock className="w-5 h-5" /> Ward rounds</div>
          <p className="mt-3 text-2xl font-bold text-white">3</p>
          <p className="text-slate-400 text-sm">Rounds completed</p>
        </div>
      </div>
    </div>
  );
}
