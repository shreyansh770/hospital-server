const nodemailer = require('nodemailer');
const {
    nodemailer_pass
} = require('../secrets');

module.exports = async function sendMail(appointDetail, patientEmail, otp) {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587, // free protocol
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'shreyanshthakur1@gmail.com', // generated ethereal user
            pass: nodemailer_pass, // generated ethereal password
        },
    });


    if (appointDetail == undefined) {
        let info = await transporter.sendMail({
            from: '"Hospital Help" <shreyanshthakur1@gmail.com>', // sender address
            to: patientEmail,
            subject: "Password reset",
            text: `${otp}`
        });

        // jb email success hota hai to email ki id info me ati hai
        console.log("->", info.messageId)
    } else {
        let info = await transporter.sendMail({
            from: '"Hospital Help" <shreyanshthakur1@gmail.com>', // sender address
            to: patientEmail,
            subject: "You have got an appointment",
            text: `${appointDetail.date}`
        });

        // jb email success hota hai to email ki id info me ati hai
        console.log("->", info.messageId)
    }



}