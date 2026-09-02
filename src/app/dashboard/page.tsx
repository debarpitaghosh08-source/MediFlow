"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import ReceptionistDashboard from "@/components/ReceptionistDashboard";
import PatientDashboard from "@/components/PatientDashboard";
import DoctorDashboard from "@/components/DoctorDashboard";
import { patients, doctors } from "@/lib/mockData";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        Redirecting to login...
      </div>
    );
  }

  if (user.role === "receptionist") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ReceptionistDashboard />
      </div>
    );
  }

  if (user.role === "patient") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <PatientDashboard patient={patients.find((patient) => patient.email === user.email) ?? patients[0]} />
      </div>
    );
  }

  if (user.role === "doctor") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <DoctorDashboard doctor={doctors.find((doctor) => doctor.email === user.email) ?? doctors[0]} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="glass rounded-2xl p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Welcome back</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{user.name}</h1>
        <p className="mt-2 text-slate-300">Role: {user.role}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-slate-400 text-sm">Email</p>
            <p className="mt-2 text-white font-medium">{user.email}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-slate-400 text-sm">Hospital ID</p>
            <p className="mt-2 text-white font-medium">{user.hospitalId || "N/A"}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="text-slate-400 text-sm">Phone</p>
            <p className="mt-2 text-white font-medium">{user.phone || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
