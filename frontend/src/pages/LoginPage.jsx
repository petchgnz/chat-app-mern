import { useState } from "react";
import { Link } from 'react-router-dom'
import { useAuthStore } from "../store/useAuthStore.js";
import { MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthImagePattern from "../components/AuthImagePattern.jsx";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLogginIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Top */}
          <div className="mb-8 text-center">
            <div className="group flex flex-col items-center gap-2">
              <div className="bg-primary/10 group-hover:bg-primary/20 flex size-12 items-center justify-center rounded-xl transition-colors">
                <MessageSquare className="text-primary size-6" />
              </div>
              <h1 className="mt-2 text-2xl font-bold">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Mail className="text-base-content/40 size-5" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 focus:outline-none`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label mb-2">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                  <Lock className="text-base-content/40 size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 focus:outline-none`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-base-content/40 size-5" />
                  ) : (
                    <Eye className="text-base-content/40 size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLogginIn}
            >
              {isLogginIn ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content">
              Don't have an account? {" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}

      <AuthImagePattern
        title="Welcome back"
        subtitle="Sign in to continue your conversations and catch up with your message"
      />
    </div>
  );
};

export default LoginPage;