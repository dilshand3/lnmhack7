import { Admin } from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/cookies.js";

const signUpAdmin = async (req, res) => {
    const { username, fullName, email, password } = req.body;
    try {
        if (!username || !fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const existedUser = await Admin.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userCount = await Admin.countDocuments();

        let isVerified = userCount === 0 ? true : false;
        let isVerifiedByAdmin = userCount === 0 ? "Verified" : "pending";

        const user = await Admin.create({
            username,
            fullName,
            email,
            password: hashedPassword,
            isVerified,
            isVerifiedByAdmin,
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Something went wrong" });
        }
        await generateTokenAndSetCookie(res, user._id);
        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({success : false,message :"All field required"})
        }
        const user = await Admin.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "user didn't exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        await generateTokenAndSetCookie(res, user._id);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log(`Something went wrong due to ${error}`);
        res.status(400).json({ success: false, message: "something went wrong please check the console" })
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await Admin.findById(userId).select("-password");
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
};

const logOutAdmin = async (req, res) => {
    res.cookie("token", undefined, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export { signUpAdmin, loginAdmin, getUser, logOutAdmin }