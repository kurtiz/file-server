import {getFiles, getFilesByQuery, getFilesCount} from "../models/files.js";
import Joi from "joi";

const filesFeed = async (request, response) => {
    try {
        const page = parseInt(request.params.page) || 1;
        const limit = parseInt(request.params.limit) || 10;

        const skip = (page - 1) * limit;

        const files = await getFiles(skip, limit);
        const totalCount = await getFilesCount();

        response.status(200).json({
            data: {
                files: files,
                totalCount: totalCount,
                page: page,
                limit: limit,
            }
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({error: "Internal server error"});
    }
}


const searchFile = async (request, response) => {
    try {
        const params = request.params;

        const requestSchema = Joi.object({
            query: Joi.string().required()
        });

        const {error} = requestSchema.validate(params);
        if (error) {
            return response.status(400).json({error: error.details[0].message});
        }

        const query = { title: new RegExp(params.query, 'i') };
        const files = await getFilesByQuery(query);
        response.status(200).json({data: files});
    } catch (error) {
        console.error(error);
        response.status(500).json({error: "Internal server error"});
    }
}
export {filesFeed, searchFile}