"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src="/nirmanlogo.png" alt="Net Nirman" className="w-10 h-10" />
            <span className="font-black text-2xl font-space">Net Nirman</span>
          </div>
          <h1 className="text-2xl font-black font-space">Admin Login</h1>
        </div>

        <form
          onSubmit={handleLogin}
          className="border-2 border-black shadow-brutal bg-white p-8 space-y-5"
          style={{ borderRadius: "2px" }}
        >
          {error && (
            <div className="border-2 border-red bg-red/10 p-3 text-sm font-bold text-red" style={{ borderRadius: "2px" }}>
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="admin@netnirman.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Button>

          <p className="text-xs text-center text-black/50">
            Protected area. Authorized personnel only.
          </p>
        </form>
      </div>
    </div>
  );
}
