"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Bell,
  Calendar,
  Clock3,
  HeartPulse,
  MapPin,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, notifications, prescriptions, visitHistories, patients } from "@/lib/mockData";
import type { Notification as AppNotification, Patient } from "@/types";

export default function PatientDashboard({ patient }: { patient?: Patient }) {
  const currentPatient = useMemo(() => patient ?? patients[0], [patient]);
  const [activeTab, setActiveTab] = useState<"overview" | "appointments" | "timeline">("overview");
  const [patientNotifications, setPatientNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setPatientNotifications(
      notifications.filter((item) => item.userId === currentPatient.id)
    );
  }, [currentPatient.id]);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      const reminder = patientNotifications.find((item) => !item.read);
      if (reminder) {
        new Notification(reminder.title, { body: reminder.message });
      }
    }
  }, [patientNotifications]);

  const patientAppointments = appointments.filter(
    (apt) => apt.patientId === currentPatient.id
  );
  const patientVisitHistory = visitHistories.filter(
    (visit) => visit.patientId === currentPatient.id
  );
  const patientPrescriptions = prescriptions.filter(
    (prescription) => prescription.patientId === currentPatient.id
  );

  const timelineSchedule = [
    { time: "08:00 AM", label: "Aspirin", note: "Cardiac care routine" },
    { time: "12:00 PM", label: "Hydration check", note: "Daily fluids review" },
    { time: "02:30 PM", label: "Physio session", note: "Mobility plan" },
    { time: "08:00 PM", label: "Metoprolol", note: "Evening medication" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-rose-500/20 flex items-center justify-center">
              <UserRound className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-blue-300 uppercase tracking-[0.2em]">Patient</p>
              <h1 className="text-3xl font-bold text-white">{currentPatient.name}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Blood Type</p>
              <p className="font-semibold text-white">{currentPatient.bloodType}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Status</p>
              <Badge variant={currentPatient.admissionStatus === "Admitted" ? "destructive" : "success"}>
                {currentPatient.admissionStatus}
              </Badge>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2">
              <p className="text-slate-400">Branch</p>
              <p className="font-semibold text-white">{currentPatient.branch}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "overview", label: "Overview" },
          { id: "appointments", label: "Appointments" },
          { id: "timeline", label: "Medicine Timeline" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-rose-500 text-white"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === "overview" || activeTab === "appointments") && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-6">
          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Visit History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientVisitHistory.map((visit) => (
                  <div key={visit.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <p className="text-white font-semibold">{visit.diagnosis}</p>
                      <span className="text-xs text-slate-400">{visit.date}</span>
                    </div>
                    <p className="text-slate-300 text-sm">{visit.notes}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {visit.symptoms.map((symptom) => (
                        <span key={symptom} className="rounded-full bg-blue-500/10 text-blue-200 px-2 py-1 text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-amber-400" /> Prescriptions & Eligibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white font-semibold">{prescription.diagnosis}</p>
                      <Badge variant="success">Eligible</Badge>
                    </div>
                    <div className="grid gap-3">
                      {prescription.medicines.map((medicine) => (
                        <div key={medicine.name} className="rounded-lg bg-slate-900/70 p-3">
                          <p className="text-white font-medium">{medicine.name}</p>
                          <div className="mt-1 text-xs text-slate-300 flex flex-wrap gap-2">
                            <span>{medicine.dosage}</span>
                            <span>{medicine.frequency}</span>
                            <span>{medicine.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-400" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {patientNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium">{notification.title}</p>
                      {!notification.read && <AlertCircle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{notification.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" /> Admission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between"><span>Ward</span><span className="text-white">{currentPatient.ward || "General Ward"}</span></div>
                <div className="flex justify-between"><span>Bed</span><span className="text-white">{currentPatient.bedNumber || "TBA"}</span></div>
                <div className="flex justify-between"><span>Assigned Doctor</span><span className="text-white">Dr. Sarah Mitchell</span></div>
                <div className="flex justify-between"><span>Admission</span><span className="text-white">{currentPatient.admissionStatus}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "appointments" && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientAppointments.map((apt) => (
              <div key={apt.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-white font-medium">{apt.type}</p>
                  <p className="text-slate-400 text-sm">{apt.date} • {apt.timeSlot}</p>
                </div>
                <Badge variant={apt.status === "Confirmed" ? "success" : "warning"}>{apt.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "timeline" && (
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-rose-400" /> Daily Medicine Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timelineSchedule.map((entry, index) => (
                <div key={entry.time} className="flex gap-4 items-start">
                  <div className="w-24 text-right text-slate-400 text-sm pt-2">{entry.time}</div>
                  <div className="relative flex-1">
                    {index !== timelineSchedule.length - 1 && <div className="absolute left-[0.7rem] top-8 bottom-[-1rem] w-px bg-white/10" />}
                    <div className="flex items-start gap-3">
                      <div className="w-3 h-3 mt-3 rounded-full bg-gradient-to-r from-blue-500 to-rose-500" />
                      <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3">
                        <p className="text-white font-medium">{entry.label}</p>
                        <p className="text-slate-400 text-sm">{entry.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-blue-300"><HeartPulse className="w-5 h-5" /> Vitals</div>
          <p className="mt-3 text-2xl font-bold text-white">96%</p>
          <p className="text-slate-400 text-sm">Oxygen stability</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-rose-300"><Activity className="w-5 h-5" /> Recovery</div>
          <p className="mt-3 text-2xl font-bold text-white">82%</p>
          <p className="text-slate-400 text-sm">Progress score</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3 text-emerald-300"><Stethoscope className="w-5 h-5" /> Follow-up</div>
          <p className="mt-3 text-2xl font-bold text-white">3 days</p>
          <p className="text-slate-400 text-sm">Next checkup</p>
        </div>
      </div>
    </div>
  );
}
