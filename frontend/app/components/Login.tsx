"use client"
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-zinc-400">Sign in to your account</p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={async () => {
                                const token = await axios.post(`${BACKEND_URL}/user/login`, {
                                    email: email,
                                    password: password
                                });
                                localStorage.setItem('token', token.data.token);
                                router.push('/dashboard');
                            }}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-orange-500/50"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-zinc-400">
                            Don't have an account?{" "}
                            <span
                                onClick={() => {
                                    router.push("/signup");
                                }}
                                className="text-orange-500 hover:text-orange-400 font-semibold cursor-pointer transition-colors"
                            >
                                Sign up
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}