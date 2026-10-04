import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpInput from "@/components/auth/OtpInput";
import { setSession } from "@/lib/auth";
import { login as loginApi, sendLoginOtp, verifyLoginOtp } from "@/lib/authService";

function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [mode, setMode] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("emp@nexus.com");
  const [password, setPassword] = useState("emp123456");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  const roleCredentials = {
    employee: { email: "emp@nexus.com", password: "emp123456" },
    hr: { email: "hr@nexus.com", password: "hr123456" },
    admin: { email: "admin@nexus.com", password: "admin123" },
  };

  const selectRole = (r) => {
    setRole(r);
    setEmail(roleCredentials[r].email);
    setPassword(roleCredentials[r].password);
    setEmailError("");
  };

  const switchMode = (m) => {
    setMode(m);
    setOtp("");
    setOtpSent(false);
    setEmailError("");
  };

  const handleSendOtp = async () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setIsSubmitting(true);
    try {
      const res = await sendLoginOtp(email.trim());
      const devOtp = res.data?.devOtp;
      if (devOtp) {
        toast.success(`Code sent! Your OTP is: ${devOtp}`);
        setOtp(devOtp);
      } else {
        toast.success("Code sent to your email");
      }
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await verifyLoginOtp(email.trim(), otp);
      const { user, token } = res.data;
      setSession(user, token);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : user.role === "hr" ? "/hr" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Incorrect code, try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    if (!password || password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginApi(email.trim(), password);
      const { user, token } = res.data;
      setSession(user, token);
      toast.success(`Welcome, ${user.name}!`);
      navigate(user.role === "admin" ? "/admin" : user.role === "hr" ? "/hr" : "/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 500
          ? "Server error occurred. Please try again later."
          : "Invalid email or password");
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-semibold tracking-tight">Sign in</h2>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back to Nexus Technologies</p>

      <div className="mt-6 rounded-xl bg-surface p-1 grid grid-cols-3 text-sm">
        {["employee", "hr", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => selectRole(r)}
            className={`rounded-lg py-2 capitalize transition ${role === r ? "bg-surface-elevated text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            {r === "hr" ? "HR" : r}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-6 border-b border-border text-sm">
        {["password", "otp"].map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`pb-2 -mb-px border-b-2 uppercase tracking-wide text-xs font-medium ${mode === m ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === "password" ? (
        <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="mt-1 relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
            </div>
            {emailError && <p className="mt-1 text-xs text-destructive">{emailError}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="mt-1 relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg bg-input border border-border pl-9 pr-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="mt-1 relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={otpSent}
                className="w-full rounded-lg bg-input border border-border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 disabled:opacity-60"
              />
            </div>
            {emailError && <p className="mt-1 text-xs text-destructive">{emailError}</p>}
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send code"}
            </button>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground block text-center mb-2">One-time code</label>
                <OtpInput value={otp} onChange={setOtp} />
                <div className="text-center">
                  <button type="button" onClick={handleSendOtp} className="mt-3 text-xs text-primary hover:underline">
                    Resend code
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
                className="w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Sign in"}
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-4 text-center text-xs text-muted-foreground">
        New to Nexus?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Create an account
        </Link>
      </div>

      <div className="mt-2 text-center text-xs text-muted-foreground">
        Need help?{" "}
        <button type="button" onClick={() => setShowSupportModal(true)} className="text-primary hover:underline">
          Contact support
        </button>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-surface-elevated p-6 shadow-glow relative">
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold">Need Help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Can't sign in? Reach out to our support team.</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground">📧 support@nexustech.io</p>
              <p className="text-muted-foreground">📞 +91-XXXXXXXXXX</p>
            </div>
            <button
              type="button"
              onClick={() => setShowSupportModal(false)}
              className="mt-5 w-full rounded-lg bg-gradient-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default Login;