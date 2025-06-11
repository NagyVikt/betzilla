"use client";

import React, { useState } from "react";

// --- Helper Components (to remove dependencies) ---

// A simple SVG loader component for the container
const Loader = () => (
  <svg
    className="animate-spin h-8 w-8 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Loader for the sign-in button
const Loader2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const Eye = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const EyeOff = ({ className }: { className?: string }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
);

// A simple Logo component
const Logo = ({ className = "" }: { className?: string; }) => {
  return <h1 className={`text-2xl font-bold ${className}`}>Cal.com</h1>;
};

// --- Mock Supabase Client ---
const supabaseBrowser = {
  auth: {
    signInWithPassword: async ({ email, password }: any) => {
      console.log("Signing in with:", email, password);
      // Simulate login logic
      if (password === "password" && email) {
        return { error: null };
      }
      return { error: { message: "Invalid credentials" } };
    },
    signInWithOAuth: async (options: any) => {
      console.log("Signing in with OAuth:", options);
      alert("This would redirect to Google for OAuth...");
    },
  },
};

// --- Auth Container Component ---
interface AuthContainerProps {
  footerText?: React.ReactNode;
  showLogo?: boolean;
  heading?: string;
  loading?: boolean;
}

function AuthContainer({
  children,
  footerText,
  showLogo = false,
  heading,
  loading = false,
}: React.PropsWithChildren<AuthContainerProps>) {
  return (
    <div className="bg-[#111] flex min-h-screen flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <div className="relative mx-auto w-full max-w-sm">


        {/* Card */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 rounded-lg">
              <Loader />
            </div>
          )}

          <div className="bg-[#111111] rounded-lg px-6 py-8">
            {children}
          </div>
        </div>
        
        {footerText && (
          <p className="mt-8 text-center text-sm text-gray-400">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
}


// --- Main Login Page Component ---
export default function LoginPage() {
  const [email, setEmail] = useState("nagy.viktordp@gmail.com");
  const [password, setPassword] = useState("••••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(async () => {
        await supabaseBrowser.auth.signInWithPassword({ email, password });
        setLoading(false);
        // In a real app, you would handle the response, errors, and redirection.
    }, 1000);
  };
  
  const baseInputClasses = "appearance-none transition-colors duration-300 relative block w-full px-3 py-3 border placeholder-gray-500 rounded-md focus:outline-none text-sm";
  const emailInputClass = `${baseInputClasses} ${email ? 'bg-[#36352c] border-[#8a8021] text-[#e8e6d3]' : 'bg-[#1c1c1c] border-gray-700 text-white focus:border-gray-500'}`;
  const passwordInputClass = `${baseInputClasses} ${password ? 'bg-[#36352c] border-[#8a8021] text-[#e8e6d3]' : 'bg-[#1c1c1c] border-gray-700 text-white focus:border-gray-500'}`;


  return (
    <AuthContainer
      showLogo
      heading="Welcome back"
      loading={loading}
      footerText={
        <>
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-gray-400 hover:text-white">
            Sign up
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
            <div>
                <label htmlFor="email-address" className="text-xs font-medium text-gray-400">Email address</label>
                <div className="relative mt-1">
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={emailInputClass}
                    />
                </div>
            </div>
            <div>
                 <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-medium text-gray-400">Password</label>
                    <a href="/forgot-password" className="text-xs font-medium text-gray-400 hover:text-white">
                        Forgot?
                    </a>
                 </div>
                 <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={passwordInputClass}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-300">
                             <span className="sr-only">Show/hide password</span>
                             {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                         </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-2">
            <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#2b2b2b] hover:bg-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading && <Loader2 className="animate-spin h-5 w-5 mr-3" />}
                Sign in
            </button>
        </div>
      </form>
    </AuthContainer>
  );
}
