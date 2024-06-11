import {hashCompare, hashPassword} from "../../helpers/hashing.helper.js";
import {readFile} from "fs/promises";
import {sendEmail} from "../../helpers/mailer.helper.js";
import Joi from "joi";
import {genSaltSync, hashSync} from "bcrypt";
import {createAdmin, getAdminByEmail, getAdminById} from "../../models/admins.js";

const register = async (request, response) => {
    try {
        const adminData = request.body;
        const requestSchema = Joi.object({
            fullname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        }

        const otp_code = Math.floor(100000 + Math.random() * 800000);
        const values = {
            fullname: adminData.fullname,
            email: adminData.email,
            authentication: {
                password: await hashPassword(adminData.password),
                otp: {
                    code: otp_code,
                    expires: new Date(Date.now() + 1800000) // otp expires in 30 minutes
                }
            },
        }

        await createAdmin(values).then(
            async (createdAdminData) => {
                const htmlFilePath = './emails/verification_email.html';
                const htmlContent = await readFile(htmlFilePath, 'utf8');

                await sendEmail({
                    from: 'info@fileserver.com',
                    to: adminData.email,
                    subject: 'FileServer - Verify Your Account',
                    html: htmlContent.replace("{FULLNAME}", adminData.fullname)
                        .replace("{OTP_CODE}", otp_code.toString())
                });

                return createdAdminData;
            });
        response.status(201).json({message: "Account created successfully"});
    } catch (error) {
        console.error(error);

        if (error.errorResponse?.code === 11000) {
            response.status(409).json({
                error: `The ${Object.keys(error.errorResponse.keyValue)} already exist(s)`
            });
        } else {
            response.status(500).json({error: "Internal Server Error"});
        }
    }
}


const otpVerification = async (request, response) => {
    try {
        const otpData = request.body;

        const requestSchema = Joi.object({
            email: Joi.string().email().required(),
            otp: Joi.any().allow(Joi.string().length(6), Joi.number().max(999999)).required()
        });

        const {error, _} = requestSchema.validate({
            email: otpData.email,
            otp: otpData.otp
        });

        if (error) {
            return response.status(400).json({error: error.details[0].message});
        } else {
            const currentTimestamp = new Date().getTime();
            const admin = await getAdminByEmail(otpData.email);

            if (!admin) {
                return response.status(404).json({error: "Admin not found"});
            } else if (admin.authentication.otp.expires < currentTimestamp) {
                return response.status(410).json({error: "OTP expired"}).end();
            } else if (otpData.otp.toString() !== admin.authentication.otp.code.toString()) {

                return response.status(400).json({error: "Invalid OTP"}).end();
            } else {
                admin.emailVerified = true;
                admin.authentication.otp.code = otpData.otp;
                admin.authentication.otp.expires = new Date(Date.now());
                admin.authentication.session.token = await hashSync(otpData.email + Date.now(), genSaltSync(10));
                admin.authentication.session.expires = new Date(Date.now() + 2592000000) // 30 days
                const updatedAdmin = await admin.save().then((_admin) => getAdminById(_admin.id));

                response.status(200).json({data: updatedAdmin});
            }
        }
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal server error');
    }
}


const generateOTP = async (request, response) => {
    try {
        const otpType = request.otpType
        const requestSchema = Joi.object({
            email: Joi.string().email().required()
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        } else {
            const email = request.body.email;
            const otp_code = Math.floor(100000 + Math.random() * 800000);
            const admin = await getAdminByEmail(email);

            if (!admin) {
                return response.status(404).json({error: "Admin not found"});
            }

            admin.authentication.otp.code = otp_code;
            admin.authentication.otp.expires = new Date(Date.now() + 1800000);

            await admin.save().then(
                async () => {
                    let htmlFilePath = "";
                    let subject = "";

                    switch (otpType) {
                        case "verification":
                            htmlFilePath = './emails/verification_email.html';
                            subject = 'FileServer - Verify Your Account';
                            break;
                        case "password-reset":
                            htmlFilePath = './emails/reset_password_email.html';
                            subject = 'FileServer - Reset Your Password';
                            break;
                        default:
                            console.log("Invalid OTP type: " + otpType);
                            return response.status(500).json({error: "Internal Server Error"});
                    }

                    const htmlContent = await readFile(htmlFilePath, 'utf8');

                    await sendEmail({
                        from: 'info@fileserver.com',
                        to: email,
                        subject: subject,
                        html: htmlContent.replace("{FULLNAME}", admin.fullname)
                            .replace("{OTP_CODE}", otp_code.toString())
                    });
                });

            response.status(200).json({message: "Email sent!"});
        }
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal server error');
    }
}


const resetPassword = async (request, response) => {
    try {
        const requestSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            console.warn(error.details[0].message);
            return response.status(400).json({error: error.details[0].message});
        }

        const adminData = request.body;
        const admin = await getAdminByEmail(adminData.email);

        if (!admin) {
            return response.status(404).json({error: "Admin not found"});
        } else {
            admin.authentication.password = hashSync(adminData.password, genSaltSync(10));
            const updatedAdmin = await admin.save().then((_admin) => getAdminById(_admin.id));
            response.status(200).json({data: updatedAdmin});
        }
    } catch (error) {
        console.error(error);
        response.status(500).send('Internal server error');
    }
}


const login = async (request, response) => {
    try {
        const requestSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });

        const {error, _} = requestSchema.validate(request.body);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        }

        const adminData = request.body;
        const admin = await getAdminByEmail(adminData.email);

        if (admin && hashCompare(adminData.password, admin.authentication.password)) {
            admin.authentication.session.token = await hashSync(adminData.email + Date.now(), genSaltSync(10));
            admin.authentication.session.expires = new Date(Date.now() + 2592000000) // 30 days
            const updatedAdmin = await admin.save();

            response.json({data: updatedAdmin}).status(200);
        } else {
            response.status(401).json({error: 'Invalid credentials'});
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({error: 'Internal server error'});
    }
}

export {
    register,
    login,
    otpVerification,
    generateOTP,
    resetPassword
}