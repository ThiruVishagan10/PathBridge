"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/actions/auth.action";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [role, setRole] = useState<"STUDENT" | "ALUMNI">("STUDENT");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = activeTab === "signin" 
        ? await signIn(formData)
        : await signUp(formData);
        
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success('Signed in successfully!');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => console.error('Video error:', e)}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

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
                  name="name"
                  placeholder="John Doe"
                  className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-gray-300 text-sm">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
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
              <>
                <div>
                  <label className="text-gray-300 text-sm">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    placeholder="College/Institution Name"
                    className="w-full mt-1 p-3 rounded-md bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none border border-white/10"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm">Role</label>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setRole("STUDENT")}
                      className={`flex-1 py-2 rounded-md text-sm font-medium ${role === "STUDENT"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white"
                        }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("ALUMNI")}
                      className={`flex-1 py-2 rounded-md text-sm font-medium ${role === "ALUMNI"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:text-white"
                        }`}
                    >
                      Alumni
                    </button>
                  </div>
                  <input type="hidden" name="role" value={role} />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-semibold py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            >
              {isLoading 
                ? (activeTab === "signin" ? "Signing in..." : "Creating Account...")
                : (activeTab === "signin" ? "Sign in" : "Create Account")
              }
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}