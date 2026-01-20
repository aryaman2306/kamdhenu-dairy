import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { CowLogo } from "../components/layout/CowLogo";
import { supabase } from "../../supabaseClient";

export function SignupPage({ onSwitchToLogin, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          phone: formData.phone,
          role: "customer",
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 lotus-pattern py-12 px-4">
      {/* Back to Home */}
      {onClose && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClose}
          className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-amber-200 hover:text-amber-600"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm font-semibold">Back to Home</span>
        </motion.button>
      )}

      {/* Mandala Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 opacity-5 mandala-border rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-40 h-40 opacity-5 mandala-border rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 px-8 py-10 text-center relative">
            <div className="absolute inset-0 mandala-border opacity-10" />
            <div className="relative">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <CowLogo />
                  <div className="absolute inset-0 divine-glow rounded-full -z-10" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white">
                Join Kamdhenu Family
              </h1>
              <p className="text-amber-100 text-sm">
                Sacred Dairy Blessings Await
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            <div className="flex justify-center gap-2 mb-6 bg-amber-50 text-amber-800 px-4 py-2 rounded-full border-2 border-amber-200">
              <Sparkles className="size-4" />
              <span className="text-sm font-semibold">
                Create Your Account
              </span>
            </div>

            {error && (
              <p className="text-center text-sm text-red-600 mb-4">
                {error}
              </p>
            )}

            {success ? (
              <p className="text-center text-green-700 font-semibold">
                Signup successful!  
                <br />
                Please check your email to verify your account.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  icon={<Mail className="size-5 text-amber-600" />}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  label="Phone Number"
                  icon={<Phone className="size-5 text-amber-600" />}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                      <Lock className="size-5 text-amber-600" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 inset-y-0"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:scale-[1.02]"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full border-2 border-amber-600 text-amber-600 py-4 rounded-xl font-semibold hover:bg-amber-50"
                >
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-amber-800 italic">"गावो विश्वस्य मातरः"</p>
          <p className="text-sm text-gray-600">
            Cows are the mothers of the universe
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
          {icon}
        </div>
        <input
          {...props}
          required
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
        />
      </div>
    </div>
  );
}
