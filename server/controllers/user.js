import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// for signup
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // OR Operator iss liye ke agr koi aik bhi nhi hota hai to ye nhi chalai ga.
        if (!fullName || !email || !password) {
            return res.status(400).json({
                // koi error bhi through krtai han to success hamesha false hi rakhtai han.
                success: false,
                message: "All fields are required."
            })
        }
        // finding user ke pehle uss gamil se already register ha ya nhi.
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                // koi error bhi through krtai han to success hamesha false hi rakhtai han.
                success: false,
                message: "This email id is already registered."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10) // 10 ki jagha apni marzi ki value rakh saktai han jeasay je 200,100,50 etc.
        await User.create({
            fullName,
            email,
            password: hashedPassword
        });
        // kioun ke create hua ha to create honai ke liye hum 201 status use krtai han.
        return res.success(201).json({
            success: true,
            message: "Account created successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
// for login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password."
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password.",
            });
        }

        // generate token.
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' }); // 1 day tak expire nahi ho ga.

        return res.status(200).cookie("token", token, { // first wala token name ki jagha use ho rha hai and second wala value ki jagha.
            httpOnly: true,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: `Welcome back ${user.fullName}`,
        })
    } catch (error) {
        console.log(error);
    }
}
// for logout 
export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({ // maxAge 0 is ke abhi expire ho ja jaldi se.
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
    }
}