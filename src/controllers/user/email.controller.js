import Joi from "joi";
import {sendEmail} from "../../helpers/mailer.helper.js";
import {getFileById} from "../../models/files.js";
import {createEmail, getEmailByUserId} from "../../models/emails.js";


const sendFileEmail = async (request, response) => {
    const emailData = request.body;
    const user = request.locals;
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
                sentByUser: user._id
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

const getUserEmails = async (request, response) => {
    try {
        const user = request.locals;
        if (!user) {
            return response.status(404).json({error: "User not found"});
        }
        const emails = await getEmailByUserId(user._id);
        response.status(200).json({data: emails});
    } catch (error) {
        console.error(error);
        response.status(500).json({error: "Internal server error"});
    }
}


export {sendFileEmail, getUserEmails}