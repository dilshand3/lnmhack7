"use client";
import React, { useState, useEffect } from 'react';
import useAuth from '@/store/useAuth';
import Auth from '../Authentication/Auth';
import "./Qr.css";

const Qr = () => {
    const { checkAuth, createQr,logout } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [name, setname] = useState("");
    const [mfgDate, setmfgDate] = useState("");
    const [expDate, setexpDate] = useState("");
    const [price, setprice] = useState("");
    const [qrImageUrl, setQrImageUrl] = useState("");

    useEffect(() => {
        const checkUserAuth = async () => {
            const result = await checkAuth();
            if (result.success) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };
        checkUserAuth();
    }, [checkAuth]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await createQr(name, mfgDate, expDate, price);
        if (result && result.data && result.data) {
            setQrImageUrl(result.data);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="qrContainer">
                <Auth />
            </div>
        );
    }
    const handleLogout = async () => {
        const result = await logout();
        if (result.success) {
            setIsAuthenticated(false);
        }
    };

    return (
        <div className="qrContainer">
            <form className='form-container' onSubmit={handleSubmit}>
                <div className="input-label">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                </div>
                <div className="input-label">
                    <label>Manufacturing Date</label>
                    <input
                        type="date"
                        value={mfgDate}
                        onChange={(e) => setmfgDate(e.target.value)}
                    />
                </div>
                <div className="input-label">
                    <label>Expiry Date</label>
                    <input
                        type="date"
                        value={expDate}
                        onChange={(e) => setexpDate(e.target.value)}
                    />
                </div>
                <div className="input-label">
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                    />
                </div>
                <div className="button">
                    <button type="submit" className="qr-button">
                        Generate QR Code
                    </button>
                    <button className='qr-button' onClick={() => handleLogout()}>LogOut</button>
                </div>
            </form>

            {qrImageUrl && (
                <div className="qr-image-container">
                    <h3>Generated QR Code:</h3>
                    <img src={qrImageUrl} alt="Generated QR Code" className="qr-image" />
                    <br />
                    <a href={qrImageUrl} target="_blank" rel="noopener noreferrer">
                        <button className="qr-view-button">View QR Code in New Window</button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default Qr;
