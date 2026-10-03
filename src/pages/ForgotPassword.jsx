import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { forgotPassword, verifyOtp, resetPassword } from "@/lib/authService";
import OtpInput from "@/components/auth/OtpInput";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOtp = async () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(email.trim());
      const devOtp = res.data?.devOtp;
      if (devOtp) {
        toast.success(`Check your email! Your OTP code is: ${devOtp}`);
        setOtp(devOtp);
      } else {
        toast.success("Check your email for the code");
      }
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await verifyOtp(email.trim(), otp);
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect code, try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await resetPassword(email.trim(), otp, newPassword);
      toast.success("Password updated. Please sign in.");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>

      {step === "email" && (
        <>
          <h2 className="text-3xl font-semibold tracking-tight">Reset your password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send you a verification code.</p>

          <div className="mt-6">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="mt-1 relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
            </div>
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>

          <button
            onClick={handleSendOtp}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send code"}
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-3xl font-semibold tracking-tight">Enter verification code</h2>
          <p className="mt-1 text-sm text-muted-foreground">We sent a 6-digit code to {email}.</p>

          <div className="mt-6">
            <label className="text-xs font-medium text-muted-foreground block text-center mb-2">One-time code</label>
            <OtpInput value={otp} onChange={setOtp} />
            {error && <p className="mt-2 text-xs text-destructive text-center">{error}</p>}
            <div className="text-center">
              <button type="button" onClick={handleSendOtp} className="mt-3 text-xs text-primary hover:underline">
                Resend code
              </button>
            </div>
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify code"}
          </button>
        </>
      )}

      {step === "reset" && (
        <>
          <h2 className="text-3xl font-semibold tracking-tight">Set a new password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a new password for your account.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">New password</label>
              <div className="mt-1 relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Confirm password</label>
              <div className="mt-1 relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                />
              </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <button
            onClick={handleResetPassword}
            disabled={isSubmitting}
            className="mt-6 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;