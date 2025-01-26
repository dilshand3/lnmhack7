import { create } from 'zustand';

const api = "http://localhost:2000";

const useAuth = create((set) => ({
    token: null,
   
    signup: async (fullName, username, email, password) => {
        try {
            const res = await fetch(`${api}/api/admin/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fullName, username, email, password }),
                credentials: "include"
            });
            const data = await res.json();
            console.log(data);
            return data
        } catch (error) {
            console.log(`Something went wrong due to ${error}`);
        }
    },

    login: async (email, password) => {
        try {
            const res = await fetch(`${api}/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });
            const data = await res.json();
            console.log(data);
            return data
        } catch (error) {
            console.log(`Something went wrong due to ${error}`);
        }
    },

    getUser: async () => {
        try {
            const res = await fetch(`${api}/api/admin/getAdmin`, {
                method: "GET",
                credentials: 'include',
            });
            const data = await res.json();
            console.log(data);
            return data; // Return user data if authenticated
        } catch (error) {
            console.log(`Something went wrong ${error}`);
            return null; // If not authenticated, return null
        }
    },

    checkAuth: async () => {
        const userData = await useAuth.getState().getUser(); // Call getUser to check authentication
        if (userData && userData.success) {
            set({ token: userData.token }); // Store token if authenticated
            return { success: true, message: "Authenticated" };
        } else {
            set({ token: null }); // Remove token if not authenticated
            return { success: false, message: "Not authenticated" };
        }
    },

    createQr: async (name,mfgDate,expDate,price) => {
        try {
            const res = await fetch(`${api}/api/qr/createQr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name,mfgDate,expDate,price}),
                credentials : "include"
            });
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(`Something went wrong while creating qr due to ${error}`);
        }
    },
    logout : async () => {
        try {
            const res = await fetch(`${api}/api/admin/logoutAdmin`,{
                method : "GET",
                credentials : "include"
            });
            const data = await res.json();
            console.log(data,"logout hoya")
            return data
        } catch (error) {
            console.log(`Something went wrong due to ${error}`)
        }
    }
}));

export default useAuth;
