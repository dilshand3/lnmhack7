import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/cookies.js";

const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All filed req for user registeration" })
        };

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ success: false, message: "User already exist" })
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Something went wrong" })
        }
        res.status(200).json({ success: true, message: "User created succesfully", data: user })
    } catch (error) {
        console.log(`Somthing went wrong due to ${error}`);
        res.status(400).json({
            success: false,
            message: "Something went wrong please check the console"
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "user didn't exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

       const token = await generateTokenAndSetCookie(res, user._id);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
            token
        });
    } catch (error) {
        console.log(`Something went wrong due to ${error}`);
        res.status(400).json({ success: false, message: "something went wrong please check the console" })
    }
}

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User didn't exist" });
        }
        res.status(200).json({
            success: true,
            message: "user found succesfully",
            data: user
        })
    } catch (error) {
        console.log(`Something went wrong due to ${error}`);
        res.status(400).json({ success: false, message: "Something went wrong please check the console" })
    }
}

const logOut = async (req, res) => {
    res.cookie("token", undefined, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export { signUp, login, getUser, logOut }