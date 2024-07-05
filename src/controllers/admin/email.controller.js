import {deleteEmailById, getEmails, getEmailsCount} from "../../models/emails.js";
import {getUsersCount} from "../../models/users.js";
import Joi from "joi";

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
        const emails = await getEmails(1, 2);
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

export {
    getEmailCount,
    getUserCount,
    getAllEmails,
    getRecentEmails,
    emailDelete
}