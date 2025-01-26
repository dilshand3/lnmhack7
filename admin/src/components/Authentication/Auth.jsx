"use client";
import React, { useState } from 'react';
import useAuth from '@/store/useAuth';
import "./Auth.css";

const Auth = () => {
    const { signup, login, getUser } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setfullName] = useState("");
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let result;
        if (isLogin) {
            result = await login(email, password);
            if (result.success) {
                window.location.reload(); // Refresh the page if login is successful
            }
        } else {
            result = await signup(fullName, username, email, password);
            if (result.success) {
                window.location.reload(); // Refresh the page if signup is successful
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                    <>
                        <div className="input-label">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setfullName(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="input-label">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </>
                )}
                <div className="input-label">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="input-label" style={{ position: "relative" }}>
                    <label>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        className="input-field"
                    />
                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </span>
                </div>
                <button type="submit" className="auth-button">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <p className="auth-toggle">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <span onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Sign Up" : "Login"}
                </span>
            </p>
        </div>
    );
};

export default Auth;
