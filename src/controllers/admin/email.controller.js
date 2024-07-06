import {createEmail, deleteEmailById, getEmails, getEmailsCount} from "../../models/emails.js";
import {getUsersCount} from "../../models/users.js";
import Joi from "joi";
import {getFileById} from "../../models/files.js";
import {sendEmail} from "../../helpers/mailer.helper.js";

const getEmailCount = async (request, response) => {
    try {
        const numberOfEmails = await getEmailsCount();
        if (numberOfEmails) {
            return response.status(200).json({data: {count: numberOfEmails}});
        } else {
            return response.status(404).json({error: "No downloads found"});
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const getUserCount = async (request, response) => {
    try {
        const numberOfUsers = await getUsersCount();
        if (numberOfUsers) {
            return response.status(200).json({data: {count: numberOfUsers}});
        } else {
            return response.status(404).json({error: "No users found"});
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const getAllEmails = async (request, response) => {
    try {
        const emails = await getEmails();
        if (emails) {
            return response.status(200).json({data: emails});
        } else {
            return response.status(404).json({error: "No emails found"});
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const getRecentEmails = async (request, response) => {
    try {
        const emails = await getEmails(0, 6);
        if (emails) {
            return response.status(200).json({data: emails});
        } else {
            return response.status(404).json({error: "No emails found"});
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const emailDelete = async (request, response) => {
    try {
        const emailData = request.params;
        const requestSchema = Joi.object({
            emailId: Joi.string().required()
        });

        const {error, _} = requestSchema.validate(emailData);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        }

        await deleteEmailById(emailData.emailId);
        return response.status(200).json({message: "Email deleted successfully"});
    } catch (error) {
        console.error(error);
        return response.status(500).json({error: "Internal Server Error"});
    }
}

const sendFileEmail = async (request, response) => {
    const emailData = request.body;
    const admin = request.locals;
    const requestSchema = Joi.object({
        recipient: Joi.string().email().required(),
        subject: Joi.string().required(),
        message: Joi.string().required(),
        fileId: Joi.string().required()
    });
    const {error, _} = requestSchema.validate(emailData);
    if (error) {
        return response.status(400).json({error: error.details[0].message});
    }

    const file = await getFileById(emailData.fileId);

    const message = `${emailData.message} <br> <br> <br>
        <a style="background: #b94e06; color: white; padding: 5px 10px; margin-top: 25px; 
        text-decoration: none; border-radius: 5px;" 
        href="https://file-server-zr8t.onrender.com/file/download/request/${file._id}" 
        target="_blank">Download File</a><br>`;

    const options = {
        from: 'no-reply-info@fileserver.com',
        to: emailData.recipient,
        subject: emailData.subject,
        html: message
    }

    await sendEmail(options)
        .then(async () => {
            await createEmail({
                recipient: emailData.recipient,
                subject: emailData.subject,
                content: message,
                file: emailData.fileId,
                sentByAdmin: admin._id
            }).then(() => {
                return response.status(200).json({message: "Email sent"});
            }).catch(() => {
                return response.status(500).json({error: "Internal server error"});
            });
        })
        .catch(() => {
            return response.status(500).json({error: "Internal server error"});
        });
}

export {
    getEmailCount,
    getUserCount,
    getAllEmails,
    getRecentEmails,
    emailDelete,
    sendFileEmail
}