import {hashCompare, hashPassword} from "../../helpers/hashing.helper.js";
import {readFile} from "fs/promises";
import {sendEmail} from "../../helpers/mailer.helper.js";
import Joi from "joi";
import {genSaltSync, hashSync} from "bcrypt";
import {createUser, getUserByEmail, getUserById} from "../../models/users.js";

const register = async (request, response) => {
    try {
        const userData = request.body;
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
            fullname: userData.fullname,
            email: userData.email,
            authentication: {
                password: await hashPassword(userData.password),
                otp: {
                    code: otp_code,
                    expires: new Date(Date.now() + 1800000) // otp expires in 30 minutes
                }
            },
        }

        await createUser(values).then(
            async (createdUserData) => {
                const htmlFilePath = './emails/verification_email.html';
                const htmlContent = await readFile(htmlFilePath, 'utf8');

                await sendEmail({
                    from: 'info@fileserver.com',
                    to: userData.email,
                    subject: 'FileServer - Verify Your Account',
                    html: htmlContent.replace("{FULLNAME}", userData.fullname)
                        .replace("{OTP_CODE}", otp_code.toString())
                });

                return createdUserData;
            });
        response.status(201).json({message: "Account created successfully"});
    } catch (error) {
        console.error("the error: ", error);

        if (error.errorResponse.code === 11000) {
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
            otp: Joi.string().length(6).required()
        });

        const {error, _} = requestSchema.validate({
            email: otpData.email,
            otp: otpData.otp
        });

        if (error) {
            console.log(error.details[0].message);
            return response.status(400).json({error: error.details[0].message});
        } else {
            const currentTimestamp = new Date().getTime();
            const user = await getUserByEmail(otpData.email);

            if (!user) {
                return response.status(404).json({error: "User not found"});
            } else if (user.authentication.otp.expires < currentTimestamp) {
                return response.status(410).json({error: "OTP expired"}).end();
            } else if (otpData.otp !== user.authentication.otp.code.toString()) {

                return response.status(404).json({error: "Invalid OTP"}).end();
            } else {
                user.emailVerified = true;
                user.authentication.otp.code = otpData.otp;
                user.authentication.otp.expires = new Date(Date.now());
                user.authentication.session.token = await hashSync(otpData.email + Date.now(), genSaltSync(10));
                user.authentication.session.expires = new Date(Date.now() + 2592000000) // 30 days
                const updatedUser = await user.save().then((_user) => getUserById(_user.id));

                response.status(200).json({data: updatedUser});
            }
        }
    } catch
        (error) {
        console.error(error);
        response.status(500).send('Internal server error');
    }
}


const generateOTP = async (request, response) => {
    const requestSchema = Joi.object({
        email: Joi.string().email().required()
    });

    const {error, _} = requestSchema.validate(request.body);
    if (error) {
        return response.status(400).json({error: error.details[0].message});
    } else {
        const email = request.body.email;
        const otp_code = Math.floor(100000 + Math.random() * 800000);
        const user = await getUserByEmail(email);

        if (!user) {
            return response.status(404).json({error: "User not found"});
        }

        user.authentication.otp.code = otp_code;
        user.authentication.otp.expires = new Date(Date.now() + 1800000);

        await user.save().then(async () => {
            const htmlFilePath = './emails/verification_email.html';
            const htmlContent = await readFile(htmlFilePath, 'utf8');

            await sendEmail({
                from: 'info@fileserver.com',
                to: email,
                subject: 'FileServer - Verify Your Account',
                html: htmlContent.replace("{FULLNAME}", user.fullname)
                    .replace("{OTP_CODE}", otp_code.toString())
            });
        });

        response.status(200).json({message: "Verification email sent!"});
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

        const userData = request.body;
        const user = await getUserByEmail(userData.email);
        const currentTimestamp = new Date().getTime();

        if (user && hashCompare(userData.password, user.authentication.password)) {
            user.authentication.session.token = await hashSync(userData.email + Date.now(), genSaltSync(10));
            user.authentication.session.expires = new Date(Date.now() + 2592000000) // 30 days
            const updatedUser = await user.save();

            response.json({data: updatedUser}).status(200);
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
    generateOTP
}