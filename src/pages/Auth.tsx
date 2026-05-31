import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "1 uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "1 lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "1 number", test: (p: string) => /\d/.test(p) },
  { label: "1 special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  // signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.rpc("is_admin", { _email: user.email! });
      if (cancelled) return;
      navigate(data ? "/admin" : "/", { replace: true });
    })();
    return () => { cancelled = true; };
  }, [user, navigate]);

  const passwordChecks = PASSWORD_RULES.map((r) => ({ ...r, ok: r.test(password) }));
  const passwordValid = passwordChecks.every((c) => c.ok);

  

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signin") {
      if (!email.trim() || !password.trim()) {
        toast({ title: "Missing fields", description: "Please enter email and password.", variant: "destructive" });
        return;
      }
      setLoading(true);
      const { error } = await signInWithEmail(email.trim(), password);
      if (error) toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // signup validation
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !gender || !phone.trim() || !email.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
      toast({ title: "Invalid username", description: "3-20 chars, letters/numbers/underscore only.", variant: "destructive" });
      return;
    }
    if (!passwordValid) {
      toast({ title: "Weak password", description: "Password does not meet all requirements.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please confirm your password.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // username uniqueness pre-check
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", username.trim())
      .maybeSingle();
    if (existing) {
      toast({ title: "Username taken", description: "Please choose a different username.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const { error } = await signUpWithEmail(email.trim(), password, fullName, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim(),
      gender,
      phone: phone.trim(),
    });

    if (error) {
      toast({ title: "Sign-up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account before signing in." });
      setMode("signin");
      setPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 min-h-[85vh] flex items-center bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0 overflow-hidden rounded-sm border border-border shadow-lg">
            {/* Left: Branding */}
            <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent blur-3xl" />
              </div>
              <div className="relative z-10">
                <Link to="/" className="inline-block mb-12">
                  <span className="font-heading text-3xl font-bold tracking-wider">Vitoré</span>
                </Link>
                <h2 className="font-heading text-4xl font-bold leading-tight mb-4">
                  {mode === "signin" ? "Welcome Back." : "Join Us."}
                </h2>
                <p className="font-body text-sm opacity-70 leading-relaxed max-w-xs">
                  {mode === "signin"
                    ? "Sign in to access your orders, wishlist, and exclusive member benefits."
                    : "Create an account to enjoy exclusive benefits, track orders, and build your wishlist."}
                </p>
              </div>
              <div className="relative z-10 mt-8">
                <div className="w-16 h-px bg-accent mb-4" />
                <p className="font-body text-xs opacity-50 italic">
                  "Elegance is not about being noticed, it's about being remembered."
                </p>
              </div>
            </div>

            {/* Right: Auth */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 md:p-12 bg-card flex flex-col justify-center"
            >
              <div className="md:hidden mb-8 text-center">
                <Link to="/" className="inline-block mb-4">
                  <span className="font-heading text-2xl font-bold tracking-wider text-foreground">Vitoré</span>
                </Link>
              </div>

              <div className="flex border-b border-border mb-8">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className={`flex-1 pb-3 text-sm font-body font-medium uppercase tracking-wider transition-colors ${mode === "signin" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex-1 pb-3 text-sm font-body font-medium uppercase tracking-wider transition-colors ${mode === "signup" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">First Name</label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" className="rounded-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Last Name</label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" className="rounded-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Username</label>
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="jane_doe" className="rounded-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Gender</label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full h-10 px-3 rounded-sm border border-input bg-background text-sm font-body text-foreground"
                        >
                          <option value="">Select</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Phone</label>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 …" className="rounded-sm" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Email</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-sm" />
                </div>

                <div>
                  <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === "signup" ? "Min. 8 chars, A-a-1-!" : "Your password"}
                      className="rounded-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {mode === "signup" && password.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {passwordChecks.map((c) => (
                        <li key={c.label} className="flex items-center gap-1.5 text-xs font-body">
                          {c.ok ? <Check size={12} className="text-green-500" /> : <X size={12} className="text-muted-foreground" />}
                          <span className={c.ok ? "text-foreground" : "text-muted-foreground"}>{c.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="rounded-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && confirmPassword !== password && (
                      <p className="text-xs text-destructive font-body mt-1">Passwords do not match.</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-sm font-body text-sm font-medium uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : mode === "signin" ? "Sign In" : "Create Account"}
                </button>

                {mode === "signin" && (
                  <div className="text-right">
                    <Link to="/forgot-password" className="text-xs text-accent hover:underline font-body">
                      Forgot password?
                    </Link>
                  </div>
                )}
              </form>


              <p className="text-xs text-muted-foreground font-body mt-8 leading-relaxed text-center">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
