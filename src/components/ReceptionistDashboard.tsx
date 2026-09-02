"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Users, BedDouble, Calendar, Clock, CheckCircle, XCircle, Search, MapPin, Stethoscope, Brain, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Patient, Doctor, Bed, Appointment } from "@/types";
import { formatDate } from "@/lib/utils";

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("triage");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    address: "",
    branch: "Main Branch",
    symptoms: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    bloodType: "",
    emergencyContact: "",
    vitals: {
      heartRate: "",
      oxygenLevel: "",
      bloodPressure: "",
      temperature: "",
      respiratoryRate: "",
    },
  });
  const [aiResult, setAiResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [patRes, docRes, bedRes, aptRes] = await Promise.all([
        fetch("/api/patients"), fetch("/api/doctors"),
        fetch("/api/beds"), fetch("/api/appointments"),
      ]);
      setPatients(await patRes.json());
      setDoctors(await docRes.json());
      setBeds(await bedRes.json());
      setAppointments(await aptRes.json());
    } catch (e) { console.error(e); }
  };

  const updateAppointmentStatus = async (aptId: string, status: Appointment["status"]) => {
    await fetch("/api/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: aptId, status }) });
    fetchData();
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVitalsChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, vitals: { ...prev.vitals, [field]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        age: Number(form.age || 0),
        vitals: {
          heartRate: form.vitals.heartRate ? Number(form.vitals.heartRate) : undefined,
          oxygenLevel: form.vitals.oxygenLevel ? Number(form.vitals.oxygenLevel) : undefined,
          bloodPressure: form.vitals.bloodPressure || undefined,
          temperature: form.vitals.temperature ? Number(form.vitals.temperature) : undefined,
          respiratoryRate: form.vitals.respiratoryRate ? Number(form.vitals.respiratoryRate) : undefined,
        },
      };

      const response = await fetch("/api/patient-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Patient registration failed");
      }

      setAiResult(data);
      setActiveTab("triage");
      await fetchData();
    } catch (error: any) {
      alert(error.message || "Unable to register patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "triage", label: "Intake", icon: Brain },
    { id: "beds", label: "Beds", icon: BedDouble },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
  ];

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()));

  const bedStatusColors: Record<string, string> = {
    Available: "bg-green-500/20 text-green-400 border-green-500/30",
    Occupied: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    Maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Patient intake</h1>
              <p className="text-slate-400 text-sm">Front desk overview for triage, admissions, and follow-up</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-white">{beds.filter(b => b.status === "Available").length}</p>
              <p className="text-slate-400 text-xs">Beds available</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-white">{appointments.filter(a => a.status === "Pending").length}</p>
              <p className="text-slate-400 text-xs">Pending visits</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white/5">
              <p className="text-2xl font-bold text-white">{patients.filter(p => p.aiPriority === "Emergency").length}</p>
              <p className="text-slate-400 text-xs">Urgent cases</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-rose-500/25" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "triage" && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><FileText className="w-5 h-5 text-blue-400" />Patient registration and triage</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Patient name" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" required />
                  <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="Phone number" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" required />
                  <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="Age" type="number" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.gender} onChange={(e) => handleChange("gender", e.target.value)} placeholder="Gender" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <select value={form.branch} onChange={(e) => handleChange("branch", e.target.value)} className="rounded-xl bg-white/5 border border-white/10 p-3 text-white">
                    <option className="bg-slate-900">Main Branch</option>
                    <option className="bg-slate-900">North Branch</option>
                    <option className="bg-slate-900">South Branch</option>
                  </select>
                  <input value={form.bloodType} onChange={(e) => handleChange("bloodType", e.target.value)} placeholder="Blood type" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} placeholder="Emergency contact" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                </div>

                <textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Address" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" rows={2} />
                <textarea value={form.symptoms} onChange={(e) => handleChange("symptoms", e.target.value)} placeholder="Current symptoms / chief complaint" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" rows={3} required />
                <textarea value={form.medicalHistory} onChange={(e) => handleChange("medicalHistory", e.target.value)} placeholder="Medical history / previous diagnoses" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" rows={2} />
                <textarea value={form.allergies} onChange={(e) => handleChange("allergies", e.target.value)} placeholder="Allergies" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" rows={2} />
                <textarea value={form.currentMedications} onChange={(e) => handleChange("currentMedications", e.target.value)} placeholder="Current medications / previous treatments" className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" rows={2} />

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <input value={form.vitals.heartRate} onChange={(e) => handleVitalsChange("heartRate", e.target.value)} placeholder="HR" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.vitals.oxygenLevel} onChange={(e) => handleVitalsChange("oxygenLevel", e.target.value)} placeholder="SpO2" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.vitals.bloodPressure} onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)} placeholder="BP" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.vitals.temperature} onChange={(e) => handleVitalsChange("temperature", e.target.value)} placeholder="Temp" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                  <input value={form.vitals.respiratoryRate} onChange={(e) => handleVitalsChange("respiratoryRate", e.target.value)} placeholder="RR" className="rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-slate-500" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-rose-500 px-4 py-3 font-medium text-white disabled:opacity-60">
                  {isSubmitting ? "Reviewing patient details..." : "Register patient"}
                </button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2"><Brain className="w-5 h-5 text-rose-400" />Triage result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!aiResult ? (
                <div className="rounded-xl border border-dashed border-white/10 p-5 text-slate-400">
                  No patient records have been added yet. Once a registration is submitted, the triage summary will appear here.
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <p className="text-slate-400">Patient ID</p>
                    <p className="mt-1 text-xl font-semibold text-white">{aiResult.patient?.id || "Generated automatically"}</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <p className="text-slate-400">Priority</p>
                    <Badge variant={aiResult.ai.priority === "Emergency" ? "destructive" : aiResult.ai.priority === "Urgent" ? "warning" : "success"} className="mt-2">{aiResult.ai.priority}</Badge>
                    <p className="mt-3 text-slate-300">Department: {aiResult.ai.department}</p>
                    <p className="mt-2 text-slate-300">{aiResult.ai.summary}</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <p className="text-slate-400">Recommended doctor</p>
                    <p className="mt-2 text-white font-medium">{aiResult.ai.doctor?.name || "No doctor currently available"}</p>
                    <p className="text-slate-300">{aiResult.ai.doctor?.specialization || "Manual follow-up required"}</p>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <p className="text-slate-400">Bed allocation</p>
                    <p className="mt-2 text-white font-medium">{aiResult.ai.bed ? aiResult.ai.bed.ward + " - " + aiResult.ai.bed.bedNumber : "No allocation required / no bed available"}</p>
                    <p className="text-slate-300">{aiResult.nextStep}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "beds" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beds.map((bed, i) => (
            <motion.div key={bed.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass border-white/10 hover:border-white/20 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div><h3 className="text-white font-semibold">{bed.bedNumber}</h3><p className="text-slate-400 text-sm">{bed.ward}</p></div>
                    <Badge className={`${bedStatusColors[bed.status]} border`}>{bed.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-3"><MapPin className="w-4 h-4" />{bed.branch}</div>
                  {bed.patientId && <p className="text-slate-500 text-xs mb-3">Patient: {patients.find(p => p.id === bed.patientId)?.name || bed.patientId}</p>}
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-200">
                    Bed assignments are suggested during triage and may be adjusted by the care team.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "appointments" && (
        <Card className="glass border-white/10">
          <CardHeader><CardTitle className="text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-rose-400" />Appointment Queue</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt, i) => (
                <motion.div key={apt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-white font-medium">{apt.type}</h4>
                      <Badge variant={apt.status === "Confirmed" ? "success" : apt.status === "Pending" ? "warning" : "default"}>{apt.status}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{formatDate(apt.date)} at {apt.timeSlot}</p>
                    <p className="text-slate-500 text-xs mt-1">Patient: {patients.find(p => p.id === apt.patientId)?.name || apt.patientId} | Doctor: {doctors.find(d => d.id === apt.doctorId)?.name || apt.doctorId}</p>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === "Pending" && (
                      <button onClick={() => updateAppointmentStatus(apt.id, "Confirmed")} className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                    )}
                    <button onClick={() => updateAppointmentStatus(apt.id, "Cancelled")} className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"><XCircle className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "patients" && (
        <>
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map((patient, i) => (
              <motion.div key={patient.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-semibold">{patient.name}</h3>
                      <Badge variant={patient.aiPriority === "Emergency" ? "destructive" : patient.aiPriority === "Urgent" ? "warning" : "success"}>{patient.aiPriority || patient.admissionStatus}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-slate-400">
                      <p>ID: {patient.id}</p><p>Age: {patient.age} | Gender: {patient.gender}</p><p>Blood: {patient.bloodType}</p>
                      <p>AI route: {patient.aiDepartment || "—"}</p>
                      {patient.ward && <p>{patient.ward} - {patient.bedNumber}</p>}
                      <p>Assigned Doctor: {doctors.find(d => d.id === patient.assignedDoctorId)?.name || "None"}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {activeTab === "doctors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor, i) => (
            <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass border-white/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <img src={doctor.photo} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{doctor.name}</h3>
                      <p className="text-rose-400 text-sm">{doctor.specialization}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {doctor.branch}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doctor.experience} yrs</span>
                      </div>
                    </div>
                    <Badge variant={doctor.isAvailable ? "success" : "secondary"}>{doctor.isAvailable ? "Available" : "Off Duty"}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
