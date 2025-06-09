require("dotenv").config();
const Router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const OtpModel = require("../models/emailOtpVerification")
const { verifyAccessToken } = require("../middlewares/authentication")
const { sendMail } = require("../helper")

Router.post("/signup", async (req, res) => {
    try {
        console.log("Signup request body:", req.body);
        const { name, email, password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(422).json({
                message: "All fields are required",
                error: "Validation error",
                data: null
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({
                message: "User with this email already exists",
                error: "Duplicate email",
                data: null
            });
        }

        const newUser = new User({
            name,
            email,
            password,
            role
        });

        // Password hashing handled by userSchema pre-save hook

        const doc = await newUser.save();

        delete doc._doc.password
        return res.status(201).json({
            message: "signup successful",
            error: null,
            data: doc
        })
    } catch (error) {
        return res.status(422).json({
            message: "signup failed",
            error: error.message || error,
            data: null
        })
    }
})

Router.post("/login", (req, res) => {
    //testing
    console.log("JWT SECRET:", process.env.SECRET);

    const { email, password, role } = req.body
    console.log("Login request received with email:", email, "role:", role);  // Added log

    return User.findOne({ email })
    .then(doc => {
        if (!doc) {
            throw "user not found"
        }

        if (doc.role !== role) {
            throw "role mismatch"
        }

        return bcrypt.compare(password, doc.password)
        .then(isCompared => {
            if (!isCompared) {
                throw "invalid password"
            }

            const payload = {
                email: doc.email,
                role: doc.role
            }

            const token = jwt.sign(payload, process.env.SECRET, {
                expiresIn: '1h'
            })

            delete doc._doc.password

            return res.status(200).json({
                message: "login successful",
                error: null,
                data: {
                    ...doc._doc,
                    accessToken: token,
                    verifiedEmail: doc.verifiedEmail || false
                }
            })
        })
    })
    .catch(error => {
        console.log(" error: ", error)

        let message = "login failed";
        if (error === "role mismatch") {
            message = "Login failed: Role does not match";
        } else if (error === "user not found") {
            message = "Login failed: User not found";
        } else if (error === "invalid password") {
            message = "Login failed: Invalid password";
        }

        return res.status(403).json({
            message: message,
            error: error,
            data: null
        })
    })
})

Router.post("/logout", verifyAccessToken, (req, res) => {
    try {
        // TODO: write logout logic 

        return res.status(200).json({
            message: "logout successful",
            error: null,
            data: null
        })
      
    } catch (error) {
        return res.status(403).json({
            message: "logout failed",
            error: error,
            data: null
        })
    }
    
})

Router.get("/email-verify/request", verifyAccessToken, (req, res) => {

    console.log("Received email verify request for:", req.userEmail);

    return User.findOne({ email: req.userEmail, role: req.userRole })
    .then(doc => {
        if(doc.verifiedEmail) {
            throw "email already verified"
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000); // always 6-digit OTP

        return OtpModel.findOneAndUpdate({ email: req.userEmail }, { otp: newOtp }, { new: true, upsert: true })
    })
    .then(otpDoc => {
        console.log("Generated OTP:", otpDoc.otp);

        const emailHtml = `
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #007bff; text-align: center;">Medico | OTP for Email Verification</h2>
                <p>Dear User,</p>
                <p>Thank you for registering with Medico. Please use the following one-time password (OTP) to verify your email address:</p>
                <div style="font-size: 28px; font-weight: bold; background-color: #007bff; color: white; padding: 15px 20px; text-align: center; border-radius: 8px; width: fit-content; margin: 20px auto;">
                    ${otpDoc.otp}
                </div>
                <p style="font-size: 14px; color: #555;">This OTP is valid for 10 minutes. Please do not share this OTP with anyone.</p>
                <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
                <p>Best regards,<br/>The Medico Team</p>
            </body>
            </html>
        `;

        return sendMail(
            req.userEmail,
            "Medico: OTP for email verification",
            null,
            emailHtml
        )
    })
    .then(() => {
        console.log("OTP email sent successfully to:", req.userEmail);
        return res.status(200).json({
            message: "verification request sent successful",
            error: null,
            data: null
        })
    })
    .catch(error => {
        console.log("error: ", error)
        return res.status(403).json({
            message: "verification request failed",
            error: error,
            data: null
        })
    })
})

Router.post("/email-verify/submit", verifyAccessToken, (req, res) => {
    console.log("OTP submit request body:", req.body);
    return User.findOne({ email: req.userEmail, role: req.userRole })
    .then(doc => {
        if(doc.verifiedEmail) {
            throw "email already verified"
        }

        return OtpModel.findOne({ email: req.userEmail })
    })
    .then(otpDoc => {

        if(!otpDoc || otpDoc.otp !== req.body.otp) {
            throw "invalid otp"
        }

        return User.findOneAndUpdate({ email: req.userEmail, role: req.userRole }, { verifiedEmail: true }, { new: true })
    })
    .then(userDoc => {
        delete userDoc._doc.password

        return res.status(200).json({
            message: "verification successful",
            error: null,
            data: userDoc
         })
    })
    .catch(error => {
        console.log("error: ", error)
        return res.status(403).json({
            message: "verification failed",
            error: error,
            data: null
         })
    })
})

module.exports = Router
