const bcrypt = require("bcrypt")
const users = require("../models/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User,already Exists",
            });
        }

        //secure the password

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error in hasing Password',
            })
        }

        // create entry for user
        const newUser = await users.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'user Created Successfully',
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'user are not able to login'
        })

    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill the input",
            })
        }
        let existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "user are not valid"
            })
        }
        const payload = {
            email: existingUser.email,
            password: existingUser.password,
            id:existingUser.id,
            // id:_id,
            role: existingUser.role
        }
        if (await bcrypt.compare(password, existingUser.password)) {

            let token = await jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            existingUser = existingUser.toObject();
            existingUser.token = token;
            // await existingUser.save();
            existingUser.password = undefined;
            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httponly: true,


            }
            res.cookie("token", existingUser, option).status(200).json({
                success: true,
                token,
                existingUser,
                message: "user login succcessfull"

            })



        } else {
            return res.status(403).json({
                success: false,
                message: "password are not correct",
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure"
        });
    }
}
