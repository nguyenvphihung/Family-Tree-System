import React, { useState } from "react";
import familyBg from "@/assets/family-bg.jpg";
import { Link } from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation (you'll want more robust validation later)
        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            setIsLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Đăng ký thành công! (Demo)");
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100">
            {/* Background image with enhanced overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${familyBg})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200/60 via-yellow-300/40 to-orange-200/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Floating decorative elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-amber-300/20 rounded-full blur-lg animate-bounce" />

            {/* Main Register Container */}
            <div className="relative z-20 w-full max-w-xl mx-4">
                {/* Enhanced Register Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 overflow-hidden">
                    {/* Header Section with Gradient */}
                    <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-orange-300/30" />
                        <div className="relative z-10">
                            {/* Enhanced Logo (reused from Login) */}
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 48 48"
                                            fill="none"
                                            className="text-white"
                                        >
                                            <circle
                                                cx="24"
                                                cy="24"
                                                r="22"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                fill="none"
                                            />
                                            <path
                                                d="M24 10v28M10 24h28M16 16l16 16M16 32l16-16"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                        </svg>
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                Đăng ký tài khoản
                            </h1>
                            <p className="text-yellow-100 text-lg font-medium">
                                Bắt đầu hành trình gia phả của bạn
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* First Name Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Họ
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 bg-gray-50 placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-300"
                                    placeholder="Nhập họ của bạn"
                                />
                            </div>

                            {/* Last Name Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Tên
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 bg-gray-50 placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-300"
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13h9a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 bg-gray-50 placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-300"
                                    placeholder="Nhập email của bạn"
                                />
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 bg-gray-50 placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-300"
                                    placeholder="Tạo mật khẩu"
                                />
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <svg
                                        className="w-5 h-5 text-yellow-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-4 text-lg rounded-xl border-2 border-gray-200 text-gray-700 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 bg-gray-50 placeholder:text-gray-400 transition-all duration-300 hover:border-yellow-300"
                                    placeholder="Nhập lại mật khẩu"
                                />
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-xl py-4 mt-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:transform-none shadow-lg hover:shadow-xl border-2 border-green-300/50 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-emerald-300/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang đăng ký...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                                />
                                            </svg>
                                            Đăng ký
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Link to Login Page */}
                        <div className="mt-6 text-center text-gray-700">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                            >
                                Đăng nhập ngay
                            </Link>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <div className="text-gray-600 font-medium">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <svg
                                        className="w-4 h-4 text-yellow-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    © 2024 Hệ thống Gia Phả
                                </div>
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <svg
                                        className="w-4 h-4 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    Hỗ trợ: 0775 579 380
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;