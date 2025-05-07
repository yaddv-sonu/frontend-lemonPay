"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignupData {
    email: string;
    password: string;
    name: string;
}

export default function Signup() {
    const [signupData, setSignupData] = useState<SignupData>({
        email: "",
        password: "",
        name: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSignupData({ ...signupData, [id]: value });
    };

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (signupData.password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("https://backend-2-cidd.onrender.com/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Failed to register");
                
            } else {
                setSuccess("Registration successful!");
                setSignupData({ name: "", email: "", password: "" });
                setConfirmPassword("");
                router.push("/login");
            }
        } catch (err: any) {
            setError("Network error or server not reachable.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div
            className="h-screen flex flex-col justify-center relative overflow-hidden p-4 md:p-20"
            style={{
                background:
                    "linear-gradient(135deg, #ffffff 0%, #dbe3fc 15%, #8eaefc 40%, #5d73db 70%, #3f2f94 100%)",
            }}
        >
            {/* Background Circles */}
            <div className="absolute right-[-60px] top-[200px] w-[220px] h-[220px] md:right-[-80px] md:top-[-80px] md:w-[200px] md:h-[200px] bg-[#e0d2f7] rounded-full opacity-60 z-0" />
            <div className="absolute left-[-80px] bottom-[60px] w-[200px] h-[180px] md:left-[-110px] md:bottom-[-100px] md:w-[230px] md:h-[230px] bg-[#b3c6f7] rounded-full opacity-60 z-0" />
            <div className="hidden md:block absolute left-[650px] -translate-x-1/2 bottom-[-110px] w-[240px] h-[240px] bg-[#e0d2f7] rounded-full opacity-30 z-0" />

            <div className="flex flex-col items-center md:items-start w-full">
                <img src="/logo.svg" alt="Lemonpay Logo" className="h-16 w-auto mb-2" />
            </div>

            <div className="w-full flex flex-col gap-[120px] md:flex-row items-center md:justify-between mx-auto z-10">
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start mb-8 md:mb-0">
                    <div className="hidden md:block mt-16">
                        <div className="text-4xl font-semibold text-white">Join 8 Million Businesses</div>
                        <div className="text-4xl font-semibold text-[#f7c948]">Powering Growth with</div>
                        <div className="text-4xl font-semibold text-white">Lemonpay!</div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center p-0 md:p-12">
                    <div className="w-full max-w-md mx-auto bg-transparent">
                        <h2 className="text-2xl md:text-[28px] font-bold text-white mb-2 text-center md:text-left">
                            Welcome Sign Up System
                        </h2>
                        <p className="text-white/80 mb-6 text-base text-center md:text-left">
                            Your gateway to seamless transactions and easy payments.
                        </p>

                        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
                        {success && <p className="text-green-400 mb-2 text-sm">{success}</p>}

                        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                            <div>
                                <label htmlFor="name" className="block text-white/90 mb-1 text-base">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="enter your name"
                                    value={signupData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#f7c948]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-white/90 mb-1 text-base">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="enter your email"
                                    value={signupData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#f7c948]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-white/90 mb-1 text-base">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="enter your password"
                                    value={signupData.password}
                                    onChange={handleChange}
                                    minLength={8}
                                    className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#f7c948]"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-white/90 mb-1 text-base">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={8}
                                    className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#f7c948]"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <label className="flex items-center text-white/80 text-base">
                                    <input type="checkbox" className="mr-2 accent-white" /> Remember me
                                </label>
                                <a href="/login" className="text-white/80 text-base hover:underline">Sign In</a>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full bg-white text-black font-semibold py-2 rounded text-base hover:bg-[#f7c948] hover:text-white transition-colors"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
