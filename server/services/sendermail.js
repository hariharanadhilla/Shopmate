const nodeMailer = require('nodemailer');
require('dotenv').config();
// const transporter = nodeMailer.createTransport({
//     host: process.env.MAIL_SERVER,
//     port: Number(process.env.MAIL_PORT),
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD
//     }
// });
console.log("MAIL_USERNAME:", process.env.MAIL_USERNAME);
console.log("MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "Loaded" : "Missing");
console.log("MAIL_SERVER:", process.env.MAIL_SERVER);
console.log("MAIL_PORT:", process.env.MAIL_PORT);
const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_SERVICE,
    port: (process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }
});

// const sendVerificationEmail = async (email ,name,token) => {
//     const verificationLink = `http://localhost:3001/api/users/verify-email/${token}`;
//     await transporter.sendMail({
//         from:`"ShopMate" <${process.env.MAIL_USERNAME}>`,
//         to: email,
//         subject: 'Email Verification',
//         html: `<p>Hello ${name},</p>
//                <p>Please verify your email by clicking the link below:</p>
//                <a href="${verificationLink}">Verify Email</a>`
//     });
// }
const sendVerificationEmail = async (email, name, token) => {
    try {
        console.log("Sending verification mail to:", email);

        const verificationLink =
            `${SERVER_URL}/api/users/verify-email/${token}`;

        const info = await transporter.sendMail({
            from: `"ShopMate" <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: "Email Verification",
            html: `
                <p>Hello ${name},</p>
                <p>Please verify your email:</p>
                <a href="${verificationLink}">Verify Email</a>
            `,
        });

        console.log("Mail sent:", info.messageId);
    } catch (err) {
        console.error("Mail Error:", err);
        throw err;
    }
};
const sendEmail= async({to,subject,text,html})=>{
    await transporter.sendMail({
        from:`"ShopMate" <${process.env.MAIL_USERNAME}>`,
        to,
        subject,
        text,
        html
    });
}

module.exports = {
    sendVerificationEmail,
    sendEmail
}