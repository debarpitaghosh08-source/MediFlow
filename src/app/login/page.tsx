"use client";

import { useMemo, useState, type SVGProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Heart,
  Mail,
  Phone,
  BadgeCheck,
  ArrowRight,
  AlertCircle,
  Loader2,
  User,
  Stethoscope,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import { UserRole } from "@/types";
import {
  signInWithGoogleFirebase,
  signInWithFacebookFirebase,
  sendPhoneNumberOtp,
  confirmPhoneOtp,
  isFirebaseConfigured,
} from "@/lib/firebase";

type LoginMethod = "google" | "facebook" | "phone" | "hospitalId";

function GoogleLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M21.35 12.23c0-.78-.07-1.53-.22-2.23H12v4.22h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.18 2.91-7.37Z" />
      <path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.34l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.74 9.74 0 0 0 12 21.7Z" />
      <path fill="#FBBC05" d="M6.54 13.81A5.85 5.85 0 0 1 6.23 12c0-.63.11-1.24.31-1.81V7.67H3.3A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.33l3.24-2.52Z" />
      <path fill="#EA4335" d="M12 6.16c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.25 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.7 5.37l3.24 2.52C7.31 7.88 9.46 6.16 12 6.16Z" />
    </svg>
  );
}

function FacebookLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path fill="white" d="M13.4 20v-7h2.35l.35-2.73H13.4V8.53c0-.79.22-1.33 1.36-1.33h1.45V4.76c-.25-.03-1.11-.11-2.12-.11-2.1 0-3.54 1.28-3.54 3.64v1.98H8.18V13h2.37v7h2.85Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>("hospitalId");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hospitalId, setHospitalId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const firebaseEnabled = useMemo(() => isFirebaseConfigured, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      let success = false;

      if (method === "google") {
        if (!firebaseEnabled) {
          const safeEmail = email.trim() || "john.anderson@email.com";
          success = await login(method, { email: safeEmail });
        } else {
          const result = await signInWithGoogleFirebase();
          const signedInEmail = result.user.email || email;
          success = await login(method, { email: signedInEmail });
        }
      } else if (method === "facebook") {
        if (!firebaseEnabled) {
          const safeEmail = email.trim() || "sarah.mitchell@mediflow.com";
          success = await login(method, { email: safeEmail });
        } else {
          const result = await signInWithFacebookFirebase();
          const signedInEmail = result.user.email || email;
          success = await login(method, { email: signedInEmail });
        }
      } else if (method === "phone") {
        if (!showOtp) {
          const normalizedPhone = phone.trim();
          if (!normalizedPhone) {
            throw new Error("Please enter a phone number");
          }

          if (!firebaseEnabled) {
            const demoOtp = "123456";
            (window as any).__mediflow_phone_confirmation = { confirm: async () => true };
            (window as any).__mediflow_phone_demo_otp = demoOtp;
            setShowOtp(true);
            setOtpSent(true);
            setSuccessMessage(`Demo code sent to ${normalizedPhone}: ${demoOtp}`);
            return;
          }

          const confirmation = await sendPhoneNumberOtp(normalizedPhone);
          (window as any).__mediflow_phone_confirmation = confirmation;
          setShowOtp(true);
          setOtpSent(true);
          setSuccessMessage("A code has been sent. Please enter it below.");
          return;
        }

        const confirmation = (window as any).__mediflow_phone_confirmation;
        if (!confirmation) {
          throw new Error("Please request a code before continuing.");
        }

        if (!firebaseEnabled) {
          const expectedOtp = (window as any).__mediflow_phone_demo_otp;
          if (!expectedOtp || String(otp) !== String(expectedOtp)) {
            throw new Error("The code you entered is not correct. Please try again.");
          }
          success = await login("phone", { phone, otp });
        } else {
          await confirmPhoneOtp(confirmation, otp);
          success = await login("phone", { phone, otp });
        }
      } else if (method === "hospitalId") {
        if (!showOtp) {
          if (!hospitalId.trim()) {
            throw new Error("Please enter your hospital ID");
          }
          const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
          (window as any).__mediflow_hospital_otp = generatedOtp;
          setShowOtp(true);
          setOtpSent(true);
          setSuccessMessage(`Verification code for ${hospitalId}: ${generatedOtp}`);
          return;
        }

        const expectedOtp = (window as any).__mediflow_hospital_otp;
        if (!expectedOtp || String(otp) !== String(expectedOtp)) {
          throw new Error("The verification code is incorrect. Please try again.");
        }

        success = await login("hospitalId", { hospitalId, otp });
      }

      if (success) {
        router.push("/dashboard");
      } else {
        setError("The details you entered do not match our records. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setError("");
    setSuccessMessage("");
    setIsLoading(true);
    const success = await login("demo", { role });
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Demo login failed. Please try again.");
    }
    setIsLoading(false);
  };

  const handleMethodChange = (nextMethod: LoginMethod) => {
    setMethod(nextMethod);
    setShowOtp(false);
    setOtpSent(false);
    setOtp("");
    setError("");
    setSuccessMessage("");
    if ((window as any).__mediflow_hospital_otp) delete (window as any).__mediflow_hospital_otp;
    if ((window as any).__mediflow_phone_confirmation) delete (window as any).__mediflow_phone_confirmation;
  };

  const methods = [
    { id: "hospitalId" as LoginMethod, label: "Hospital ID", icon: BadgeCheck },
    { id: "phone" as LoginMethod, label: "Phone code", icon: Phone },
    { id: "google" as LoginMethod, label: "Google", icon: GoogleLogo },
    { id: "facebook" as LoginMethod, label: "Facebook", icon: FacebookLogo },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-rose-500/20 mb-4">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to MediFlow</h1>
          <p className="text-slate-400">Sign in to see your appointments and care information.</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="grid grid-cols-4 gap-2 mb-8">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMethodChange(m.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                  method === m.id
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <m.icon className="w-5 h-5" />
                {m.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-300 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-300 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {!firebaseEnabled && method !== "hospitalId" && (
            <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
              Demo access is available while Firebase is not set up.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "hospitalId" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hospital ID
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    placeholder="e.g., HOSP-2024-001"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Try: HOSP-2024-001 (Patient), HOSP-DOC-001 (Doctor), HOSP-ADM-001 (Admin)
                </p>
              </div>
            )}

            {method === "phone" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                </div>
                {showOtp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Verification code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-center tracking-[0.5em] text-lg"
                    />
                  </motion.div>
                )}
              </>
            )}

            {(method === "google" || method === "facebook") && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use: john.anderson@email.com, sarah.mitchell@mediflow.com, or admin@mediflow.com
                </p>
              </div>
            )}

            {method === "hospitalId" && showOtp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hospital verification code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all text-center tracking-[0.5em] text-lg"
                />
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-rose-500 hover:from-blue-700 hover:to-rose-600 text-white py-3 rounded-xl font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {method === "phone" && !showOtp
                    ? "Send code"
                    : method === "hospitalId" && !showOtp
                      ? "Send code"
                      : "Sign in"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-slate-400 mb-4">Quick access</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin("patient")}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs"
              >
                <User className="w-4 h-4" />
                Patient
              </button>
              <button
                onClick={() => handleDemoLogin("doctor")}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs"
              >
                <Stethoscope className="w-4 h-4" />
                Doctor
              </button>
              <button
                onClick={() => handleDemoLogin("receptionist")}
                disabled={isLoading}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
