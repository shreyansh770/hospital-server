const express = require('express');
const jwt = require('jsonwebtoken');
const medicalModel = require('../model/medicalModel');
const otpGenerator = require('otp-generator')
const {
    JWT_KEY
} = process.env || require('../secrets');
const sendMail = require('../helper/sendMail');

const authRouter = express.Router();

authRouter.route("/signUp").post(signUp)
authRouter.route("/signIn").post(signIn)
authRouter.route("/forgetPassword").post(forgetPassword)
authRouter.route("/changePass").post(verifyOtp, passChange)
authRouter.route("/signOut").get(signOut)


async function signUp(req, res) {
    try {

        let userObj = req.body;
        console.log(userObj);
        let user = await medicalModel.create(userObj);

        let payload = user.email;

        const token = jwt.sign({
            id: payload
        }, JWT_KEY)

        // res.cookie('login', token, {
        //     httpOnly: true
        // })

        res.json({
            message: "User Signed up",
            user: user,
            token: token
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }
}

async function signIn(req, res) {
    try {

        let userObj = req.body;

        // console.log(userObj);

        let user = await medicalModel.findOne({
            email: userObj.email
        })

        // console.log(process.env);
        if (user.password == userObj.password) {

            let payload = user.email;

            const token = jwt.sign({
                id: payload
            }, JWT_KEY)

            
            // in case with frontend we will send token from backend
            // as res.json and frontend will store it in req.headers.authorization
            // and access the same way in backend

            // res.cookie('login', token, {
            //     httpOnly: true
            // })

            res.json({
                message: "User logged in",
                user: user,
                token: token
            })
        }else{
            res.json({
                message: "Incorrect email or password",
                user: user,
            }) 
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

async function signOut(req, res) {
    try {

        if (req.cookie.login) {
            res.clearCookie('login');
            res.send("User logged out")
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

async function forgetPassword(req, res) {

    try {

        let userEmail = req.body

        let user = await medicalModel.findOne({
            email: userEmail.email
        })

        if (user == null) {
            res.json({
                message: "Please enter a valid email id"
            })
        }

        // generating OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false
        });

        let otpUpdate = await medicalModel.findOneAndUpdate({
            email: userEmail.email
        }, {
            otp: otp
        }, {
            new: true
        })

        // send otp to mail
        sendMail(undefined, userEmail.email, otp)

        res.json({
            otpUpdate
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

async function verifyOtp(req, res, next) {
    try {

        let userOtp = req.body.otp;

        let findUser = await medicalModel.findOne({
            otp: userOtp
        });

        if (findUser == null) {
            res.json({
                message: "Sorry your OTP did'nt match"
            })
        }

        // undefing the otp field

        req.id = findUser.email;
        next();


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


async function passChange(req, res) {
    try {

        let {
            id
        } = req;

        let userToUpdate = await medicalModel.findOne({
            email: id
        });

        // updating password

        let {
            password,
            confirmPassword
        } = req.body


        if (password === confirmPassword) {
            let user = await medicalModel.findOneAndUpdate({
                email: id
            }, {
                password: password,
                opt : undefined
            }, {
                new: true
            });
            res.json({
                user
            })

        } else {
            res.json({
                message: "passwords dont match"
            })
        }


    } catch (error) {
        console.log("hello");
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = authRouter;