// app/(auth)/layout.tsx
import React from "react";
import AuthContainer from "@/components/AuthContainer";

export const metadata = {
  title: "Authenticate",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContainer
      showLogo
      heading="Welcome back"
      footerText={
        <>
          Don’t have an account?{" "}
          <a href="/auth/signup" className="underline">
            Sign up
          </a>
        </>
      }
    >
      {children}
    </AuthContainer>
  );
}
