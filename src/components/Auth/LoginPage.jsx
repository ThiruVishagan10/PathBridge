"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submit:", { email, password });
    // TODO: integrate NextAuth or API call
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Auth Card */}
      <div className="relative z-20 flex items-center justify-center h-full">
        <div className="bg-black/20 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-white/10">
          <h1 className="text-2xl font-bold text-white">
            {activeTab === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {activeTab === "signin"
              ? "Sign in to continue or create your account"
              : "Join us today and start your journey"
            }
          </p>

          {/* Tabs */}
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === "signin"
                ? "bg-gray-800 text-white"
                : "bg-transparent text-gray-400 hover:text-white"
                }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium ${activeTab === "signup"
                ? "bg-gray-800 text-white"
                : "bg-transparent text-gray-400 hover:text-white"
                }`}
            >
              Create account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <div>
                <label className="text-gray-300 text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {activeTab === "signin" && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <label className="flex items-center text-gray-400">
                    <input type="checkbox" className="mr-2" />
                    Remember me
                  </label>
                  <a href="#" className="text-indigo-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}
            </div>

            {activeTab === "signup" && (
              <div>
                <label className="text-gray-300 text-sm">Confirm Password</label>
                <input
                  type="password"
                  placeholder="********"
                  className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full font-semibold py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            >
              {activeTab === "signin" ? "Sign in" : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700" />
            <span className="px-3 text-gray-400 text-xs">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-gray-700" />
          </div>

          {/* Social buttons */}
          <div className="flex flex-col gap-3">
            <Button className="flex-1 text-white bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:bg-gray-700/50 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button className="flex-1 text-white bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:bg-gray-700/50 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
